using crudo.Common;
using crudo.DTOs.Order;
using crudo.DTOs.Shipping;
using crudo.Models;
using Microsoft.EntityFrameworkCore;

namespace crudo.Services
{
    public class OrderServices
    {
        private readonly CrudoContext _context;
        private readonly IInventoryService _inventoryService;
        private readonly ILogger<OrderServices> _logger;
        private const string DEFAULT_IMAGE_URL = "https://res.cloudinary.com/da8y2vp4k/image/upload/v1741205504/placeholderwebp_wakx4r.webp";
        private const string DEFAULT_STATUS = "Pending";

        public OrderServices(
            CrudoContext context,
            IInventoryService inventoryService,
            ILogger<OrderServices> logger)
        {
            _context = context;
            _inventoryService = inventoryService;
            _logger = logger;
        }

        private IQueryable<ReadOrderAdminDTO> GetOrdersAdminQuery()
        {
            return _context.CustomerOrders
                .Select(o => new ReadOrderAdminDTO
                {
                    Id = o.Id,
                    Status = o.Status.Name,
                    StatusId = o.StatusId,
                    Total = o.Total,
                    CreatedAt = o.CreatedAt,
                    UserId = o.UserId
                });
        }

        public async Task<PagedResult<ReadOrderAdminDTO>> GetOrdersAdmin(int page = 1, int pageSize = 5)
        {
            var query = GetOrdersAdminQuery();
            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ReadOrderAdminDTO>
            {
                Items = items,
                Total = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<ReadOrderAdminDTO>> GetOrdersAdminByStatus(int statusId, int page = 1, int pageSize = 10)
        {
            var query = GetOrdersAdminQuery().Where(o => o.StatusId == statusId);
            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ReadOrderAdminDTO>
            {
                Items = items,
                Total = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<IEnumerable<ReadOrderAdminDTO>> GetUserOrdersAdmin(string userId)
        {
            return await GetOrdersAdminQuery()
                .Where(o => o.UserId.Contains(userId.Substring(userId.IndexOf('|') + 1)))
                .ToListAsync();
        }

        private IQueryable<ReadOrderDTO> GetOrdersQuery(string userId, int? statusId)
        {
            return _context.CustomerOrders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new ReadOrderDTO
                {
                    Id = o.Id,
                    Status = o.Status.Name,
                    Total = o.Total,
                    CreatedAt = o.CreatedAt,
                    ShippingData = o.IdShippingDataNavigation,
                    Items = o.OrderItems.Select(i => new ReadOrderItemDTO
                    {
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        ProductImage = i.Product.ProductImages
                            .Where(pi => pi.IsCover)
                            .Select(pi => pi.FilePath)
                            .FirstOrDefault() ?? DEFAULT_IMAGE_URL,
                        Quantity = i.Quantity,
                        Price = i.Price,
                        Subtotal = i.Price * i.Quantity
                    }).ToList()
                });
        }

        public async Task<PagedResult<ReadOrderDTO>> GetOrders(string userId, int? statusId, int page = 1, int pageSize = 10)
        {
            _logger.LogInformation("Obteniendo órdenes para usuario {UserId}", userId);

            var query = GetOrdersQuery(userId, statusId);
            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ReadOrderDTO>
            {
                Items = items,
                Total = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<Result<ReadOrderAdminDTO>> UpdateOrderStatus(int orderId, int newStatusId)
        {
            try
            {
                _logger.LogInformation("Actualizando orden {OrderId} a estado {StatusId}", orderId, newStatusId);

                using var transaction = await _context.Database.BeginTransactionAsync();

                var order = await _context.CustomerOrders
                    .Include(o => o.Status)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                    return Result<ReadOrderAdminDTO>.Failure("Orden no encontrada");

                var newStatus = await _context.OrderStatuses.FindAsync(newStatusId);
                if (newStatus == null)
                    return Result<ReadOrderAdminDTO>.Failure($"Estado {newStatusId} no encontrado");

                order.StatusId = newStatusId;
                order.Status = newStatus;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Result<ReadOrderAdminDTO>.Success(new ReadOrderAdminDTO
                {
                    Id = order.Id,
                    Status = order.Status.Name,
                    StatusId = order.StatusId,
                    Total = order.Total,
                    CreatedAt = order.CreatedAt,
                    UserId = order.UserId,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error actualizando orden {OrderId}", orderId);
                return Result<ReadOrderAdminDTO>.Failure($"Error al actualizar: {ex.Message}");
            }
        }

        public async Task<Result<ReadOrderDTO>> CreateOrder(string userId, ShippingDataDTO shippingData)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _logger.LogInformation("Creando orden para usuario {UserId}", userId);

                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .Where(c => c.UserId == userId)
                    .FirstOrDefaultAsync();

                if (cart == null || !cart.CartItems.Any())
                    return Result<ReadOrderDTO>.Failure("El carrito está vacío o no existe.");

                if (!await _inventoryService.ValidateStock(cart.CartItems))
                    return Result<ReadOrderDTO>.Failure("No hay suficiente stock para algunos productos.");

                var total = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity);

                var defaultStatus = await _context.OrderStatuses
                    .FirstOrDefaultAsync(s => s.Name == DEFAULT_STATUS);

                if (defaultStatus == null)
                    return Result<ReadOrderDTO>.Failure("Estado por defecto no encontrado");

                var order = new CustomerOrder
                {
                    UserId = userId,
                    StatusId = defaultStatus.Id,
                    Total = total,
                    CreatedAt = DateTime.Now,
                };

                // Crear o asociar la dirección de envío
                if (shippingData.Id == null)
                {
                    var newShippingData = new ShippingDatum
                    {
                        FirstName = shippingData.FirstName,
                        LastName = shippingData.LastName,
                        City = shippingData.City,
                        PostalCode = shippingData.PostalCode,
                        Email = shippingData.Email,
                        Country = shippingData.Country,
                        Address = shippingData.Address,
                    };
                    _context.ShippingData.Add(newShippingData);
                    await _context.SaveChangesAsync();
                    order.IdShippingData = newShippingData.Id;
                }
                else
                {
                    order.IdShippingData = (int)shippingData.Id;
                }

                _context.CustomerOrders.Add(order);
                await _context.SaveChangesAsync();

                var orderItems = cart.CartItems.Select(item => new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Product.Price
                }).ToList();

                if (!await _inventoryService.ValidateAndUpdateStock(orderItems))
                {
                    await transaction.RollbackAsync();
                    return Result<ReadOrderDTO>.Failure("Error al actualizar el stock de los productos");
                }

                _context.OrderItems.AddRange(orderItems);
                await _context.SaveChangesAsync();

                _context.CartItems.RemoveRange(cart.CartItems);
                await _context.SaveChangesAsync();

                var result = new ReadOrderDTO
                {
                    Id = order.Id,
                    Status = defaultStatus.Name,
                    Total = order.Total,
                    CreatedAt = order.CreatedAt,
                    ShippingData = await _context.ShippingData.FindAsync(order.IdShippingData),
                    Items = orderItems.Select(oi => new ReadOrderItemDTO
                    {
                        ProductId = oi.ProductId,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        Subtotal = oi.Price * oi.Quantity,
                        ProductName = oi.Product.Name,
                        ProductImage = oi.Product.ProductImages
                            .Where(pi => pi.IsCover)
                            .Select(pi => pi.FilePath)
                            .FirstOrDefault() ?? DEFAULT_IMAGE_URL
                    }).ToList()
                };

                await transaction.CommitAsync();
                _logger.LogInformation("Orden {OrderId} creada exitosamente", order.Id);
                return Result<ReadOrderDTO>.Success(result);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creando orden para usuario {UserId}", userId);
                return Result<ReadOrderDTO>.Failure($"Error al crear la orden: {ex.Message}");
            }
        }

        public async Task<Result<ReadOrderDTO>> GetOrder(string userId, int orderId, bool isAdmin)
        {
            try
            {
                _logger.LogInformation("Obteniendo orden {OrderId} para usuario {UserId}", orderId, userId);

                var order = await _context.CustomerOrders
                    .Where(o => o.Id == orderId)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.ProductImages)
                    .Include(o => o.Status)
                    .Include(o => o.IdShippingDataNavigation)
                    .FirstOrDefaultAsync();

                if (order == null)
                    return Result<ReadOrderDTO>.Failure("Orden no encontrada");

                if (!isAdmin && order.UserId != userId)
                    return Result<ReadOrderDTO>.Failure("No tiene permiso para ver esta orden");

                var result = new ReadOrderDTO
                {
                    Id = order.Id,
                    Status = order.Status.Name,
                    Total = order.Total,
                    CreatedAt = order.CreatedAt,
                    ShippingData = order.IdShippingDataNavigation,
                    Items = order.OrderItems.Select(i => new ReadOrderItemDTO
                    {
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        ProductImage = i.Product.ProductImages
                            .Where(pi => pi.IsCover)
                            .Select(pi => pi.FilePath)
                            .FirstOrDefault() ?? DEFAULT_IMAGE_URL,
                        Quantity = i.Quantity,
                        Price = i.Price,
                        Subtotal = i.Price * i.Quantity
                    }).ToList()
                };

                return Result<ReadOrderDTO>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error obteniendo orden {OrderId}", orderId);
                return Result<ReadOrderDTO>.Failure($"Error al obtener la orden: {ex.Message}");
            }
        }
    }
}

using crudo.DTOs.Cart;
using crudo.DTOs.Order;
using crudo.DTOs.Shipping;
using crudo.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.Extensions.Logging;

namespace crudo.Services
{
    public class CartServices
    {
        private readonly CrudoContext _context;
        private readonly MailgunService _mailgunService;
        private readonly ILogger<CartServices> _logger;

        public CartServices(CrudoContext context, MailgunService mailgunService, ILogger<CartServices> logger)
        {
            _context = context;
            _mailgunService = mailgunService;
            _logger = logger;
        }

        public async Task<ReadCartDTO> GetCart(string userId)
        {
            _logger.LogInformation($"Obteniendo carrito para el usuario {userId}");

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(i => i.Product)
                .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                _logger.LogInformation($"Carrito no encontrado para el usuario {userId}, creando uno nuevo");
                cart = new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Nuevo carrito creado con ID {cart.Id}");
            }

            var dto = new ReadCartDTO
            {
                Id = cart.Id,
                Items = cart.CartItems.Select(i => new ReadCartItemDTO
                {
                    ItemId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Price = i.Product.Price,
                    Quantity = i.Quantity,
                    Subtotal = i.Product.Price * i.Quantity,
                    ImageUrl = i.Product.ProductImages.FirstOrDefault(pi => pi.IsCover == true)?.FilePath ?? "https://res.cloudinary.com/da8y2vp4k/image/upload/v1741205504/placeholderwebp_wakx4r.webp"
                }).ToList(),
                Total = cart.CartItems.Sum(i => i.Product.Price * i.Quantity)
            };

            _logger.LogInformation($"Carrito obtenido exitosamente para el usuario {userId}");
            return dto;
        }

        public async Task<AddToCartResponse> AddToCart(string userId, AddToCartDTO dto)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    cart = new Cart
                    {
                        UserId = userId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CartItems = new List<CartItem>()
                    };
                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync();
                }

                var existingItem = cart.CartItems.FirstOrDefault(i => i.ProductId == dto.ProductId);
                var product = await _context.Products.FindAsync(dto.ProductId);

                if (product == null)
                {
                    throw new ArgumentException("Producto no encontrado.");
                }

                if (existingItem != null)
                {
                    if (existingItem.Quantity + dto.Quantity > product.Stock)
                    {
                        throw new InvalidOperationException($"No hay suficiente stock para el producto. Stock disponible: {product.Stock}.");
                    }
                    existingItem.Quantity += dto.Quantity;
                }
                else
                {
                    if (dto.Quantity > product.Stock)
                    {
                        throw new InvalidOperationException($"No hay suficiente stock para el producto '{product.Name}'. Stock disponible: {product.Stock}.");
                    }
                    var newItem = new CartItem
                    {
                        CartId = cart.Id,
                        ProductId = dto.ProductId,
                        Quantity = dto.Quantity,
                    };
                    cart.CartItems.Add(newItem);
                }

                cart.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Producto agregado al carrito exitosamente. ID del carrito: {cart.Id}");
                return new AddToCartResponse
                {
                    Success = true,
                    Message = "Producto agregado al carrito exitosamente.",
                    CartItem = existingItem ?? cart.CartItems.Last()
                };
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Error al agregar producto al carrito");
                return new AddToCartResponse
                {
                    Success = false,
                    Message = ex.Message
                };
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Error al agregar producto al carrito");
                return new AddToCartResponse
                {
                    Success = false,
                    Message = ex.Message
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al agregar producto al carrito");
                return new AddToCartResponse
                {
                    Success = false,
                    Message = $"Error al agregar al carrito: {ex.Message}"
                };
            }
        }

        public async Task<bool> RemoveFromCart(string userId, int itemId)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null) return false;
                var item = cart.CartItems.FirstOrDefault(i => i.Id == itemId);
                if (item == null) return false;

                _context.CartItems.Remove(item);

                cart.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Producto removido del carrito exitosamente. ID del carrito: {cart.Id}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al remover producto del carrito");
                return false;
            }
        }

        public async Task<ReadCartItemDTO> UpdateQuantity(string userId, int itemId, int amount)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null) return null;
                CartItem cartItem = cart.CartItems.FirstOrDefault(c => c.Id == itemId);
                if (cartItem == null) return null;

                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == cartItem.ProductId);
                if (product == null) return null;

                if (product.Stock >= cartItem.Quantity + amount)
                {
                    cartItem.Quantity += amount;
                }
                else
                {
                    return null;
                }

                cart.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                ReadCartItemDTO readCartItemDTO = new ReadCartItemDTO
                {
                    ItemId = cartItem.Id,
                    ProductId = cartItem.ProductId,
                    ProductName = product.Name,
                    Quantity = cartItem.Quantity,
                    Subtotal = product.Price * cartItem.Quantity,
                };
                return readCartItemDTO;
            }
            catch
            {
                return null;
            }
        }

        public async Task<ReadOrderDTO> Checkout(string userId, ShippingDataDTO shippingData)
        {
            // Usar la estrategia de ejecución del contexto
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // Obtener el carrito del usuario con los productos y cantidades
                    var cart = await _context.Carts
                        .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Product)
                        .Where(c => c.UserId == userId)
                        .FirstOrDefaultAsync();

                    // Si el carrito no existe o está vacío, retornar un error
                    if (cart == null || cart.CartItems.Count == 0)
                    {
                        return new ReadOrderDTO
                        {
                            ErrorMessage = "El carrito está vacío o no existe."
                        };
                    }

                    // Calcular el total del carrito
                    var total = cart.CartItems
                        .Sum(ci => ci.Product.Price * ci.Quantity);

                    // Obtener el estado por defecto del pedido (Pendiente)
                    OrderStatus defaultStatus = await _context.OrderStatuses
                        .FirstOrDefaultAsync(s => s.Name == "Pending");

                    // Crear un nuevo pedido
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
                        ShippingDatum newShippingData = new ShippingDatum
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

                    // Agregar el pedido a la base de datos
                    _context.CustomerOrders.Add(order);
                    await _context.SaveChangesAsync();

                    // Agrupar los items del carrito por Producto (ProductId) y sumar la cantidad total
                    var groupedItems = cart.CartItems
                        .GroupBy(ci => ci.ProductId)
                        .Select(group => new
                        {
                            ProductId = group.Key,
                            TotalQuantity = group.Sum(g => g.Quantity)
                        })
                        .ToList();

                    // Verificar si hay suficiente stock para los productos
                    var productIds = groupedItems.Select(g => g.ProductId).ToList();
                    var products = await _context.Products
                        .Where(p => productIds.Contains(p.Id))
                        .ToListAsync();

                    // Verificar disponibilidad y reducir el stock de los productos en paralelo
                    var tasks = groupedItems.Select(async item =>
                    {
                        var product = products.FirstOrDefault(p => p.Id == item.ProductId);
                        if (product == null || product.Stock < item.TotalQuantity)
                        {
                            throw new Exception($"No hay suficiente stock para el producto con ID: {item.ProductId}.");
                        }

                        // Reducir el stock de manera segura
                        product.Stock -= item.TotalQuantity;
                    });

                    // Ejecutar todas las tareas en paralelo y esperar a que se completen
                    await Task.WhenAll(tasks);

                    // Guardar los cambios de stock
                    await _context.SaveChangesAsync();

                    // Crear los items del pedido a partir de los items del carrito
                    var orderItems = cart.CartItems.Select(item => new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                    }).ToList();

                    // Guardar los items del pedido en la base de datos
                    _context.OrderItems.AddRange(orderItems);
                    await _context.SaveChangesAsync();

                    // Eliminar los productos del carrito una vez procesado el pedido
                    _context.CartItems.RemoveRange(cart.CartItems);
                    await _context.SaveChangesAsync();

                    var sd = await _context.ShippingData.FirstOrDefaultAsync(s => s.Id == order.IdShippingData);

                    // Crear el DTO de respuesta con la información del pedido
                    var newOrder = new ReadOrderDTO
                    {
                        Id = order.Id,
                        ShippingData = sd,
                        Status = defaultStatus.Name,
                        Total = order.Total,
                        CreatedAt = order.CreatedAt,
                        Items = orderItems.Select(oi => new ReadOrderItemDTO
                        {
                            ProductId = oi.ProductId,
                            Quantity = oi.Quantity,
                            Price = products.First(p => p.Id == oi.ProductId).Price,
                            ProductName = products.First(p => p.Id == oi.ProductId).Name,
                            ProductImage = products.First(p => p.Id == oi.ProductId).ProductImages
                                .FirstOrDefault(im => im.IsCover == true)?.FilePath ?? "https://res.cloudinary.com/da8y2vp4k/image/upload/v1741205504/placeholderwebp_wakx4r.webp"
                        }).ToList()
                    };

                    // Si todo fue correcto, confirmar la transacción
                    await transaction.CommitAsync();

                    // Enviar email de confirmación
                    var emailBody = GenerateOrderConfirmationEmailBody(order, orderItems, sd.Email);
                    await _mailgunService.SendEmailAsync(sd.Email, "Confirmación de Pedido #" + order.Id, emailBody);

                    return newOrder;
                }
                catch (Exception ex)
                {
                    // En caso de error, revertir la transacción
                    await transaction.RollbackAsync();

                    // Retornar un DTO con un mensaje de error más detallado
                    return new ReadOrderDTO
                    {
                        ErrorMessage = $"Hubo un error al procesar el pedido: {ex.Message}. Por favor, intente nuevamente."
                    };
                }
            });
        }

        public string GenerateOrderConfirmationEmailBody(CustomerOrder order, List<OrderItem> orderItems, string customerEmail)
        {
            var sb = new StringBuilder();

            // Agregar estilos CSS inline
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("<meta charset='utf-8'>");
            sb.AppendLine("<style>");
            sb.AppendLine("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine(".header { text-align: center; padding: 20px 0; }");
            sb.AppendLine(".order-details { margin: 20px 0; }");
            sb.AppendLine("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
            sb.AppendLine("th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }");
            sb.AppendLine("th { background-color: #f8f9fa; }");
            sb.AppendLine(".total { font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0; }");
            sb.AppendLine(".footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }");
            sb.AppendLine("</style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("<div class='container'>");

            // Header
            sb.AppendLine("<div class='header'>");
            sb.AppendLine($"<h1>Confirmación de Pedido #{order.Id}</h1>");
            sb.AppendLine($"<p>¡Gracias por tu compra, {order.IdShippingDataNavigation.FirstName}!</p>");
            sb.AppendLine("<p>Tu pedido ha sido recibido y está siendo procesado.</p>");
            sb.AppendLine("</div>");

            // Shipping Details
            sb.AppendLine("<div class='order-details'>");
            sb.AppendLine("<h2>Dirección de envío</h2>");
            sb.AppendLine($"<p><strong>{order.IdShippingDataNavigation.FirstName} {order.IdShippingDataNavigation.LastName}</strong><br>");
            sb.AppendLine($"{order.IdShippingDataNavigation.Address}<br>");
            sb.AppendLine($"{order.IdShippingDataNavigation.City}, {order.IdShippingDataNavigation.Country}<br>");
            sb.AppendLine($"Código Postal: {order.IdShippingDataNavigation.PostalCode}</p>");
            sb.AppendLine("</div>");

            // Order Details
            sb.AppendLine("<div class='order-details'>");
            sb.AppendLine("<h2>Detalles del Pedido</h2>");
            sb.AppendLine("<table>");
            sb.AppendLine("<tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>");

            foreach (var item in orderItems)
            {
                var subtotal = item.Quantity * item.Price;
                sb.AppendLine($"<tr>");
                sb.AppendLine($"<td>{item.Product.Name}</td>");
                sb.AppendLine($"<td>{item.Quantity}</td>");
                sb.AppendLine($"<td>${item.Price:N2}</td>");
                sb.AppendLine($"<td>${subtotal:N2}</td>");
                sb.AppendLine($"</tr>");
            }

            sb.AppendLine("</table>");

            // Total
            sb.AppendLine($"<div class='total'>Total: ${order.Total:N2}</div>");

            // Footer
            sb.AppendLine("<div class='footer'>");
            sb.AppendLine("<p>¡Gracias por comprar con nosotros!</p>");
            sb.AppendLine("<p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>");
            sb.AppendLine("</div>");

            sb.AppendLine("</div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }
    }
}
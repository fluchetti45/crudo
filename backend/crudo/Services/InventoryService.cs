using crudo.Models;
using Microsoft.EntityFrameworkCore;

namespace crudo.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly CrudoContext _context;
        private readonly ILogger<InventoryService> _logger;

        public InventoryService(CrudoContext context, ILogger<InventoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<bool> ValidateAndUpdateStock(IEnumerable<OrderItem> items)
        {
            try
            {
                var groupedItems = items
                    .GroupBy(i => i.ProductId)
                    .Select(g => new { ProductId = g.Key, Quantity = g.Sum(i => i.Quantity) });

                foreach (var item in groupedItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null || product.Stock < item.Quantity)
                    {
                        _logger.LogWarning("Stock insuficiente para producto {ProductId}", item.ProductId);
                        return false;
                    }
                    product.Stock -= item.Quantity;
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al validar y actualizar stock");
                return false;
            }
        }

        public async Task<bool> ValidateStock(IEnumerable<CartItem> items)
        {
            try
            {
                var groupedItems = items
                    .GroupBy(ci => ci.ProductId)
                    .Select(g => new { ProductId = g.Key, Quantity = g.Sum(i => i.Quantity) });

                foreach (var item in groupedItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null || product.Stock < item.Quantity)
                    {
                        _logger.LogWarning("Stock insuficiente para producto {ProductId}", item.ProductId);
                        return false;
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al validar stock");
                return false;
            }
        }
    }
}
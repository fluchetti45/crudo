using crudo.Models;

namespace crudo.Services
{
    public interface IInventoryService
    {
        Task<bool> ValidateAndUpdateStock(IEnumerable<OrderItem> items);
        Task<bool> ValidateStock(IEnumerable<CartItem> items);
    }
}
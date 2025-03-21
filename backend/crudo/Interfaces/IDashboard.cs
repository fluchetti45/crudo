using crudo.DTOs.Dashboard;

namespace crudo.Interfaces
{
    public interface IDashboard
    {
        Task<int> GetTotalProductsAsync();
        Task<int> GetTotalCategoriesAsync();
        Task<int> GetTotalOrdersAsync();
        Task<List<ProductsByCategoryCount>> GetTotalProductsByCategoryAsync();
    }
}

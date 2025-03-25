using crudo.DTOs.Dashboard;
namespace crudo.DTOs.Dashboard
{
    public class DashboardData
    {
        public int TotalProducts { get; set; }
        public int TotalCategories { get; set; }
        public int TotalOrders { get; set; }
        public List<ProductsByCategoryCount> ProductsByCategory { get; set; }
        public decimal TotalSales { get; set; }
        public List<TopProduct> TopProducts { get; set; }
        public List<TopCategory> TopCategories { get; set; }
        public List<OrderCount> OrderStatus { get; set; }
    }
}

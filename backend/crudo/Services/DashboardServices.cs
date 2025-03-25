using crudo.Models;
using Microsoft.EntityFrameworkCore;
using crudo.Interfaces;
using crudo.DTOs.Dashboard;

namespace crudo.Services
{
    public class DashboardServices : IDashboard
    {
        private readonly CrudoContext _context;
        private readonly ILogger<DashboardServices> _logger;

        public DashboardServices(CrudoContext context, ILogger<DashboardServices> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<DashboardData> GetDashboardData()
        {
            _logger.LogInformation("Obteniendo datos del dashboard");

            var totalProducts = await GetTotalProductsAsync();
            var totalCategories = await GetTotalCategoriesAsync();
            var totalOrders = await GetTotalOrdersAsync();
            var productsByCategory = await GetTotalProductsByCategoryAsync();
            var totalSales = await GetTotalSalesAsync();
            var topProducts = await GetTopFiveProductsAsync();
            var topCategories = await GetTopFiveCategoriesAsync();
            var orderStatus = await GetOrderStatusAsync();

            return new DashboardData
            {
                TotalProducts = totalProducts,
                TotalCategories = totalCategories,
                TotalOrders = totalOrders,
                ProductsByCategory = productsByCategory,
                TotalSales = totalSales,
                TopProducts = topProducts,
                TopCategories = topCategories,
                OrderStatus = orderStatus
            };
        }

        public async Task<decimal> GetTotalSalesAsync()
        {
            _logger.LogInformation("Obteniendo total de ventas");

            try
            {
                return await _context.CustomerOrders.SumAsync(o => o.Total);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener el total de ventas {ex}", ex);
                throw new Exception("Error al obtener el total de ventas", ex);
            }

        }

        public async Task<int> GetTotalProductsAsync()
        {
            _logger.LogInformation("Obteniendo total de productos");
            try
            {
                return await _context.Products.Select(p => p.Id).Distinct().CountAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener el total de productos {ex}", ex);
                throw new Exception("Error al obtener el total de productos", ex);
            }
        }

        public async Task<int> GetTotalCategoriesAsync()
        {
            _logger.LogInformation("Obteniendo total de categorías");

            try
            {
                return await _context.Categories.Select(c => c.Id).Distinct().CountAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener el total de categorías {ex}", ex);
                throw new Exception("Error al obtener el total de categorías", ex);
            }

        }

        public async Task<int> GetTotalOrdersAsync()
        {
            _logger.LogInformation("Obteniendo total de pedidos");

            try
            {
                return await _context.CustomerOrders.Select(o => o.Id).Distinct().CountAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener el total de pedidos {ex}", ex);
                throw new Exception("Error al obtener el total de pedidos", ex);
            }
        }

        public async Task<List<ProductsByCategoryCount>> GetTotalProductsByCategoryAsync()
        {
            _logger.LogInformation("Obteniendo total de productos por categoría");

            try
            {
                var productsByCategory = await _context.Categories
                    .Select(category => new ProductsByCategoryCount
                    {
                        CategoryId = category.Id,
                        CategoryName = category.Name,
                        TotalProducts = _context.Products.Count(p => p.CategoryId == category.Id)
                    }).OrderByDescending(p => p.TotalProducts).ToListAsync();
                return productsByCategory;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener el total de productos por categoría {ex}", ex);
                throw new Exception("Error al obtener el total de productos por categoría", ex);
            }
        }

        // Top 5 productos más vendidos
        public async Task<List<TopProduct>> GetTopFiveProductsAsync()
        {
            _logger.LogInformation("Obteniendo los 5 productos más vendidos");
            try
            {
                var topProducts = await _context.OrderItems
                    .GroupBy(o => o.ProductId)
                    .Select(g => new
                    {
                        ProductId = g.Key,
                        TotalSold = g.Sum(o => o.Quantity)
                    })
                    .Join(
                        _context.Products,
                        o => o.ProductId,
                        p => p.Id,
                        (o, p) => new TopProduct
                        {
                            ProductId = p.Id,
                            ProductName = p.Name,
                            TotalSold = o.TotalSold
                        }
                    )
                    .OrderByDescending(p => p.TotalSold)
                    .Take(5)
                    .ToListAsync();

                return topProducts;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener los 5 productos más vendidos {ex}", ex);
                throw new Exception("Error al obtener los 5 productos más vendidos", ex);
            }
        }

        // Categorias mas vendidas
        public async Task<List<TopCategory>> GetTopFiveCategoriesAsync()
        {
            try
            {
                var topCategories = await _context.OrderItems
                    .GroupBy(o => o.Product.CategoryId)
                    .Select(g => new
                    {
                        CategoryId = g.Key,
                        TotalSales = g.Sum(o => o.Quantity)
                    })
                    .Join(
                        _context.Categories,
                        o => o.CategoryId,
                        c => c.Id,
                        (o, c) => new TopCategory
                        {
                            CategoryId = c.Id,
                            CategoryName = c.Name,
                            TotalSales = o.TotalSales
                        }
                    )
                    .OrderByDescending(c => c.TotalSales)
                    .Take(5)
                    .ToListAsync();

                return topCategories;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener las categorias más vendidas {ex}", ex);
                throw new Exception("Error al obtener las categorias más vendidas", ex);
            }

        }

        // Estados de pedidos
        public async Task<List<OrderCount>> GetOrderStatusAsync()
        {
            try
            {
                var orderStatus = await _context.CustomerOrders
                    .GroupBy(o => o.StatusId)
                    .Select(g => new OrderCount
                    {
                        StatusId = g.Key,
                        Status = g.First().Status.Name,
                        TotalOrders = g.Count()
                    }).OrderByDescending(o => o.TotalOrders)
                    .ToListAsync();
                return orderStatus;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al obtener los estados de pedidos {ex}", ex);
                throw new Exception("Error al obtener los estados de pedidos", ex);
            }
        }


        // Ventas por fecha
        //SELECT CAST(created_at AS DATE) AS fecha, COUNT(DISTINCT(id)) AS ventas FROM CustomerOrder GROUP BY CAST(created_at AS Date)
        //ORDER BY ventas DESC;



    }
}

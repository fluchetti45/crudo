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

            return new DashboardData
            {
                TotalProducts = totalProducts,
                TotalCategories = totalCategories,
                TotalOrders = totalOrders,
                ProductsByCategory = productsByCategory,
                TotalSales = totalSales
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
    }
}

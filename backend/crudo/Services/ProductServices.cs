using crudo.Common;
using crudo.DTOs.Product;
using crudo.Interfaces;
using crudo.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace crudo.Services
{
    public class ProductServices : IProduct
    {
        private readonly CrudoContext _context;

        private readonly string _recommenderApiUrl;
        private readonly ProductImageServices _imagesService;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        private readonly ILogger<ProductServices> _logger;

        private readonly HttpClient _httpClient;

        private readonly string CoverPlaceholder;
        public ProductServices(CrudoContext context, ProductImageServices imageServices, IServiceScopeFactory serviceScopeFactory, ILogger<ProductServices> logger)
        {
            _context = context;
            _imagesService = imageServices;
            _serviceScopeFactory = serviceScopeFactory;
            CoverPlaceholder = "https://res.cloudinary.com/da8y2vp4k/image/upload/v1741205504/placeholderwebp_wakx4r.webp";
            _recommenderApiUrl = Environment.GetEnvironmentVariable("RECOMMENDER_API_URL");
            _httpClient = new HttpClient();
            _logger = logger;
        }

        public async Task<ReadProductDTO> GetProductBasic(int productId)
        {
            try
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<CrudoContext>();
                    ReadProductDTO product = await context.Products
                        .Where(p => p.Id == productId && p.isDeleted == false)
                        .Select(p => new ReadProductDTO
                        {
                            Id = p.Id,
                            Name = p.Name,
                            Description = p.Description,
                            Price = p.Price,
                            Stock = p.Stock,
                            CreatedAt = p.CreatedAt,
                            UpdatedAt = p.UpdatedAt,
                            CategoryId = p.CategoryId,
                            CategoryName = p.Category.Name,
                            filePathCover = context.ProductImages
                                .Where(pi => pi.ProductId == p.Id && pi.IsCover == true)
                                .Select(pi => pi.FilePath)
                                .FirstOrDefault() ?? this.CoverPlaceholder
                        })
                        .FirstOrDefaultAsync();
                    return product;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IEnumerable<ReadProductDTO>> GetProducts()
        {
            try
            {
                IEnumerable<ReadProductDTO> products = await _context.Products
                    .Where(p => p.isDeleted == false) // Filtrar productos no eliminados
                    .Select(p => new ReadProductDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Stock = p.Stock,
                        IsDeleted = p.isDeleted,
                        CategoryId = p.CategoryId,
                        CategoryName = p.Category.Name,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        // Obtener la imagen portada de manera eficiente
                        filePathCover = _context.ProductImages
                                               .Where(pi => pi.ProductId == p.Id && pi.IsCover == true)
                                               .Select(pi => pi.FilePath)
                                               .FirstOrDefault() ?? this.CoverPlaceholder
                    })
                    .ToListAsync();

                return products;
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return null;
            }
        }

        private IQueryable<ReadProductDTO> GetProductsAdminQuery()
        {
            return _context.Products
                .Select(p => new ReadProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    IsDeleted = p.isDeleted,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    // Obtener la imagen portada de manera eficiente
                    filePathCover = _context.ProductImages
                                               .Where(pi => pi.ProductId == p.Id && pi.IsCover == true)
                                               .Select(pi => pi.FilePath)
                                               .FirstOrDefault() ?? this.CoverPlaceholder
                }
                );
        }

        public async Task<PagedResult<ReadProductDTO>> GetProductsAdmin(int page = 1, int pageSize = 10)
        {
            try
            {
                var query = GetProductsAdminQuery();
                var total = await query.CountAsync();
                var items = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<ReadProductDTO>
                {
                    Items = items,
                    Total = total,
                    Page = page,
                    PageSize = pageSize
                };
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return null;
            }
        }



        public async Task<IEnumerable<ReadProductDTO>> GetProductsByCategory(int categoryId)
        {
            try
            {
                IEnumerable<ReadProductDTO> products = await _context.Products
                    .Where(p => p.CategoryId == categoryId && p.isDeleted == false) // Filtro de categoría y no eliminados
                    .Select(p => new ReadProductDTO
                    {
                        Id = p.Id,
                        CategoryId = p.CategoryId,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Stock = p.Stock,
                        CreatedAt = p.CreatedAt,
                        // Filtrar la imagen portada de manera más eficiente
                        filePathCover = _context.ProductImages
                                               .Where(pi => pi.ProductId == p.Id && pi.IsCover == true)
                                               .Select(pi => pi.FilePath)
                                               .FirstOrDefault() ?? this.CoverPlaceholder
                    })
                    .ToListAsync();

                return products;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<Product> GetProduct(int productId)
        {
            try
            {
                // Obtener el producto principal
                Product product;
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<CrudoContext>();
                    product = await context.Products
                    .Include(p => p.ProductImages)
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == productId);
                }

                if (product == null)
                {
                    return null;
                }

                return product;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<RelatedProductDTO>> GetRelatedProducts(int productId)
        {
            var response = await _httpClient.GetAsync($"{_recommenderApiUrl}/recommend/{productId}");
            if (!response.IsSuccessStatusCode)
            {
                return null;

            }
            var content = await response.Content.ReadAsStringAsync();
            var relatedProducts = JsonConvert.DeserializeObject<RecommendResponseDTO>(content);
            var productIds = relatedProducts.ProductIds;
            var TaskList = new List<Task<RelatedProductDTO>>();
            foreach (var id in productIds)
            {
                TaskList.Add(GetRelatedProductDTO(id));
            }
            var products = await Task.WhenAll(TaskList);
            return products.ToList();
        }

        private async Task<RelatedProductDTO> GetRelatedProductDTO(int productId)
        {
            _logger.LogInformation($"Obteniendo producto con ID: {productId}");
            try
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<CrudoContext>();
                    var product = await context.Products
                        .Where(p => p.Id == productId)
                        .Include(p => p.ProductImages)
                        .Select(p => new RelatedProductDTO
                        {
                            Id = p.Id,
                            Name = p.Name,
                            Price = p.Price,
                            Stock = p.Stock,
                            filePathCover = p.ProductImages
                                .Where(pi => pi.IsCover == true)
                                .Select(pi => pi.FilePath).FirstOrDefault()
                        })
                        .FirstOrDefaultAsync();
                    if (product != null)
                    {
                        return product;
                    }
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }



        public async Task<IEnumerable<ReadProductDTO>> GetFilteredProducts(string q)
        {
            try
            {
                return await GetFilteredProductsByQuery(q);
                IEnumerable<ReadProductDTO> products = await _context.Products.Where(p => p.isDeleted == false && EF.Functions.Like(p.Name, $"%{q}%")).Select(p => new ReadProductDTO
                {
                    Id = p.Id,
                    CategoryId = p.CategoryId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CreatedAt = p.CreatedAt,
                    // Filtramos las imágenes que son portada
                    filePathCover = p.ProductImages
                                          .Where(pi => pi.IsCover == true)
                                          .Select(pi => pi.FilePath)
                                          .FirstOrDefault() ?? this.CoverPlaceholder

                }).ToListAsync();
                if (products.Any())
                {
                    return products;
                }
                else{
                    return await GetFilteredProductsByQuery(q);
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private async Task<IEnumerable<ReadProductDTO>> GetFilteredProductsByQuery(string q)
        {
            var response = await _httpClient.GetAsync($"{_recommenderApiUrl}/recommend/search?query={q}");
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }
            var content = await response.Content.ReadAsStringAsync();
            var relatedProducts = JsonConvert.DeserializeObject<RecommendResponseDTO>(content);
            var productIds = relatedProducts.ProductIds;
            var TaskList = new List<Task<ReadProductDTO>>();
            foreach (var id in productIds)
            {
                TaskList.Add(GetProductBasic(id));
            }
            var products = await Task.WhenAll(TaskList);
            return products.ToList();
        }
        
        public async Task<Product> CreateProduct(CreateProductDTO productDTO)
        {
            try
            {
                // Creo el producto
                Product product = new Product
                {
                    Name = productDTO.Name,
                    Description = productDTO.Description,
                    Price = productDTO.Price,
                    Stock = productDTO.Stock,
                    CategoryId = productDTO.CategoryId,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                await this._context.Products.AddAsync(product);
                await this._context.SaveChangesAsync();
                // Subo las imagenes
                await _imagesService.UploadImages(product.Id, productDTO.Images);
                return product;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> DeleteProduct(int productId)
        {
            try
            {
                Product producto = await _context.Products
                    .Include(p => p.ProductImages)
                        .FirstOrDefaultAsync(p => p.Id == productId);

                if (producto == null)
                    return false;
                producto.isDeleted = !producto.isDeleted;
                _context.Products.Update(producto);
                await this._context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex) { return false; }
        }


        public async Task<EditProductDTO> UpdateProduct(EditProductDTO productDTO)
        {
            try
            {
                Product product = await this._context.Products.FirstOrDefaultAsync(p => p.Id == productDTO.Id);
                if (product == null)
                {
                    return null;
                }
                // Actualizo el producto
                product.Name = productDTO.Name;
                product.Description = productDTO.Description;
                product.Price = productDTO.Price;
                product.Stock = productDTO.Stock;
                product.CategoryId = productDTO.CategoryId;
                product.UpdatedAt = DateTime.Now;
                // Actualizo el producto en la base de datos
                _context.Products.Update(product);
                await this._context.SaveChangesAsync();
                // Devuelvo el producto actualizado
                EditProductDTO editedProduct = new EditProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    CategoryId = product.CategoryId,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock,
                };
                return editedProduct;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IEnumerable<ReadProductDTO>> GetTopProducts()
        {
            try
            {
                // Obtengo los productos mas vendidos con un join directo
                IEnumerable<ReadProductDTO> orderedProducts = await _context.OrderItems
                    .GroupBy(o => o.ProductId)
                    .Select(g => new { ProductId = g.Key, TotalQuantity = g.Sum(o => o.Quantity) })
                    .OrderByDescending(g => g.TotalQuantity)
                    .Take(8)
                    .Join(
                        _context.Products,
                        top => top.ProductId,
                        product => product.Id,
                        (top, product) => new ReadProductDTO
                        {
                            Id = product.Id,
                            Name = product.Name,
                            Description = product.Description,
                            Price = product.Price,
                            Stock = product.Stock,
                            CreatedAt = product.CreatedAt,
                            filePathCover = product.ProductImages
                                .Where(pi => pi.IsCover == true)
                                .Select(pi => pi.FilePath)
                                .FirstOrDefault() ?? this.CoverPlaceholder
                        }
                    )
                    .ToListAsync();

                return orderedProducts;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}

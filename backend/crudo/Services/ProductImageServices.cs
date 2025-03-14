using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using crudo.Interfaces;
using crudo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace crudo.Services
{
    public class ProductImageServices : IProductImage
    {
        private readonly CrudoContext _context;
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<ProductImageServices> _logger;

        public ProductImageServices(CrudoContext context, IConfiguration configuration, ILogger<ProductImageServices> logger)
        {
            _context = context;
            _logger = logger;

            var acc = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(acc);
        }

        public async Task<List<ProductImage>> UploadImages(int productId, IFormFile[] images)
        {
            _logger.LogInformation($"Iniciando carga de {images.Length} imágenes para el producto {productId}");

            var uploadTasks = new List<Task<ImageUploadResult>>();
            var imageEntities = new List<ProductImage>();

            foreach (var (image, index) in images.Select((value, i) => (value, i)))
            {
                _logger.LogInformation($"Preparando imagen {index + 1}/{images.Length} para subir a Cloudinary");
                var stream = image.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(image.FileName, stream),
                    Folder = "CRUDO/products"
                };

                uploadTasks.Add(_cloudinary.UploadAsync(uploadParams));
            }

            _logger.LogInformation("Esperando que todas las imágenes se suban a Cloudinary");
            var uploadResults = await Task.WhenAll(uploadTasks);
            _logger.LogInformation($"Subida a Cloudinary completada. Resultados: {uploadResults.Length}");

            // Crear las entidades de imagen fuera de la transacción
            foreach (var (uploadResult, index) in uploadResults.Select((result, i) => (result, i)))
            {
                _logger.LogInformation($"Creando entidad para imagen {index + 1} con URL: {uploadResult.SecureUrl}");
                var imageEntity = new ProductImage
                {
                    ProductId = productId,
                    FilePath = uploadResult.SecureUrl.ToString(),
                    IsCover = index == 0,
                    CreatedAt = DateTime.UtcNow
                };

                imageEntities.Add(imageEntity);
            }

            // Usar la estrategia de ejecución del contexto
            var strategy = _context.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    _logger.LogInformation($"Insertando {imageEntities.Count} entidades en la base de datos");
                    await _context.ProductImages.AddRangeAsync(imageEntities);

                    var saveResult = await _context.SaveChangesAsync();
                    _logger.LogInformation($"Guardado en base de datos completado. Registros afectados: {saveResult}");

                    await transaction.CommitAsync();
                    _logger.LogInformation("Transacción completada exitosamente");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error durante el proceso de guardado en base de datos");
                    await transaction.RollbackAsync();
                    _logger.LogInformation("Transacción revertida");
                    throw;
                }
            });

            return imageEntities;
        }


        public async Task<IEnumerable<ProductImage>> GetProductImages(int productId)
        {
            var images = await _context.ProductImages.Where(im => im.ProductId == productId).ToListAsync();
            return images;
        }

        public async Task<ProductImage> GetProductImage(int productId, int imageId)
        {
            var image = await _context.ProductImages.Where(im => im.Id == imageId).FirstOrDefaultAsync();
            return image;
        }

        public async Task<bool> DeleteProductImage(int imageId)
        {
            try
            {
                var image = await _context.ProductImages.FirstOrDefaultAsync(im => im.Id == imageId);
                if (image == null || image.IsCover == true)
                {
                    return false;
                }

                var publicId = "CRUDO/products/" + image.FilePath.Split('/').Last().Split('.').First();

                var deleteParams = new DeletionParams(publicId);
                var result = await _cloudinary.DestroyAsync(deleteParams);

                if (result.Result == "ok")
                {
                    _context.ProductImages.Remove(image);
                    var dbResult = await _context.SaveChangesAsync();
                    return dbResult > 0;
                }

                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> UpdateProductImageCover(int productId, int imageId)
        {
            var cover = await _context.ProductImages.Where(im => im.ProductId == productId && im.IsCover == true).FirstOrDefaultAsync();
            if (cover != null)
            {
                cover.IsCover = false;
                _context.ProductImages.Update(cover);
                await _context.SaveChangesAsync();
            }
            var newCover = await _context.ProductImages.Where(im => im.Id == imageId).FirstOrDefaultAsync();
            if (newCover != null)
            {
                newCover.IsCover = true;
                _context.ProductImages.Update(newCover);
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            return false;
        }

        public async Task<bool> DeleteProductImages(IEnumerable<ProductImage> images)
        {
            try
            {
                foreach (var image in images)
                {
                    var publicId = "CRUDO/products/" + image.FilePath.Split('/').Last().Split('.').First();
                    var deleteParams = new DeletionParams(publicId);
                    await _cloudinary.DestroyAsync(deleteParams);
                }

                _context.ProductImages.RemoveRange(images);
                var dbResult = await _context.SaveChangesAsync();
                return dbResult > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}

using crudo.Models;

namespace crudo.Interfaces
{
    public interface IProductImage
    {
        public Task<List<ProductImage>> UploadImages(int productId, IFormFile[] images);

        public Task<IEnumerable<ProductImage>> GetProductImages(int productId);

        public Task<ProductImage> GetProductImage(int productId, int imageId);

        public Task<bool> DeleteProductImage(int imageId);

        public Task<bool> DeleteProductImages(IEnumerable<ProductImage> images);

        // public Task CreateProductImage(int productId);

        public Task<bool> UpdateProductImageCover(int productId, int imageId);
    }
}

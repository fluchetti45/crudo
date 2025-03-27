using crudo.DTOs.Product;
using crudo.Models;

namespace crudo.Interfaces
{
    public interface IProduct
    {
        public Task<IEnumerable<ReadProductDTO>> GetProducts();

        public Task<IEnumerable<ReadProductDTO>> GetTopProducts();

        public Task<IEnumerable<ReadProductDTO>> GetProductsByCategory(int categoryId);

        public Task<Product> GetProduct(int productId);

        public Task<Product> CreateProduct(CreateProductDTO product);

        public Task<EditProductDTO> UpdateProduct(EditProductDTO product);

        public Task<bool> DeleteProduct(int productId);
    }
}

using crudo.DTOs.Category;
using crudo.Models;

namespace crudo.Interfaces
{
    public interface ICategory
    {
        public Task<ReadCategoryDTO> GetCategory(int categoryId);
        public Task<IEnumerable<ReadCategoryDTO>> GetCategories();

        public Task<bool> DeleteCategory(int categoryId);

        public Task<Category> EditCategory(EditCategoryDTO categoryDTO);
        public Task<Category> CreateCategory(CreateCategoryDTO categoryDTO);
    }
}

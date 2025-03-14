using crudo.DTOs.Category;
using crudo.Interfaces;
using crudo.Models;
using Microsoft.EntityFrameworkCore;

namespace crudo.Services
{
    public class CategoryServices : ICategory
    {
        private readonly CrudoContext _context;

        public CategoryServices(CrudoContext context)
        {
            _context = context;
        }
        public async Task<Category> CreateCategory(CreateCategoryDTO categoryDTO)
        {
            try
            {
                Category category = new Category
                {
                    Name = categoryDTO.Name,
                    Description = categoryDTO.Description,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };
                await _context.Categories.AddAsync(category);
                await _context.SaveChangesAsync();
                return category;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IEnumerable<ReadCategoryDTO>> GetCategories()
        {
            try
            {
                IEnumerable<Category> categories = await _context.Categories.ToListAsync();
                IEnumerable<ReadCategoryDTO> categoriesDTO = categories.Select(category => new ReadCategoryDTO
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description
                });
                return categoriesDTO;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ReadCategoryDTO> GetCategory(int categoryId)
        {
            try
            {
                Category category = await _context.Categories.SingleOrDefaultAsync(c => c.Id == categoryId);
                ReadCategoryDTO categoryDTO = new ReadCategoryDTO { Id = category.Id, Name = category.Name };
                return categoryDTO;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<Category> EditCategory(EditCategoryDTO categoryDTO)
        {
            try
            {
                Category category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryDTO.Id);
                if (category == null)
                {
                    return null;
                }
                category.Name = categoryDTO.Name;
                category.Description = categoryDTO.Description;
                category.UpdatedAt = DateTime.UtcNow;
                _context.Categories.Update(category);
                await _context.SaveChangesAsync();
                return category;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<bool> DeleteCategory(int categoryId)
        {
            try
            {
                Category category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
                if (category == null)
                {
                    return false;
                }
                _context.Categories.Remove(category);
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
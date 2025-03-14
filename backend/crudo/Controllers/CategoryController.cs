using crudo.DTOs.Category;
using crudo.Models;
using crudo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace crudo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryServices _services;

        public CategoryController(CategoryServices services)
        {
            _services = services;
        }

        // GET: api/<CategoryController>
        [HttpGet]

        public async Task<ActionResult<IEnumerable<ReadCategoryDTO>>> GetCategories()
        {
            IEnumerable<ReadCategoryDTO> categories = await _services.GetCategories();
            if (categories == null)
            {
                return BadRequest();
            }
            return Ok(categories);
        }

        // GET api/<CategoryController>/5
        [HttpGet("{id}")]

        public async Task<ActionResult<ReadCategoryDTO>> GetCategory([FromRoute] int id)
        {
            ReadCategoryDTO category = await this._services.GetCategory(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }




        // POST api/<CategoryController>
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] CreateCategoryDTO categoryDTO)
        {
            Category category = await this._services.CreateCategory(categoryDTO);
            if (category == null)
            {
                return BadRequest();
            }
            return Ok(category);
        }

        // PUT api/<CategoryController>/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<Category>> Put(EditCategoryDTO categoryDTO)
        {
            Category category = await _services.EditCategory(categoryDTO);
            if (category == null)
            {
                return BadRequest();
            }
            return Ok(category);
        }

        // DELETE api/<CategoryController>/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            bool result = await _services.DeleteCategory(id);
            if (result == false)
            {
                return BadRequest();
            }
            return Ok(result);
        }
    }
}

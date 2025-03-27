using crudo.Common;
using crudo.DTOs.Product;
using crudo.Models;
using crudo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace crudo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductServices _services;

        public ProductsController(ProductServices services)
        {
            _services = services;

        }
        // GET: api/<ProductsController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadProductDTO>>> GetProducts([FromQuery] int categoryId = 0)
        {
            if (categoryId != 0)
            {
                IEnumerable<ReadProductDTO> products = await _services.GetProductsByCategory(categoryId);
                return Ok(products);
            }
            else
            {
                IEnumerable<ReadProductDTO> products = await _services.GetProducts();
                return Ok(products);
            }
        }

        [HttpGet("basic/{id}")]
        public async Task<ActionResult<ReadProductDTO>> GetProductBasic(int id)
        {
            ReadProductDTO product = await this._services.GetProductBasic(id);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();
        }

        [HttpGet("admin")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<PagedResult<ReadProductDTO>>> GetProductsAdmin(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {

            var products = await _services.GetProductsAdmin(page, pageSize);
            return Ok(products);

        }

        // GET api/<ProductsController>/5
        [HttpGet("{id}")]

        public async Task<ActionResult<Product>> GetProduct(int id)
        {

            Product product = await this._services.GetProduct(id);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();
        }

        // GET api/<ProductsController>/5
        [HttpPost("related")]
        public async Task<ActionResult<ReadProductDTO>> GetRelatedProducts([FromBody] GetRelatedProductsDTO data)
        {

            IEnumerable<ReadProductDTO> product = await this._services.GetRelatedProducts(data.ProductId, data.CategoryId);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();
        }

        [HttpGet("top")]
        public async Task<ActionResult<IEnumerable<ReadProductDTO>>> GetTopProducts()
        {
            IEnumerable<ReadProductDTO> product = await this._services.GetTopProducts();
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ReadProductDTO>>> GetFilteredProducts([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q.Trim()))
            {
                return Ok(new List<ReadProductDTO>());
            }

            IEnumerable<ReadProductDTO> products = await this._services.GetFilteredProducts(q);
            if (products != null)
            {
                return Ok(products);
            }
            return BadRequest();
        }

        // POST api/<ProductsController>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDTO productDTO)
        {
            if (productDTO.Images == null || !productDTO.Images.Any())
            {
                return BadRequest("Debe subir al menos una imagen.");
            }

            Product producto = await this._services.CreateProduct(productDTO);
            if (producto != null)
            {
                return CreatedAtAction(
                    nameof(GetProduct), new { id = producto.Id }, producto);
            }
            return BadRequest();
        }

        // PUT api/<ProductsController>/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<EditProductDTO>> UpdateProduct([FromRoute] int id, [FromForm] EditProductDTO productDTO)
        {

            EditProductDTO product = await this._services.UpdateProduct(productDTO);
            if (product != null)
            {
                return Ok(product);
            }
            return BadRequest();
        }

        // DELETE api/<ProductsController>/5
        [HttpPut("{id}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            bool deleted = await this._services.DeleteProduct(id);
            if (deleted)
            {
                return NoContent();
            }
            return BadRequest();
        }

    }
}

using crudo.DTOs.ProductImages;
using crudo.Models;
using crudo.Services;
using Microsoft.AspNetCore.Mvc;

namespace crudo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImageController : ControllerBase
    {
        private readonly ProductImageServices _services;
        public ProductImageController(ProductImageServices services)
        {
            _services = services;
        }

        [HttpPost("{productId}")]
        public async Task<ActionResult<List<ProductImage>>> UploadImages([FromRoute] int productId, [FromForm] IFormFile[] images)
        {
            if (images == null || !images.Any())
                return BadRequest("No images provided");

            var uploadedImages = await _services.UploadImages(productId, images);
            if (uploadedImages == null)
            {
                return BadRequest();
            }
            return Ok(uploadedImages);
        }

        [HttpPut("{imageId}")]
        public async Task<ActionResult<bool>> UpdateCover([FromBody] UpdateCoverDTO data)
        {
            var result = await _services.UpdateProductImageCover(data.productId, data.coverId);
            if (result)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteImage([FromRoute] int id)
        {
            var result = await _services.DeleteProductImage(id);
            if (result)
            {
                return Ok(result);
            }
            return BadRequest();
        }
    }
}

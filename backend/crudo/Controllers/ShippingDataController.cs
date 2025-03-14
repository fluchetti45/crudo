using crudo.DTOs.Shipping;
using crudo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace crudo.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShippingDataController : ControllerBase
    {
        private readonly ShippingDataServices _service;
        public ShippingDataController(ShippingDataServices service)
        {
            _service = service;
        }

        [HttpGet]

        public async Task<ActionResult<ShippingDataDTO>> GetShippingData()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var shippingData = await _service.GetShippingData(userId);
            if (shippingData == null)
            {
                return BadRequest();
            }
            return Ok(shippingData);

        }



        [HttpPost]

        public async Task<ActionResult<ShippingDataDTO>> CreateShippingData([FromBody] CreateShippingDataDTO data)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            ShippingDataDTO shippingData = await _service.CreateShippingData(userId, data);
            if (shippingData == null)
            {
                return BadRequest();
            }
            return CreatedAtAction(nameof(GetShippingData), new { id = shippingData.Id }, data);

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ShippingDataDTO>> EditShippingData([FromBody] ShippingDataDTO data)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            ShippingDataDTO shippingData = await _service.EditShippingData(userId, data);
            if (shippingData == null)
            {
                return BadRequest();
            }
            return Ok(shippingData);
        }

    }
}

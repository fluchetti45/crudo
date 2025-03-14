using crudo.Common;
using crudo.DTOs.Order;
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
    public class OrderController : ControllerBase
    {
        private readonly OrderServices _services;

        public OrderController(OrderServices services)
        {
            _services = services;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadOrderDTO>>> GetOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var orders = await _services.GetOrders(userId);
            if (orders != null)
            {
                return Ok(orders);
            }
            return BadRequest();
        }

        [HttpGet("admin")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<PagedResult<ReadOrderAdminDTO>>> GetOrdersAdmin(
            [FromQuery] int? statusId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (statusId.HasValue)
            {
                var orders = await _services.GetOrdersAdminByStatus(statusId.Value, page, pageSize);
                return Ok(orders);
            }

            var allOrders = await _services.GetOrdersAdmin(page, pageSize);
            return Ok(allOrders);
        }

        [HttpGet("admin/user")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<IEnumerable<ReadOrderAdminDTO>>> GetUserOrdersAdmin([FromQuery] string userId)
        {
            var orders = await _services.GetUserOrdersAdmin(userId);
            if (orders != null)
            {
                return Ok(orders);
            }
            return BadRequest();
        }
        [HttpGet("{id}")]
        // Allow AdminOrOwner
        public async Task<ActionResult<ReadOrderDTO>> GetOrder(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.HasClaim("https://crudo.com/claims/roles", "Admin");
            var order = await _services.GetOrder(userId, id, isAdmin);
            if (order == null)
                return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<ReadOrderDTO>> CreateOrder([FromBody] ShippingDataDTO shippingData)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _services.CreateOrder(userId, shippingData);
            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return CreatedAtAction(nameof(GetOrder), new { id = result.Data.Id }, result.Data);
        }

        [HttpPut("{orderId}")]
        public async Task<ActionResult<ReadOrderAdminDTO>> UpdateOrderStatus([FromRoute] int orderId, [FromBody] UpdateOrderStatusDTO data)
        {
            var result = await _services.UpdateOrderStatus(orderId, data.newStatusId);
            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Data);
        }
    }
}
using crudo.DTOs.Cart;
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
    public class CartController : ControllerBase
    {
        private readonly CartServices _services;
        private readonly ILogger<CartController> _logger;

        public CartController(CartServices services, ILogger<CartController> logger)
        {
            _services = services;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ReadCartDTO>> GetCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var cart = await _services.GetCart(userId);
            return Ok(cart);
        }

        [HttpPost]
        public async Task<ActionResult<AddToCartResponse>> AddToCart([FromBody] AddToCartDTO dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _services.AddToCart(userId, dto);

            if (result.Success)
                return Ok(result.CartItem);
            return BadRequest(result.Message);
        }

        [HttpDelete("{itemId}")]
        public async Task<ActionResult> RemoveFromCart(int itemId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _services.RemoveFromCart(userId, itemId);
            if (result)
                return Ok(result);
            return BadRequest();
        }

        [HttpPut("{productId}")]
        public async Task<ActionResult> UpdateQuantity(int productId, [FromBody] int quantity)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _services.UpdateQuantity(userId, productId, quantity);
            if (result != null)
                return Ok(result);
            return BadRequest();
        }

        [HttpPost("checkout")]
        public async Task<ActionResult<ReadOrderDTO>> Checkout([FromBody] ShippingDataDTO shippingData)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var order = await _services.Checkout(userId, shippingData);
            if (order.Items != null)
                return Ok(order);
            return BadRequest(order.ErrorMessage);
        }
    }
}
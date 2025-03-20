

namespace Crudo.Controllers;
using crudo.DTOs.Wishlist;
using Crudo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly WishlistService _wishlistService;

    public WishlistController(WishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet]

    public async Task<ActionResult<List<WishlistDTO>>> GetWishlist()
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        List<WishlistDTO> wishlist = await _wishlistService.GetWishlist(userId);
        return Ok(wishlist);
    }

    [HttpPost]

    public async Task<ActionResult<WishlistDTO>> AddProductToWishlist([FromBody] int productId)
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        WishlistDTO wishlistItem = await _wishlistService.AddProductToWishlist(userId, productId);
        if (wishlistItem == null)
        {
            return BadRequest();
        }
        return Ok(wishlistItem);
    }

    [HttpDelete("{productId}")]

    public async Task<IActionResult> RemoveProductFromWishlist([FromRoute] int productId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _wishlistService.RemoveProductFromWishlist(userId, productId);
        if (result)
        {
            return Ok(result);
        }
        return BadRequest();
    }

    [HttpDelete("clear")]

    public async Task<IActionResult> ClearWishlist()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _wishlistService.ClearWishlist(userId);
        return Ok(result);
    }
}


using Microsoft.AspNetCore.Mvc;
using crudo.Models;
using crudo.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using crudo.DTOs.Product;
namespace crudo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerReviewController : ControllerBase
{
    private readonly CustomerReviewService _reviewService;
    private readonly ILogger<CustomerReviewController> _logger;

    public CustomerReviewController(
        CustomerReviewService reviewService,
        ILogger<CustomerReviewController> logger)
    {
        _reviewService = reviewService;
        _logger = logger;
    }

    // GET: api/CustomerReview
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerReview>>> GetReviews()
    {
        var reviews = await _reviewService.GetAllReviewsAsync();
        return Ok(reviews);
    }

    [HttpGet("user")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<GetReviewDTO>>> GetReviewsByUser()
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var reviews = await _reviewService.GetReviewsByUserAsync(userId);
        return Ok(reviews);
    }

    // GET: api/CustomerReview/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GetReviewDTO>> GetReview(int id)
    {
        var review = await _reviewService.GetReviewByIdAsync(id);
        if (review == null)
        {
            return NotFound();
        }
        return Ok(review);
    }

    // GET: api/CustomerReview/product/5
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<ProductReviewSummary>> GetProductReviews([FromRoute] int productId)
    {
        var reviews = await _reviewService.GetProductReviewsAsync(productId);
        return Ok(reviews);
    }

    // POST: api/CustomerReview
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CustomerReview>> CreateReview(GenerateReviewDTO review)
    {
        try
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var createdReview = await _reviewService.CreateReviewAsync(userId, review);
            return CreatedAtAction(nameof(GetReview), new { id = createdReview.Id }, createdReview);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT: api/CustomerReview/5
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReview(int id, UpdateReviewDTO review)
    {
        try
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _reviewService.UpdateReviewAsync(id, userId, review);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    // DELETE: api/CustomerReview/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        try
        {
            await _reviewService.DeleteReviewAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }




    [Authorize]
    [HttpGet("pending-products")]
    public async Task<ActionResult<IEnumerable<ReadProductForReviewDTO>>> GetProductsPendingReview()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var products = await _reviewService.GetProductsPendingReviewAsync(userId);
        return Ok(products);
    }

    [Authorize]
    [HttpGet("pending-count")]
    public async Task<ActionResult<int>> GetPendingReviewsCount()
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int count = await _reviewService.GetPendingReviewsCountAsync(userId);
        return Ok(count);
    }

    [Authorize]
    [HttpGet("done-count")]
    public async Task<ActionResult<int>> GetDoneReviewsCount()
    {
        string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int count = await _reviewService.GetDoneReviewsCountAsync(userId);
        return Ok(count);
    }

}
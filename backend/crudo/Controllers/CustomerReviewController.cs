using Microsoft.AspNetCore.Mvc;
using crudo.Models;
using crudo.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using crudo.DTOs.Product;
namespace crudo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerReviewController : ControllerBase
{
    private readonly ICustomerReviewService _reviewService;
    private readonly ILogger<CustomerReviewController> _logger;

    public CustomerReviewController(
        ICustomerReviewService reviewService,
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

    // GET: api/CustomerReview/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerReview>> GetReview(int id)
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
    public async Task<ActionResult<IEnumerable<CustomerReview>>> GetProductReviews(int productId)
    {
        var reviews = await _reviewService.GetProductReviewsAsync(productId);
        return Ok(reviews);
    }

    // POST: api/CustomerReview
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CustomerReview>> CreateReview(CustomerReview review)
    {
        try
        {
            review.UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var createdReview = await _reviewService.CreateReviewAsync(review);
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
    public async Task<IActionResult> UpdateReview(int id, CustomerReview review)
    {
        try
        {
            await _reviewService.UpdateReviewAsync(id, review);
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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var count = await _reviewService.GetPendingReviewsCountAsync(userId);
        return Ok(count);
    }
}
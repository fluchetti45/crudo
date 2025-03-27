using Microsoft.EntityFrameworkCore;
using crudo.Models;
using crudo.Interfaces;
using crudo.DTOs.Product;

namespace crudo.Services;

public class CustomerReviewService : ICustomerReviewService
{
    private readonly CrudoContext _context;
    private readonly ILogger<CustomerReviewService> _logger;

    public CustomerReviewService(CrudoContext context, ILogger<CustomerReviewService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<CustomerReview>> GetAllReviewsAsync()
    {
        return await _context.CustomerReviews.ToListAsync();
    }

    public async Task<GetReviewDTO?> GetReviewByIdAsync(int id)
    {
        return await _context.CustomerReviews
            .Where(r => r.Id == id)
            .Select(r => new GetReviewDTO
            {
                ProductId = r.ProductId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                FilePathCover = r.Product.ProductImages.FirstOrDefault(i => i.IsCover == true)!.FilePath,
                ProductName = r.Product.Name
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProductReviewSummary> GetProductReviewsAsync(int productId)
    {
        try
        {
            var reviews = await _context.CustomerReviews
            .Include(r => r.Product)
            .Where(r => r.ProductId == productId)
            .Select(r => new GetProductReviewDTO
            {
                Id = r.Id,
                ProductId = r.ProductId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                UserId = r.UserId
            })
            .ToListAsync();
            if (reviews.Count == 0)
            {
                return new ProductReviewSummary
                {
                    AverageRating = 0,
                    TotalReviews = 0,
                    Reviews = new List<GetProductReviewDTO>()
                };
            }

            var averageRating = reviews.Average(r => r.Rating);
            return new ProductReviewSummary
            {
                AverageRating = averageRating,
                TotalReviews = reviews.Count,
                Reviews = reviews
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener las reseñas del producto");
            throw;
        }
    }

    public async Task<CustomerReview> CreateReviewAsync(string userId, GenerateReviewDTO review)
    {
        // Validar que el producto existe
        var product = await _context.Products.FindAsync(review.ProductId);
        if (product == null)
        {
            throw new ArgumentException("El producto no existe");
        }

        // Validar que el usuario no haya ya reseñado este producto
        var existingReview = await _context.CustomerReviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == review.ProductId);

        if (existingReview != null)
        {
            throw new InvalidOperationException("Ya has reseñado este producto");
        }

        // Validar rating
        if (review.Rating < 1 || review.Rating > 5)
        {
            throw new ArgumentException("El rating debe estar entre 1 y 5");
        }

        CustomerReview newReview = new CustomerReview
        {
            UserId = userId,
            ProductId = review.ProductId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.CustomerReviews.Add(newReview);
        await _context.SaveChangesAsync();

        return newReview;
    }

    public async Task UpdateReviewAsync(int id, CustomerReview review)
    {
        if (id != review.Id)
        {
            throw new ArgumentException("El ID no coincide");
        }

        var existingReview = await _context.CustomerReviews.FindAsync(id);
        if (existingReview == null)
        {
            throw new KeyNotFoundException("La reseña no existe");
        }

        // Verificar que el usuario que actualiza es el mismo que creó la reseña
        if (existingReview.UserId != review.UserId)
        {
            throw new UnauthorizedAccessException("No tienes permiso para modificar esta reseña");
        }

        // Validar rating
        if (review.Rating < 1 || review.Rating > 5)
        {
            throw new ArgumentException("El rating debe estar entre 1 y 5");
        }

        existingReview.Rating = review.Rating;
        existingReview.Comment = review.Comment;
        existingReview.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ReviewExistsAsync(id))
            {
                throw new KeyNotFoundException("La reseña no existe");
            }
            throw;
        }
    }

    public async Task DeleteReviewAsync(int id)
    {
        var review = await _context.CustomerReviews.FindAsync(id);
        if (review == null)
        {
            throw new KeyNotFoundException("La reseña no existe");
        }

        _context.CustomerReviews.Remove(review);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ReviewExistsAsync(int id)
    {
        return await _context.CustomerReviews.AnyAsync(e => e.Id == id);
    }

    public async Task<IEnumerable<CustomerReview>> GetPendingReviewsAsync()
    {
        return await _context.CustomerReviews.ToListAsync();
    }



    public async Task<IEnumerable<ReadProductForReviewDTO>> GetProductsPendingReviewAsync(string userId)
    {
        List<int> productsId = await _context.OrderItems
            .Where(o => o.Order.UserId == userId)
            .Where(o => !_context.CustomerReviews
                .Any(r => r.ProductId == o.ProductId && r.UserId == userId))
            .Select(o => o.Product.Id)
            .Distinct()
            .ToListAsync();

        return await _context.Products
            .Where(p => productsId.Contains(p.Id))
            .Include(p => p.ProductImages)
            .Select(p => new ReadProductForReviewDTO
            {
                Id = p.Id,
                Name = p.Name,
                filePathCover = p.ProductImages.FirstOrDefault(i => i.IsCover == true)!.FilePath,
                OrderDate = p.OrderItems.FirstOrDefault(o => o.Order.UserId == userId)!.Order.CreatedAt
            })
            .ToListAsync();
    }



    public async Task<int> GetPendingReviewsCountAsync(string userId)
    {
        return await _context.OrderItems
            .Include(o => o.Order)
            .Where(o => o.Order.UserId == userId)
            .Where(o => !_context.CustomerReviews
                .Any(r => r.ProductId == o.ProductId && r.UserId == userId))
            .Select(o => o.ProductId)
            .Distinct()
            .CountAsync();
    }

    public async Task<IEnumerable<GetReviewDTO>> GetReviewsByUserAsync(string userId)
    {
        return await _context.CustomerReviews
            .Where(r => r.UserId == userId)
            .Include(r => r.Product)
            .Select(r => new GetReviewDTO
            {
                ProductId = r.ProductId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                FilePathCover = r.Product.ProductImages.FirstOrDefault(i => i.IsCover == true)!.FilePath,
                ProductName = r.Product.Name
            })
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetDoneReviewsCountAsync(string userId)
    {
        return await _context.CustomerReviews
            .Where(r => r.UserId == userId)
            .CountAsync();
    }
}
using crudo.DTOs.Product;
using crudo.Models;

namespace crudo.Interfaces;

public interface ICustomerReviewService
{
    Task<IEnumerable<CustomerReview>> GetAllReviewsAsync();
    Task<GetReviewDTO?> GetReviewByIdAsync(int id);
    Task<ProductReviewSummary> GetProductReviewsAsync(int productId);

    Task<IEnumerable<GetReviewDTO>> GetReviewsByUserAsync(string userId);
    Task<CustomerReview> CreateReviewAsync(string userId, GenerateReviewDTO review);
    Task UpdateReviewAsync(int id, CustomerReview review);
    Task DeleteReviewAsync(int id);
    Task<bool> ReviewExistsAsync(int id);
    Task<IEnumerable<CustomerReview>> GetPendingReviewsAsync();
    Task<IEnumerable<ReadProductForReviewDTO>> GetProductsPendingReviewAsync(string userId);
    Task<int> GetPendingReviewsCountAsync(string userId);

    Task<int> GetDoneReviewsCountAsync(string userId);
}
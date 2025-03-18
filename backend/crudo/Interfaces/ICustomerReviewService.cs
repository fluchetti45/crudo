using crudo.DTOs.Product;
using crudo.Models;

namespace crudo.Interfaces;

public interface ICustomerReviewService
{
    Task<IEnumerable<CustomerReview>> GetAllReviewsAsync();
    Task<CustomerReview?> GetReviewByIdAsync(int id);
    Task<IEnumerable<CustomerReview>> GetProductReviewsAsync(int productId);
    Task<CustomerReview> CreateReviewAsync(CustomerReview review);
    Task UpdateReviewAsync(int id, CustomerReview review);
    Task DeleteReviewAsync(int id);
    Task<bool> ReviewExistsAsync(int id);
    Task<IEnumerable<CustomerReview>> GetPendingReviewsAsync();
    Task<IEnumerable<ReadProductForReviewDTO>> GetProductsPendingReviewAsync(string userId);
    Task<int> GetPendingReviewsCountAsync(string userId);
}
namespace crudo.Models;
public partial class GetProductReviewDTO
{
    public int Id { get; set; }
    public int ProductId { get; set; }

    public string UserId { get; set; } = null!;
    public string Comment { get; set; } = null!;

    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }

}

public class ProductReviewSummary
{
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }

    public List<GetProductReviewDTO> Reviews { get; set; } = new List<GetProductReviewDTO>();
}

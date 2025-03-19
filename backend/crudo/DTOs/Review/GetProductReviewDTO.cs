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

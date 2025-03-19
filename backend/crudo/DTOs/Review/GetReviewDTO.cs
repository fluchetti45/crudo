namespace crudo.Models;
public partial class GetReviewDTO
{
    public int ProductId { get; set; }

    public int Rating { get; set; }

    public string Comment { get; set; } = null!;
    public string FilePathCover { get; set; } = null!;

    public string ProductName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

}


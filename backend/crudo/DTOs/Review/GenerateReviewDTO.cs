namespace crudo.Models;
public partial class GenerateReviewDTO
{
    public int ProductId { get; set; }

    public int Rating { get; set; }

    public string Comment { get; set; } = null!;

}

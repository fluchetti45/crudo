namespace crudo.Models;
public partial class UpdateReviewDTO
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = null!;
}


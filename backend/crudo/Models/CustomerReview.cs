namespace crudo.Models;
using System.Text.Json.Serialization;
public partial class CustomerReview
{
    public int Id { get; set; }

    public string UserId { get; set; }

    public int ProductId { get; set; }

    public int Rating { get; set; }

    public string Comment { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;
}

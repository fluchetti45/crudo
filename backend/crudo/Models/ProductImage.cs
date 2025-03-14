using System.Text.Json.Serialization;

namespace crudo.Models;

public partial class ProductImage
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public bool IsCover { get; set; }

    public DateTime CreatedAt { get; set; }

    public string FilePath { get; set; } = null!;
    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;
}

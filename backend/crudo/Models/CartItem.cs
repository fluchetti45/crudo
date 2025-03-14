using System.Text.Json.Serialization;

namespace crudo.Models;

public partial class CartItem
{
    public int Id { get; set; }

    public int CartId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    [JsonIgnore]
    public virtual Cart Cart { get; set; } = null!;

    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;
}


using System.Text.Json.Serialization;

namespace crudo.Models
{
    public partial class WishlistItem
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ProductId { get; set; }
        [JsonIgnore]
        public virtual Product Product { get; set; } = null!;
    }
}


using System.Text.Json.Serialization;

namespace crudo.Models
{
    public class OrderStatus
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        [JsonIgnore]
        public virtual ICollection<CustomerOrder> CustomerOrders { get; set; } = new List<CustomerOrder>();
    }
}
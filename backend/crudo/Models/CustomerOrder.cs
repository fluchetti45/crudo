namespace crudo.Models;

public partial class CustomerOrder
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public int StatusId { get; set; }

    public decimal Total { get; set; }

    public int IdShippingData { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ShippingDatum IdShippingDataNavigation { get; set; } = null!;

    public virtual OrderStatus Status { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
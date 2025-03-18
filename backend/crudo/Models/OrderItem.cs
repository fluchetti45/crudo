namespace crudo.Models;

public partial class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public virtual CustomerOrder Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}

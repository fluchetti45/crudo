namespace crudo.DTOs.Cart
{
    public class ReadCartDTO
    {
        public long Id { get; set; }
        public ICollection<ReadCartItemDTO> Items { get; set; }
        public decimal Total { get; set; }
    }

    public class ReadCartItemDTO
    {
        public long ItemId { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public string ImageUrl { get; set; }
    }
}
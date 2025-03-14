namespace crudo.DTOs.Cart
{
    public class AddToCartDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
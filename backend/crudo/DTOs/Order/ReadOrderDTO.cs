using crudo.Models;

namespace crudo.DTOs.Order
{
    public class ReadOrderDTO
    {
        public int Id { get; set; }
        public ShippingDatum ShippingData { get; set; }
        public string Status { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ErrorMessage { get; set; }  // Nuevo campo para manejar errores

        public List<ReadOrderItemDTO> Items { get; set; }

    }


    public class ReadOrderItemDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImage { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
    }
}
namespace crudo.DTOs.Product
{
    public class CreateProductDTO
    {
        public string Name { get; set; }

        public int CategoryId { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public IFormFile[] Images { get; set; }

    }
}

using crudo.Models;

namespace crudo.DTOs.Product
{
    public class RelatedProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public string filePathCover { get; set; }
    }
}

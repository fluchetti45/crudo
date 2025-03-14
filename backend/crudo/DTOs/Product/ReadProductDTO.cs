namespace crudo.DTOs.Product
{
    public class ReadProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }

        public bool IsDeleted { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string filePathCover { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }

    public class ProductImageDTO
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public int? IsCover { get; set; }
    }
}

namespace crudo.DTOs.Product
{
    public class ReadProductForReviewDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string filePathCover { get; set; }

        public DateTime OrderDate { get; set; }

    }
}

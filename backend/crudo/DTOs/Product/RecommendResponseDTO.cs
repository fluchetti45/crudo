namespace crudo.DTOs.Product
{
    public class RecommendResponseDTO
    {
        public List<int> ProductIds { get; set; }

        public List<double> Scores { get; set; }
    }
}

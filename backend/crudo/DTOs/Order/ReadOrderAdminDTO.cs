namespace crudo.DTOs.Order
{
    public class ReadOrderAdminDTO
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public int StatusId { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
    }
}

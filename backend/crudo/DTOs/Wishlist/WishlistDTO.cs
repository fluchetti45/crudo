namespace crudo.DTOs.Wishlist
{
    public partial class WishlistDTO
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
    }
}

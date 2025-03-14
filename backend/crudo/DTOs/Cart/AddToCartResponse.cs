using crudo.Models;

namespace crudo.DTOs.Cart
{
    public class AddToCartResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public CartItem CartItem { get; set; }
    }

}

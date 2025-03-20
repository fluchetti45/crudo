using crudo.DTOs.Wishlist;

namespace Crudo.Interfaces;

public interface IWishlist
{
    Task<List<WishlistDTO>> GetWishlist(string userId);

    Task<WishlistDTO> AddProductToWishlist(string userId, int productId);

    Task<bool> RemoveProductFromWishlist(string userId, int wishlistItemId);

    Task<bool> ClearWishlist(string userId);
}

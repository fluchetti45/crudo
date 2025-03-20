namespace Crudo.Services;
using crudo.DTOs.Wishlist;
using crudo.Models;
using Crudo.Interfaces;
using Microsoft.EntityFrameworkCore;

public class WishlistService : IWishlist
{
    private readonly CrudoContext _context;
    private const string DEFAULT_IMAGE_URL = "https://res.cloudinary.com/da8y2vp4k/image/upload/v1741205504/placeholderwebp_wakx4r.webp";

    public WishlistService(CrudoContext context)
    {
        _context = context;

    }
    public async Task<List<WishlistDTO>> GetWishlist(string userId)
    {
        try
        {
            var wishlist = await _context.WishlistItems.Where(w => w.UserId == userId).Include(p => p.Product).Select(w => new WishlistDTO
            {
                Id = w.Id,
                Name = w.Product.Name,
                ProductId = w.ProductId,
                Image = w.Product.ProductImages.Where(pi => pi.IsCover).Select(pi => pi.FilePath).FirstOrDefault() ?? DEFAULT_IMAGE_URL
            }).ToListAsync();
            return wishlist;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<WishlistDTO> AddProductToWishlist(string userId, int productId)
    {
        try
        {
            WishlistItem wishlistItem = await _context.WishlistItems.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (wishlistItem == null)
            {
                WishlistItem newWishlistItem = new WishlistItem
                {
                    UserId = userId,
                    ProductId = productId,
                };
                _context.WishlistItems.Add(newWishlistItem);
                await _context.SaveChangesAsync();
                WishlistDTO wishlistDTO = await _context.WishlistItems.Where(w => w.Id == newWishlistItem.Id).Include(p => p.Product).Select(w => new WishlistDTO
                {
                    Id = w.Id,
                    ProductId = w.ProductId,
                    Name = w.Product.Name,
                    Image = w.Product.ProductImages.Where(pi => pi.IsCover).Select(pi => pi.FilePath).FirstOrDefault() ?? DEFAULT_IMAGE_URL
                }).FirstOrDefaultAsync();
                return wishlistDTO;
            }
            return null;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> RemoveProductFromWishlist(string userId, int productId)
    {
        try
        {
            var wishlistItem = await _context.WishlistItems.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (wishlistItem == null)
            {
                return false;
            }
            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<bool> ClearWishlist(string userId)
    {
        try
        {
            var wishlistItems = await _context.WishlistItems.Where(w => w.UserId == userId).ToListAsync();
            _context.WishlistItems.RemoveRange(wishlistItems);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}

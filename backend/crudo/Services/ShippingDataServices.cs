using crudo.DTOs.Shipping;
using crudo.Models;
using Microsoft.EntityFrameworkCore;

namespace crudo.Services
{
    public class ShippingDataServices
    {
        private readonly CrudoContext _context;

        public ShippingDataServices(CrudoContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ShippingDataDTO>> GetShippingData(string userId)
        {
            var data = await _context.ShippingData.Where(s => s.UserId == userId).Select(s => new ShippingDataDTO
            {
                Id = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName,
                City = s.City,
                Email = s.Email,
                Address = s.Address,
                PostalCode = s.PostalCode,
                Country = s.Country,
            }).ToListAsync();
            return data;
        }

        public async Task<ShippingDataDTO> CreateShippingData(string userId, CreateShippingDataDTO data)
        {
            try
            {
                ShippingDatum shippingData = new ShippingDatum
                {
                    FirstName = data.FirstName,
                    LastName = data.LastName,
                    City = data.City,
                    Email = data.Email,
                    Address = data.Address,
                    PostalCode = data.PostalCode,
                    Country = data.Country,
                    UserId = userId
                };
                _context.ShippingData.Add(shippingData);
                await _context.SaveChangesAsync();
                ShippingDataDTO shippingDataDTO = new ShippingDataDTO
                {
                    Id = shippingData.Id,
                    FirstName = data.FirstName,
                    LastName = data.LastName,
                    City = data.City,
                    Email = data.Email,
                    Address = data.Address,
                    PostalCode = data.PostalCode,
                    Country = data.Country,
                };
                return shippingDataDTO;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ShippingDataDTO> EditShippingData(string userId, ShippingDataDTO data)
        {
            try
            {
                ShippingDatum shippingData = await _context.ShippingData.FirstOrDefaultAsync(d => d.UserId == userId && d.Id == data.Id);
                if (shippingData == null)
                {
                    throw new Exception("Not found..");
                }
                shippingData.FirstName = data.FirstName;
                shippingData.LastName = data.LastName;
                shippingData.City = data.City;
                shippingData.Email = data.Email;
                shippingData.Address = data.Address;
                shippingData.Country = data.Country;
                shippingData.PostalCode = data.PostalCode;
                _context.ShippingData.Update(shippingData);
                await _context.SaveChangesAsync();
                return data;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}

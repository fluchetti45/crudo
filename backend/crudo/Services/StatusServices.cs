

using crudo.Models;
using Microsoft.EntityFrameworkCore;

namespace crudo.Services;

public class StatusServices
{
    private readonly CrudoContext _context;

    public StatusServices(CrudoContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderStatus>> GetStatuses()
    {
        try
        {
            var statuses = await _context.OrderStatuses.ToListAsync();
            return statuses;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<OrderStatus> GetStatus(int statusId)
    {
        try
        {
            var status = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.Id == statusId);
            return status;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<OrderStatus> CreateStatus(string statusName)
    {
        try
        {
            OrderStatus status = new OrderStatus { Name = statusName };
            _context.OrderStatuses.Add(status);
            var result = await _context.SaveChangesAsync();
            if (result > 0) { return status; }
            return null;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<OrderStatus> UpdateStatus(OrderStatus statusDTO)
    {
        try
        {
            OrderStatus status = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.Id == statusDTO.Id);
            if (status == null) return null;
            status.Name = statusDTO.Name;
            _context.OrderStatuses.Update(status);
            var result = await _context.SaveChangesAsync();
            if (result > 0) { return status; }
            return null;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<OrderStatus> DeleteStatus(int statusId)
    {
        try
        {
            OrderStatus status = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.Id == statusId);
            _context.OrderStatuses.Remove(status);
            await _context.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}
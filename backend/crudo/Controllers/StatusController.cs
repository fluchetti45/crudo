using crudo.DTOs.OrderStatus;
using crudo.Models;
using crudo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace crudo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StatusController : ControllerBase
    {
        private readonly StatusServices _services;

        public StatusController(StatusServices services)
        {
            _services = services;
        }

        [HttpGet]
        public async Task<ActionResult> GetStatuses()
        {
            var statuses = await _services.GetStatuses();
            if (statuses != null)
            {
                return Ok(statuses);
            }
            return BadRequest();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetStatus([FromRoute] int id)
        {
            var status = await _services.GetStatus(id);
            if (status == null)
            {
                return NotFound();

            }
            return Ok(status);
        }

        [HttpPost]
        public async Task<ActionResult<OrderStatus>> CreateStatus([FromBody] createOrderStatusDTO statusDTO)
        {
            var orderStatus = await _services.CreateStatus(statusDTO.Name);
            if (orderStatus != null)
            {
                return CreatedAtAction(nameof(GetStatus), new { id = orderStatus.Id }, orderStatus);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderStatus>> CreateStatus([FromBody] OrderStatus statusDTO)
        {
            var status = await _services.UpdateStatus(statusDTO);
            if (status != null)
            {
                return CreatedAtAction(nameof(GetStatus), new { id = status.Id }, status);
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<OrderStatus>> DeleteStatus([FromRoute] int id)
        {
            var orderStatus = await _services.DeleteStatus(id);
            if (orderStatus != null)
            {
                return Ok(orderStatus);
            }
            return BadRequest();
        }
    }
}
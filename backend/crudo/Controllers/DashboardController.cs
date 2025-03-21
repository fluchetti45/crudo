using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using crudo.Models;
using crudo.Services;
using crudo.Interfaces;
using crudo.DTOs.Dashboard;
namespace crudo.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminOnly")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardServices _dashboardServices;


        public DashboardController(DashboardServices dashboardServices)
        {
            _dashboardServices = dashboardServices;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardData>> GetDashboardData()
        {
            try
            {
                var dashboardData = await _dashboardServices.GetDashboardData();
                if (dashboardData == null)
                {
                    return NotFound("No se encontraron datos para el dashboard");
                }
                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los datos del dashboard", error = ex.Message });
            }
        }
    }
}

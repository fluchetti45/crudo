using crudo.DTOs.Email;
using crudo.Services;
using Microsoft.AspNetCore.Mvc;

namespace crudo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class EmailController : Controller
    {
        private readonly EmailServices _service;
        public EmailController(EmailServices service)
        {
            _service = service;
        }

        [HttpPost("subscribe")]
        public async Task<ActionResult> Subscribe([FromBody] NewsletterSubscription subscription)
        {
            var result = await _service.Subscribe(subscription.Email);

            if (result)
            {
                return Ok(new { success = true, message = "Suscripción correcta!" });
            }

            return BadRequest(new { success = false, message = "Algo salió mal..." });
        }

    }
}

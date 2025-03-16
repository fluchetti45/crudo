using System.Text;
using Microsoft.Extensions.Logging;

namespace crudo.Services
{
    public class MailgunService
    {
        private readonly string _apiKey;
        private readonly string _domain;
        private readonly ILogger<MailgunService> _logger;
        private readonly string _mailgunApiUrl = "https://api.mailgun.net/v3/{0}/messages";

        public MailgunService(ILogger<MailgunService> logger)
        {
            _apiKey = Environment.GetEnvironmentVariable("MAILGUN_API_KEY");
            _domain = Environment.GetEnvironmentVariable("MAILGUN_DOMAIN");
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                _logger.LogInformation($"Iniciando envío de email a {toEmail}");

                using (var client = new HttpClient())
                {
                    // Configurar la autenticación básica
                    var byteArray = Encoding.ASCII.GetBytes("api:" + _apiKey);
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                    // Preparar los parámetros del correo
                    var content = new FormUrlEncodedContent(new[]
                    {
                        new KeyValuePair<string, string>("from", $"Crudo <mailgun@{_domain}>"),
                        new KeyValuePair<string, string>("to", toEmail),
                        new KeyValuePair<string, string>("subject", subject),
                        new KeyValuePair<string, string>("html", body)
                    });

                    // Enviar el correo
                    var response = await client.PostAsync(string.Format(_mailgunApiUrl, _domain), content);

                    // Verificar si el correo se envió correctamente
                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogInformation("Email enviado exitosamente");
                        return true;
                    }
                    else
                    {
                        var errorContent = await response.Content.ReadAsStringAsync();
                        _logger.LogError($"Error al enviar el email. Status: {response.StatusCode}, Error: {errorContent}");
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al enviar el email");
                return false;
            }
        }
    }
}

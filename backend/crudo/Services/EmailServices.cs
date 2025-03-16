using MailChimp.Net;
using MailChimp.Net.Models;

namespace crudo.Services
{
    public class EmailServices
    {

        private readonly string apiKey;
        private readonly string listId;
        public EmailServices()
        {

            apiKey = Environment.GetEnvironmentVariable("MAILCHIMP_API_KEY");
            listId = Environment.GetEnvironmentVariable("MAILCHIMP_LIST_ID");
        }

        public async Task<bool> Subscribe(string email)
        {
            var mailchimpManager = new MailChimpManager(apiKey);
            var member = new Member
            {
                EmailAddress = email,
                StatusIfNew = Status.Subscribed
            };
            try
            {
                var response = await mailchimpManager.Members.AddOrUpdateAsync(listId, member);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}

﻿namespace crudo.DTOs.Shipping
{
    public class ShippingDataDTO
    {
        public int? Id { get; set; }
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string City { get; set; } = null!;

        public string Country { get; set; } = null!;

        public string PostalCode { get; set; } = null!;
    }
}

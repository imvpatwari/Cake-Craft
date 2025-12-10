using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class User
    {
        public int UserId { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        public string? MobileNumber { get; set; }

        public string UserRole { get; set; } = string.Empty;
    }
}
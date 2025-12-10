using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class ErrorLog
    {
        [Key]
        public int Id { get; set; }

        public DateTime Timestamp { get; set; }

        public string ExceptionType { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public string? Username { get; set; }

        public string? ControllerName { get; set; }

        public string? ActionName { get; set; }

        public string? RequestPath { get; set; }

        public string? RequestMethod { get; set; }
    }
}
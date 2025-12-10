using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class Cake
    {
        [Key]
        public int CakeId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Category { get; set; }

        public decimal Price { get; set; }

        public decimal Quantity { get; set; }

        public string? CakeImage { get; set; }

        public string? BakerId { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}
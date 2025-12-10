using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class Wishlist
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public int CakeId { get; set; }

        public Cake Cake { get; set; } = null!;
    }
}
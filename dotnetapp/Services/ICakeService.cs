using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    public interface ICakeService
    {
        Task<IEnumerable<Cake>> GetAllCakes();
        Task<Cake?> GetCakeById(int cakeId);
        Task<bool> AddCake(Cake cake);
        Task<bool> UpdateCake(int cakeId, Cake cake);
        Task<bool> DeleteCake(int cakeId);
        Task<bool> AddToWishlistAsync(string userId, int cakeId);
        Task<List<Cake>> GetWishlistAsync(string userId);
        Task<bool> RemoveFromWishlistAsync(string userId, int cakeId);
        Task<bool> ClearWishlistAsync(string userId);
    }
}
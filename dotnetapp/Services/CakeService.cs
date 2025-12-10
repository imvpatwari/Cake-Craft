using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class CakeService : ICakeService
    {
        private readonly ApplicationDbContext _context;

        public CakeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cake>> GetAllCakes()
        {
            return await _context.Cakes.Where(c => !c.IsDeleted).ToListAsync();
        }

        public async Task<Cake?> GetCakeById(int cakeId)
        {
            return await _context.Cakes.FindAsync(cakeId);
        }

        public async Task<bool> AddCake(Cake cake)
        {
            if (cake.Price <= 0)
            {
                throw new ArgumentException("Price cannot be negative or zero.");
            }
            if (cake.Quantity <= 0)
            {
                throw new ArgumentException("Quantity cannot be negative or zero.");
            }

            var exists = await _context.Cakes.AnyAsync(c =>
                c.Name.ToLower() == cake.Name.ToLower() && c.IsDeleted == false);
            if (exists)
            {
                throw new AppException("Cake name already exists");
            }

            _context.Cakes.Add(cake);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCake(int cakeId, Cake cake)
        {
            var existing = await _context.Cakes.FindAsync(cakeId);
            if (existing == null) return false;

            existing.Name = cake.Name;
            existing.Category = cake.Category;
            existing.Price = cake.Price;
            existing.Quantity = cake.Quantity;
            existing.CakeImage = cake.CakeImage;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCake(int cakeId)
        {
            if (cakeId < 0)
            {
                throw new ArgumentException("Cake Id cannot be negative.");
            }

            var existing = await _context.Cakes.FindAsync(cakeId);
            if (existing == null) return false;

            existing.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddToWishlistAsync(string userId, int cakeId)
        {
            bool exists = await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.CakeId == cakeId);

            if (exists) return false;

            var entry = new Wishlist
            {
                UserId = userId,
                CakeId = cakeId
            };

            _context.Wishlists.Add(entry);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Cake>> GetWishlistAsync(string userId)
        {
            return await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Select(w => w.Cake)
                .ToListAsync();
        }

        public async Task<bool> RemoveFromWishlistAsync(string userId, int cakeId)
        {
            var entry = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.CakeId == cakeId);

            if (entry == null) return false;

            _context.Wishlists.Remove(entry);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearWishlistAsync(string userId)
        {
            var items = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .ToListAsync();

            if (!items.Any()) return false;

            _context.Wishlists.RemoveRange(items);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
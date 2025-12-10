using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        public async Task<(int, string)> Registration(User model, string role)
        {
            var existing = _context.Users.FirstOrDefault(u =>
                u.Email == model.Email || u.Username.ToLower() == model.Username.ToLower());

            if (existing != null)
            {
                if (existing.Email == model.Email)
                {
                    return (400, "User with this email already exists");
                }
                else
                {
                    return (400, "User with this username already exists");
                }
            }

            var appUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Username,
                PhoneNumber = model.MobileNumber
            };

            var createResult = await _userManager.CreateAsync(appUser, model.Password);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                return (0, $"User creation failed: {errors}");
            }

            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            await _userManager.AddToRoleAsync(appUser, role);

            await _userManager.AddClaimAsync(appUser, new Claim("username", appUser.Name));
            await _userManager.AddClaimAsync(appUser, new Claim("role", role));
            await _userManager.AddClaimAsync(appUser, new Claim("email", appUser.Email));

            model.Password = _userManager.PasswordHasher.HashPassword(appUser, model.Password);
            _context.Users.Add(model);
            await _context.SaveChangesAsync();

            return (201, "User created successfully!");
        }

        public async Task<(int, object)> Login(LoginModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user == null)
            {
                throw new UnauthorizedException("User not found");
            }

            var appUser = await _userManager.FindByEmailAsync(model.Email);
            if (appUser == null) return (400, "Invalid email");

            var check = await _userManager.CheckPasswordAsync(appUser, model.Password);
            if (!check) return (400, "Invalid password");

            var userRoles = await _userManager.GetRolesAsync(appUser);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, appUser.Name),
                new Claim("username", appUser.UserName ?? appUser.Email),
                new Claim("UserId", user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = GenerateToken(authClaims);
            return (201, new { Status = "Success", token, Role = userRoles.FirstOrDefault() });
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JWT");
            var secret = jwtSettings.GetValue<string>("Secret");
            var issuer = jwtSettings.GetValue<string>("ValidIssuer");
            var audience = jwtSettings.GetValue<string>("ValidAudience");

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddHours(3),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
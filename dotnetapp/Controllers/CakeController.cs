using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/cakes")]
    public class CakeController : ControllerBase
    {
        private readonly ICakeService _cakeService;
        private readonly LoggerService _logger;

        public CakeController(ICakeService cakeService, LoggerService logger)
        {
            _cakeService = cakeService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Cake>>> GetAllCakes()
        {
            try
            {
                var cakes = await _cakeService.GetAllCakes();
                return Ok(cakes);
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(GetAllCakes),
                    requestPath: "/api/cakes",
                    requestMethod: "GET"
                );
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{cakeId}")]
        [Authorize]
        public async Task<ActionResult<Cake>> GetCakeById(int cakeId)
        {
            try
            {
                var cake = await _cakeService.GetCakeById(cakeId);
                if (cake == null)
                {
                    throw new NotFoundException("Cannot find any cake");
                }
                return Ok(cake);
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(GetCakeById),
                    requestPath: $"/api/cakes/{cakeId}",
                    requestMethod: "GET"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(GetCakeById),
                    requestPath: $"/api/cakes/{cakeId}",
                    requestMethod: "GET"
                );
                return StatusCode(500, new { message = "Internal server error occurred." });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Baker")]
        public async Task<ActionResult> AddCake([FromBody] Cake cake)
        {
            try
            {
                var ok = await _cakeService.AddCake(cake);
                if (!ok)
                {
                    return StatusCode(500, new { message = "Failed to add cake" });
                }
                return Created(string.Empty, new { message = "Cake added successfully" });
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(AddCake),
                    requestPath: "/api/cakes",
                    requestMethod: "POST"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(AddCake),
                    requestPath: "/api/cakes",
                    requestMethod: "POST"
                );
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{cakeId}")]
        [Authorize(Roles = "Baker")]
        public async Task<ActionResult> UpdateCake(int cakeId, [FromBody] Cake cake)
        {
            try
            {
                var ok = await _cakeService.UpdateCake(cakeId, cake);
                if (!ok)
                {
                    throw new NotFoundException("Cannot find any cake");
                }
                return Ok(new { message = "Cake updated successfully" });
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(UpdateCake),
                    requestPath: $"/api/cakes/{cakeId}",
                    requestMethod: "PUT"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(UpdateCake),
                    requestPath: $"/api/cakes/{cakeId}",
                    requestMethod: "PUT"
                );
                return StatusCode(500, new { message = "Internal server error occurred." });
            }
        }

        [HttpDelete("{cakeId}")]
        [Authorize(Roles = "Baker")]
        public async Task<ActionResult> DeleteCake(int cakeId)
        {
            try
            {
                var ok = await _cakeService.DeleteCake(cakeId);
                if (!ok)
                {
                    throw new NotFoundException("Cannot find any cake");
                }
                return Ok(new { message = "Cake deleted successfully" });
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(DeleteCake),
                    requestPath: $"/api/cakes/{cakeId}",
                    requestMethod: "DELETE"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(DeleteCake),
                    requestPath: $"/api/cakes/{cakeId}",
                    requestMethod: "DELETE"
                );
                return StatusCode(500, new { message = "Internal server error occurred." });
            }
        }

        [HttpPost("wishlist/add")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> AddToWishlist(string userId, int cakeId)
        {
            try
            {
                var result = await _cakeService.AddToWishlistAsync(userId, cakeId);
                if (!result)
                {
                    return BadRequest("Cake is already in wishlist");
                }
                return Ok("Added");
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(AddToWishlist),
                    requestPath: "/api/cakes/wishlist/add",
                    requestMethod: "POST"
                );
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("wishlist")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetWishlist(string userId)
        {
            try
            {
                var items = await _cakeService.GetWishlistAsync(userId);
                if (items == null || items.Count == 0)
                {
                    return Ok(new List<Cake>());
                }
                return Ok(items);
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(GetWishlist),
                    requestPath: "/api/cakes/wishlist",
                    requestMethod: "GET"
                );
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("wishlist/remove")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> RemoveFromWishlist(string userId, int cakeId)
        {
            try
            {
                var result = await _cakeService.RemoveFromWishlistAsync(userId, cakeId);
                if (!result)
                {
                    throw new NotFoundException("Cannot find any cake");
                }
                return Ok("Removed");
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(RemoveFromWishlist),
                    requestPath: "/api/cakes/wishlist/remove",
                    requestMethod: "DELETE"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(RemoveFromWishlist),
                    requestPath: "/api/cakes/wishlist/remove",
                    requestMethod: "DELETE"
                );
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("wishlist/clear")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> ClearWishlist(string userId)
        {
            try
            {
                var result = await _cakeService.ClearWishlistAsync(userId);
                if (!result)
                {
                    throw new NotFoundException("Cannot find any cake");
                }
                return Ok("Cleared");
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(ClearWishlist),
                    requestPath: "/api/cakes/wishlist/clear",
                    requestMethod: "DELETE"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: User.FindFirst("username")?.Value,
                    controllerName: nameof(CakeController),
                    actionName: nameof(ClearWishlist),
                    requestPath: "/api/cakes/wishlist/clear",
                    requestMethod: "DELETE"
                );
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
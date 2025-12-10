using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly LoggerService _logger;

        public AuthenticationController(IAuthService authService, LoggerService logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var (status, result) = await _authService.Login(model);
                if (status == 201) return Created(string.Empty, result);

                await _logger.LogErrorAsync(
                    new Exception("Invalid login attempt"),
                    username: model.Email,
                    controllerName: nameof(AuthenticationController),
                    actionName: nameof(Login),
                    requestPath: "/api/login",
                    requestMethod: "POST"
                );

                return BadRequest(new { message = result });
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: model.Email,
                    controllerName: nameof(AuthenticationController),
                    actionName: nameof(Login),
                    requestPath: "/api/login",
                    requestMethod: "POST"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: model.Email,
                    controllerName: nameof(AuthenticationController),
                    actionName: nameof(Login),
                    requestPath: "/api/login",
                    requestMethod: "POST"
                );
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new AppException("Invalid Input", 400);
                }

                var (status, message) = await _authService.Registration(model, model.UserRole);

                if (status != 201)
                {
                    await _logger.LogErrorAsync(
                        new Exception(message),
                        username: model.Email,
                        controllerName: nameof(AuthenticationController),
                        actionName: nameof(Register),
                        requestPath: "/api/register",
                        requestMethod: "POST"
                    );
                }

                return StatusCode(status, new { Message = message });
            }
            catch (AppException ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: model.Email,
                    controllerName: nameof(AuthenticationController),
                    actionName: nameof(Register),
                    requestPath: "/api/register",
                    requestMethod: "POST"
                );
                return StatusCode(ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                await _logger.LogErrorAsync(
                    ex,
                    username: model.Email,
                    controllerName: nameof(AuthenticationController),
                    actionName: nameof(Register),
                    requestPath: "/api/register",
                    requestMethod: "POST"
                );
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
using System;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    public class LoggerService
    {
        private readonly ApplicationDbContext _context;

        public LoggerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogErrorAsync(
            Exception ex,
            string? username = null,
            string? controllerName = null,
            string? actionName = null,
            string? requestPath = null,
            string? requestMethod = null)
        {
            var errorLog = new ErrorLog
            {
                Timestamp = DateTime.UtcNow,
                ExceptionType = ex.GetType().Name,
                Message = ex.Message,
                Username = username,
                ControllerName = controllerName,
                ActionName = actionName,
                RequestPath = requestPath,
                RequestMethod = requestMethod
            };

            _context.ErrorLogs.Add(errorLog);
            await _context.SaveChangesAsync();
        }
    }
}
using System.Security.Claims;
using BudgetTracker.Core.DTOs.Dashboard;
using BudgetTracker.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetDashboardSummary([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var userId = GetUserId();
            var summary = await _dashboardService.GetDashboardSummaryAsync(userId, startDate, endDate);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard summary");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyDashboard([FromQuery] int year, [FromQuery] int month)
    {
        try
        {
            var userId = GetUserId();
            var summary = await _dashboardService.GetMonthlyDashboardAsync(userId, year, month);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting monthly dashboard");
            return BadRequest(new { message = ex.Message });
        }
    }
}

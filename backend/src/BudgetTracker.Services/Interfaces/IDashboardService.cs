using BudgetTracker.Core.DTOs.Dashboard;

namespace BudgetTracker.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync(string userId, DateTime startDate, DateTime endDate);
    Task<DashboardSummaryDto> GetMonthlyDashboardAsync(string userId, int year, int month);
}

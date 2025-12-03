using BudgetTracker.Core.DTOs.Dashboard;
using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Enums;
using BudgetTracker.Core.Interfaces;
using BudgetTracker.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetTracker.Services.Services;

public class DashboardService : IDashboardService
{
    private readonly IRepository<Transaction> _transactionRepo;

    public DashboardService(IRepository<Transaction> transactionRepo)
    {
        _transactionRepo = transactionRepo;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(string userId, DateTime startDate, DateTime endDate)
    {
        var transactions = await _transactionRepo.FindAsync(t =>
            t.UserId == userId &&
            t.TransactionDate >= startDate &&
            t.TransactionDate <= endDate);

        var transactionList = transactions.ToList();

        var summary = new DashboardSummaryDto
        {
            TotalIncome = transactionList.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
            TotalExpense = transactionList.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
        };

        summary.NetBalance = summary.TotalIncome - summary.TotalExpense;
        summary.SavingsRate = summary.TotalIncome > 0
            ? (summary.NetBalance / summary.TotalIncome) * 100
            : 0;

        // Expenses by Category
        var expensesByCategory = transactionList
            .Where(t => t.Type == TransactionType.Expense && t.Category != null)
            .GroupBy(t => new { t.Category!.Name, t.Category.Color })
            .Select(g => new CategoryExpenseDto
            {
                CategoryName = g.Key.Name,
                CategoryColor = g.Key.Color,
                Amount = g.Sum(t => t.Amount),
                Percentage = summary.TotalExpense > 0 ? (g.Sum(t => t.Amount) / summary.TotalExpense) * 100 : 0
            })
            .OrderByDescending(c => c.Amount)
            .ToList();

        summary.ExpensesByCategory = expensesByCategory;

        // Monthly Trends (last 6 months)
        var monthlyTrends = new List<MonthlyTrendDto>();
        for (int i = 5; i >= 0; i--)
        {
            var monthStart = DateTime.Now.AddMonths(-i).Date;
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var monthTransactions = transactionList.Where(t =>
                t.TransactionDate >= monthStart && t.TransactionDate <= monthEnd).ToList();

            var income = monthTransactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
            var expense = monthTransactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);

            monthlyTrends.Add(new MonthlyTrendDto
            {
                Month = monthStart.ToString("MMM yyyy"),
                Income = income,
                Expense = expense,
                NetBalance = income - expense
            });
        }

        summary.MonthlyTrends = monthlyTrends;

        // Expenses by Payment Method
        var expensesByPaymentMethod = transactionList
            .Where(t => t.Type == TransactionType.Expense && t.PaymentMethod != null)
            .GroupBy(t => t.PaymentMethod!.Name)
            .Select(g => new PaymentMethodExpenseDto
            {
                PaymentMethodName = g.Key,
                Amount = g.Sum(t => t.Amount),
                Percentage = summary.TotalExpense > 0 ? (g.Sum(t => t.Amount) / summary.TotalExpense) * 100 : 0
            })
            .OrderByDescending(p => p.Amount)
            .ToList();

        summary.ExpensesByPaymentMethod = expensesByPaymentMethod;

        return summary;
    }

    public async Task<DashboardSummaryDto> GetMonthlyDashboardAsync(string userId, int year, int month)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);
        return await GetDashboardSummaryAsync(userId, startDate, endDate);
    }
}

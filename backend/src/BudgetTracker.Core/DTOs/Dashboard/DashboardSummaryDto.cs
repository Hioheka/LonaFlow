namespace BudgetTracker.Core.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal NetBalance { get; set; }
    public decimal SavingsRate { get; set; }
    public List<CategoryExpenseDto> ExpensesByCategory { get; set; } = new();
    public List<MonthlyTrendDto> MonthlyTrends { get; set; } = new();
    public List<PaymentMethodExpenseDto> ExpensesByPaymentMethod { get; set; } = new();
}

public class CategoryExpenseDto
{
    public string CategoryName { get; set; } = string.Empty;
    public string? CategoryColor { get; set; }
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}

public class MonthlyTrendDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Income { get; set; }
    public decimal Expense { get; set; }
    public decimal NetBalance { get; set; }
}

public class PaymentMethodExpenseDto
{
    public string PaymentMethodName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}

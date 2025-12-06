using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.DTOs.RecurringTransaction;

public class UpcomingPaymentDto
{
    public int RecurringTransactionId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public TransactionType Type { get; set; }
    public string? CategoryName { get; set; }
    public string? PaymentMethodName { get; set; }
    public string? CreditorName { get; set; }
    public bool IsProcessed { get; set; }
}

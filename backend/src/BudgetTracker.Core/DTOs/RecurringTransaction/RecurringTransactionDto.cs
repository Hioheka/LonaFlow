using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.DTOs.RecurringTransaction;

public class RecurringTransactionDto
{
    public int Id { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public RecurrenceFrequency Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? NextDueDate { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int? PaymentMethodId { get; set; }
    public string? PaymentMethodName { get; set; }
    public int? CreditorId { get; set; }
    public string? CreditorName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

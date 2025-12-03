using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.DTOs.Transaction;

public class TransactionDto
{
    public int Id { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public DateTime TransactionDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int? PaymentMethodId { get; set; }
    public string? PaymentMethodName { get; set; }
    public int? CreditorId { get; set; }
    public string? CreditorName { get; set; }
    public bool IsRecurring { get; set; }
    public DateTime CreatedAt { get; set; }
}

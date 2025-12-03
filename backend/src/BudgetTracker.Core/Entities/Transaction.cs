using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.Entities;

public class Transaction
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public DateTime TransactionDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Notes { get; set; }

    // Foreign Keys
    public int? CategoryId { get; set; }
    public int? PaymentMethodId { get; set; }
    public int? CreditorId { get; set; }
    public int? RecurringTransactionInstanceId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    public ApplicationUser User { get; set; } = null!;
    public Category? Category { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    public Creditor? Creditor { get; set; }
    public RecurringTransactionInstance? RecurringTransactionInstance { get; set; }
}

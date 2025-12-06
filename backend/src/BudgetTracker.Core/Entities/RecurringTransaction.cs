using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.Entities;

public class RecurringTransaction
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Notes { get; set; }

    // Recurrence Settings
    public RecurrenceFrequency Frequency { get; set; }
    public int? DayOfMonth { get; set; } // Ayın kaçında ödeme yapılacak (1-31, null = StartDate'in günü kullanılır)
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; } // Null = sonsuz
    public DateTime? LastProcessedDate { get; set; }
    public DateTime? NextDueDate { get; set; }

    // Foreign Keys
    public int? CategoryId { get; set; }
    public int? PaymentMethodId { get; set; }
    public int? CreditorId { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    public ApplicationUser User { get; set; } = null!;
    public Category? Category { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    public Creditor? Creditor { get; set; }
    public ICollection<RecurringTransactionInstance> Instances { get; set; } = new List<RecurringTransactionInstance>();
}

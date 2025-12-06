using System.ComponentModel.DataAnnotations;
using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.DTOs.RecurringTransaction;

public class UpdateRecurringTransactionDto
{
    [Required]
    public TransactionType Type { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    public string? Notes { get; set; }

    [Required]
    public RecurrenceFrequency Frequency { get; set; }

    [Range(1, 31)]
    public int? DayOfMonth { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public int? CategoryId { get; set; }
    public int? PaymentMethodId { get; set; }
    public int? CreditorId { get; set; }
    public bool IsActive { get; set; } = true;
}

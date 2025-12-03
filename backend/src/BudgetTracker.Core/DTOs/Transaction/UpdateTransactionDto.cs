using System.ComponentModel.DataAnnotations;
using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.DTOs.Transaction;

public class UpdateTransactionDto
{
    [Required]
    public TransactionType Type { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public DateTime TransactionDate { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    public string? Notes { get; set; }
    public int? CategoryId { get; set; }
    public int? PaymentMethodId { get; set; }
    public int? CreditorId { get; set; }
}

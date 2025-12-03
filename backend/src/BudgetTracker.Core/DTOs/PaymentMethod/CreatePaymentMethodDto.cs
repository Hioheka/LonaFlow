using System.ComponentModel.DataAnnotations;
using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.DTOs.PaymentMethod;

public class CreatePaymentMethodDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public PaymentMethodType Type { get; set; }

    public string? Description { get; set; }
}

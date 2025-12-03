using BudgetTracker.Core.Enums;

namespace BudgetTracker.Core.DTOs.PaymentMethod;

public class PaymentMethodDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public PaymentMethodType Type { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

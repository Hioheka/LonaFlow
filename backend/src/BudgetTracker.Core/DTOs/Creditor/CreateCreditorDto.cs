using System.ComponentModel.DataAnnotations;

namespace BudgetTracker.Core.DTOs.Creditor;

public class CreateCreditorDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? ContactInfo { get; set; }
    public string? Description { get; set; }
}

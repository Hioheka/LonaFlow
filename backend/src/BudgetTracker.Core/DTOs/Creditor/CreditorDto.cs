namespace BudgetTracker.Core.DTOs.Creditor;

public class CreditorDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ContactInfo { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

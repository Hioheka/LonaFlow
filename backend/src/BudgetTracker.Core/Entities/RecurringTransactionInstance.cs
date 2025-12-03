namespace BudgetTracker.Core.Entities;

public class RecurringTransactionInstance
{
    public int Id { get; set; }
    public int RecurringTransactionId { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsProcessed { get; set; } = false;
    public DateTime? ProcessedAt { get; set; }

    // Navigation Properties
    public RecurringTransaction RecurringTransaction { get; set; } = null!;
    public Transaction? Transaction { get; set; }
}

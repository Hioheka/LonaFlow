using System.ComponentModel.DataAnnotations;

namespace BudgetTracker.Core.DTOs.Category;

public class CreateCategoryDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? Color { get; set; }
}

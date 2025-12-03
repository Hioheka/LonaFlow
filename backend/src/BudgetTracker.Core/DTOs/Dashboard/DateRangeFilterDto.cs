using System.ComponentModel.DataAnnotations;

namespace BudgetTracker.Core.DTOs.Dashboard;

public class DateRangeFilterDto
{
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }
}

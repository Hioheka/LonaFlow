using BudgetTracker.Core.DTOs.Category;

namespace BudgetTracker.Services.Interfaces;

public interface ICategoryService
{
    Task<CategoryDto> CreateAsync(string userId, CreateCategoryDto dto);
    Task<CategoryDto> UpdateAsync(string userId, int id, UpdateCategoryDto dto);
    Task<bool> DeleteAsync(string userId, int id);
    Task<CategoryDto?> GetByIdAsync(string userId, int id);
    Task<IEnumerable<CategoryDto>> GetAllAsync(string userId);
}

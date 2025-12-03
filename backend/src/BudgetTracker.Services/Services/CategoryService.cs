using BudgetTracker.Core.DTOs.Category;
using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Interfaces;
using BudgetTracker.Services.Interfaces;

namespace BudgetTracker.Services.Services;

public class CategoryService : ICategoryService
{
    private readonly IRepository<Category> _categoryRepo;
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IRepository<Category> categoryRepo, IUnitOfWork unitOfWork)
    {
        _categoryRepo = categoryRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<CategoryDto> CreateAsync(string userId, CreateCategoryDto dto)
    {
        var category = new Category
        {
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            Color = dto.Color,
            CreatedAt = DateTime.UtcNow
        };

        await _categoryRepo.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<CategoryDto> UpdateAsync(string userId, int id, UpdateCategoryDto dto)
    {
        var category = await _categoryRepo.GetByIdAsync(id);
        if (category == null || category.UserId != userId)
            throw new Exception("Category not found");

        category.Name = dto.Name;
        category.Description = dto.Description;
        category.Color = dto.Color;
        category.IsActive = dto.IsActive;

        await _categoryRepo.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<bool> DeleteAsync(string userId, int id)
    {
        var category = await _categoryRepo.GetByIdAsync(id);
        if (category == null || category.UserId != userId)
            return false;

        await _categoryRepo.DeleteAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<CategoryDto?> GetByIdAsync(string userId, int id)
    {
        var category = await _categoryRepo.GetByIdAsync(id);
        if (category == null || category.UserId != userId)
            return null;

        return MapToDto(category);
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync(string userId)
    {
        var categories = await _categoryRepo.FindAsync(c => c.UserId == userId);
        return categories.Select(MapToDto);
    }

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Color = category.Color,
            IsActive = category.IsActive,
            CreatedAt = category.CreatedAt
        };
    }
}

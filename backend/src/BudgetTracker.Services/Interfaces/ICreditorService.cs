using BudgetTracker.Core.DTOs.Creditor;

namespace BudgetTracker.Services.Interfaces;

public interface ICreditorService
{
    Task<CreditorDto> CreateAsync(string userId, CreateCreditorDto dto);
    Task<CreditorDto> UpdateAsync(string userId, int id, UpdateCreditorDto dto);
    Task<bool> DeleteAsync(string userId, int id);
    Task<CreditorDto?> GetByIdAsync(string userId, int id);
    Task<IEnumerable<CreditorDto>> GetAllAsync(string userId);
}

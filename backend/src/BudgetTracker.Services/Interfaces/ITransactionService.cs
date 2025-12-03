using BudgetTracker.Core.DTOs.Transaction;

namespace BudgetTracker.Services.Interfaces;

public interface ITransactionService
{
    Task<TransactionDto> CreateAsync(string userId, CreateTransactionDto dto);
    Task<TransactionDto> UpdateAsync(string userId, int id, UpdateTransactionDto dto);
    Task<bool> DeleteAsync(string userId, int id);
    Task<TransactionDto?> GetByIdAsync(string userId, int id);
    Task<IEnumerable<TransactionDto>> GetAllAsync(string userId);
    Task<IEnumerable<TransactionDto>> GetByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
}

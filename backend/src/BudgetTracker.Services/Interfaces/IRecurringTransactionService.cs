using BudgetTracker.Core.DTOs.RecurringTransaction;

namespace BudgetTracker.Services.Interfaces;

public interface IRecurringTransactionService
{
    Task<RecurringTransactionDto> CreateAsync(string userId, CreateRecurringTransactionDto dto);
    Task<RecurringTransactionDto> UpdateAsync(string userId, int id, UpdateRecurringTransactionDto dto);
    Task<bool> DeleteAsync(string userId, int id);
    Task<RecurringTransactionDto?> GetByIdAsync(string userId, int id);
    Task<IEnumerable<RecurringTransactionDto>> GetAllAsync(string userId);
    Task<IEnumerable<RecurringTransactionDto>> GetActiveAsync(string userId);
    Task<IEnumerable<UpcomingPaymentDto>> GetUpcomingPaymentsAsync(string userId, int? months = null, int? days = null);
}

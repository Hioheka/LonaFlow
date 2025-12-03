using BudgetTracker.Core.DTOs.PaymentMethod;

namespace BudgetTracker.Services.Interfaces;

public interface IPaymentMethodService
{
    Task<PaymentMethodDto> CreateAsync(string userId, CreatePaymentMethodDto dto);
    Task<PaymentMethodDto> UpdateAsync(string userId, int id, UpdatePaymentMethodDto dto);
    Task<bool> DeleteAsync(string userId, int id);
    Task<PaymentMethodDto?> GetByIdAsync(string userId, int id);
    Task<IEnumerable<PaymentMethodDto>> GetAllAsync(string userId);
}

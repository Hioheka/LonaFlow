using BudgetTracker.Core.DTOs.PaymentMethod;
using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Interfaces;
using BudgetTracker.Services.Interfaces;

namespace BudgetTracker.Services.Services;

public class PaymentMethodService : IPaymentMethodService
{
    private readonly IRepository<PaymentMethod> _paymentMethodRepo;
    private readonly IUnitOfWork _unitOfWork;

    public PaymentMethodService(IRepository<PaymentMethod> paymentMethodRepo, IUnitOfWork unitOfWork)
    {
        _paymentMethodRepo = paymentMethodRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<PaymentMethodDto> CreateAsync(string userId, CreatePaymentMethodDto dto)
    {
        var paymentMethod = new PaymentMethod
        {
            UserId = userId,
            Name = dto.Name,
            Type = dto.Type,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _paymentMethodRepo.AddAsync(paymentMethod);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(paymentMethod);
    }

    public async Task<PaymentMethodDto> UpdateAsync(string userId, int id, UpdatePaymentMethodDto dto)
    {
        var paymentMethod = await _paymentMethodRepo.GetByIdAsync(id);
        if (paymentMethod == null || paymentMethod.UserId != userId)
            throw new Exception("Payment method not found");

        paymentMethod.Name = dto.Name;
        paymentMethod.Type = dto.Type;
        paymentMethod.Description = dto.Description;
        paymentMethod.IsActive = dto.IsActive;

        await _paymentMethodRepo.UpdateAsync(paymentMethod);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(paymentMethod);
    }

    public async Task<bool> DeleteAsync(string userId, int id)
    {
        var paymentMethod = await _paymentMethodRepo.GetByIdAsync(id);
        if (paymentMethod == null || paymentMethod.UserId != userId)
            return false;

        await _paymentMethodRepo.DeleteAsync(paymentMethod);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<PaymentMethodDto?> GetByIdAsync(string userId, int id)
    {
        var paymentMethod = await _paymentMethodRepo.GetByIdAsync(id);
        if (paymentMethod == null || paymentMethod.UserId != userId)
            return null;

        return MapToDto(paymentMethod);
    }

    public async Task<IEnumerable<PaymentMethodDto>> GetAllAsync(string userId)
    {
        var paymentMethods = await _paymentMethodRepo.FindAsync(p => p.UserId == userId);
        return paymentMethods.Select(MapToDto);
    }

    private static PaymentMethodDto MapToDto(PaymentMethod paymentMethod)
    {
        return new PaymentMethodDto
        {
            Id = paymentMethod.Id,
            Name = paymentMethod.Name,
            Type = paymentMethod.Type,
            Description = paymentMethod.Description,
            IsActive = paymentMethod.IsActive,
            CreatedAt = paymentMethod.CreatedAt
        };
    }
}

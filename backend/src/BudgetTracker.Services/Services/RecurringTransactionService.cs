using BudgetTracker.Core.DTOs.RecurringTransaction;
using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Enums;
using BudgetTracker.Core.Interfaces;
using BudgetTracker.Services.Interfaces;

namespace BudgetTracker.Services.Services;

public class RecurringTransactionService : IRecurringTransactionService
{
    private readonly IRepository<RecurringTransaction> _recurringRepo;
    private readonly IUnitOfWork _unitOfWork;

    public RecurringTransactionService(IRepository<RecurringTransaction> recurringRepo, IUnitOfWork unitOfWork)
    {
        _recurringRepo = recurringRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<RecurringTransactionDto> CreateAsync(string userId, CreateRecurringTransactionDto dto)
    {
        var recurring = new RecurringTransaction
        {
            UserId = userId,
            Type = dto.Type,
            Amount = dto.Amount,
            Description = dto.Description,
            Notes = dto.Notes,
            Frequency = dto.Frequency,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            NextDueDate = dto.StartDate,
            CategoryId = dto.CategoryId,
            PaymentMethodId = dto.PaymentMethodId,
            CreditorId = dto.CreditorId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _recurringRepo.AddAsync(recurring);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(recurring);
    }

    public async Task<RecurringTransactionDto> UpdateAsync(string userId, int id, UpdateRecurringTransactionDto dto)
    {
        var recurring = await _recurringRepo.GetByIdAsync(id);
        if (recurring == null || recurring.UserId != userId)
            throw new Exception("Recurring transaction not found");

        recurring.Type = dto.Type;
        recurring.Amount = dto.Amount;
        recurring.Description = dto.Description;
        recurring.Notes = dto.Notes;
        recurring.Frequency = dto.Frequency;
        recurring.StartDate = dto.StartDate;
        recurring.EndDate = dto.EndDate;
        recurring.CategoryId = dto.CategoryId;
        recurring.PaymentMethodId = dto.PaymentMethodId;
        recurring.CreditorId = dto.CreditorId;
        recurring.IsActive = dto.IsActive;
        recurring.UpdatedAt = DateTime.UtcNow;

        await _recurringRepo.UpdateAsync(recurring);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(recurring);
    }

    public async Task<bool> DeleteAsync(string userId, int id)
    {
        var recurring = await _recurringRepo.GetByIdAsync(id);
        if (recurring == null || recurring.UserId != userId)
            return false;

        await _recurringRepo.DeleteAsync(recurring);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<RecurringTransactionDto?> GetByIdAsync(string userId, int id)
    {
        var recurring = await _recurringRepo.GetByIdAsync(id);
        if (recurring == null || recurring.UserId != userId)
            return null;

        return MapToDto(recurring);
    }

    public async Task<IEnumerable<RecurringTransactionDto>> GetAllAsync(string userId)
    {
        var recurring = await _recurringRepo.FindAsync(r => r.UserId == userId);
        return recurring.Select(MapToDto);
    }

    public async Task<IEnumerable<RecurringTransactionDto>> GetActiveAsync(string userId)
    {
        var recurring = await _recurringRepo.FindAsync(r => r.UserId == userId && r.IsActive);
        return recurring.Select(MapToDto);
    }

    private static RecurringTransactionDto MapToDto(RecurringTransaction recurring)
    {
        return new RecurringTransactionDto
        {
            Id = recurring.Id,
            Type = recurring.Type,
            Amount = recurring.Amount,
            Description = recurring.Description,
            Notes = recurring.Notes,
            Frequency = recurring.Frequency,
            StartDate = recurring.StartDate,
            EndDate = recurring.EndDate,
            NextDueDate = recurring.NextDueDate,
            CategoryId = recurring.CategoryId,
            CategoryName = recurring.Category?.Name,
            PaymentMethodId = recurring.PaymentMethodId,
            PaymentMethodName = recurring.PaymentMethod?.Name,
            CreditorId = recurring.CreditorId,
            CreditorName = recurring.Creditor?.Name,
            IsActive = recurring.IsActive,
            CreatedAt = recurring.CreatedAt
        };
    }
}

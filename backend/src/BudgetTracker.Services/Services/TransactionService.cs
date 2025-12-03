using BudgetTracker.Core.DTOs.Transaction;
using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Interfaces;
using BudgetTracker.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetTracker.Services.Services;

public class TransactionService : ITransactionService
{
    private readonly IRepository<Transaction> _transactionRepo;
    private readonly IUnitOfWork _unitOfWork;

    public TransactionService(IRepository<Transaction> transactionRepo, IUnitOfWork unitOfWork)
    {
        _transactionRepo = transactionRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<TransactionDto> CreateAsync(string userId, CreateTransactionDto dto)
    {
        var transaction = new Transaction
        {
            UserId = userId,
            Type = dto.Type,
            Amount = dto.Amount,
            TransactionDate = dto.TransactionDate,
            Description = dto.Description,
            Notes = dto.Notes,
            CategoryId = dto.CategoryId,
            PaymentMethodId = dto.PaymentMethodId,
            CreditorId = dto.CreditorId,
            CreatedAt = DateTime.UtcNow
        };

        await _transactionRepo.AddAsync(transaction);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(transaction);
    }

    public async Task<TransactionDto> UpdateAsync(string userId, int id, UpdateTransactionDto dto)
    {
        var transaction = await _transactionRepo.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != userId)
            throw new Exception("Transaction not found");

        transaction.Type = dto.Type;
        transaction.Amount = dto.Amount;
        transaction.TransactionDate = dto.TransactionDate;
        transaction.Description = dto.Description;
        transaction.Notes = dto.Notes;
        transaction.CategoryId = dto.CategoryId;
        transaction.PaymentMethodId = dto.PaymentMethodId;
        transaction.CreditorId = dto.CreditorId;
        transaction.UpdatedAt = DateTime.UtcNow;

        await _transactionRepo.UpdateAsync(transaction);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(transaction);
    }

    public async Task<bool> DeleteAsync(string userId, int id)
    {
        var transaction = await _transactionRepo.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != userId)
            return false;

        await _transactionRepo.DeleteAsync(transaction);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<TransactionDto?> GetByIdAsync(string userId, int id)
    {
        var transaction = await _transactionRepo.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != userId)
            return null;

        return MapToDto(transaction);
    }

    public async Task<IEnumerable<TransactionDto>> GetAllAsync(string userId)
    {
        var transactions = await _transactionRepo.FindAsync(t => t.UserId == userId);
        return transactions.Select(MapToDto);
    }

    public async Task<IEnumerable<TransactionDto>> GetByDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
    {
        var transactions = await _transactionRepo.FindAsync(t =>
            t.UserId == userId &&
            t.TransactionDate >= startDate &&
            t.TransactionDate <= endDate);

        return transactions.OrderByDescending(t => t.TransactionDate).Select(MapToDto);
    }

    private static TransactionDto MapToDto(Transaction transaction)
    {
        return new TransactionDto
        {
            Id = transaction.Id,
            Type = transaction.Type,
            Amount = transaction.Amount,
            TransactionDate = transaction.TransactionDate,
            Description = transaction.Description,
            Notes = transaction.Notes,
            CategoryId = transaction.CategoryId,
            CategoryName = transaction.Category?.Name,
            PaymentMethodId = transaction.PaymentMethodId,
            PaymentMethodName = transaction.PaymentMethod?.Name,
            CreditorId = transaction.CreditorId,
            CreditorName = transaction.Creditor?.Name,
            IsRecurring = transaction.RecurringTransactionInstanceId.HasValue,
            CreatedAt = transaction.CreatedAt
        };
    }
}

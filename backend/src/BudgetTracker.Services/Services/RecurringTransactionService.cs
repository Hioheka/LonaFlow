using BudgetTracker.Core.DTOs.RecurringTransaction;
using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Enums;
using BudgetTracker.Core.Interfaces;
using BudgetTracker.Services.Interfaces;

namespace BudgetTracker.Services.Services;

public class RecurringTransactionService : IRecurringTransactionService
{
    private readonly IRepository<RecurringTransaction> _recurringRepo;
    private readonly IRepository<RecurringTransactionInstance> _instanceRepo;
    private readonly IUnitOfWork _unitOfWork;

    public RecurringTransactionService(
        IRepository<RecurringTransaction> recurringRepo,
        IRepository<RecurringTransactionInstance> instanceRepo,
        IUnitOfWork unitOfWork)
    {
        _recurringRepo = recurringRepo;
        _instanceRepo = instanceRepo;
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
            DayOfMonth = dto.DayOfMonth,
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
        recurring.DayOfMonth = dto.DayOfMonth;
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

    public async Task<IEnumerable<UpcomingPaymentDto>> GetUpcomingPaymentsAsync(string userId, int? months = null, int? days = null)
    {
        var activeRecurring = await _recurringRepo.FindAsync(r => r.UserId == userId && r.IsActive);
        var upcomingPayments = new List<UpcomingPaymentDto>();
        var now = DateTime.UtcNow;

        // Eğer days parametresi verilmişse onu kullan, yoksa months kullan (default 1 ay = 30 gün)
        var endDate = days.HasValue
            ? now.AddDays(days.Value)
            : now.AddMonths(months ?? 1);

        foreach (var recurring in activeRecurring)
        {
            var payments = GenerateUpcomingPayments(recurring, now, endDate);
            upcomingPayments.AddRange(payments);
        }

        return upcomingPayments.OrderBy(p => p.DueDate).ToList();
    }

    private List<UpcomingPaymentDto> GenerateUpcomingPayments(RecurringTransaction recurring, DateTime startDate, DateTime endDate)
    {
        var payments = new List<UpcomingPaymentDto>();
        var currentDate = recurring.NextDueDate ?? recurring.StartDate;

        // Eğer NextDueDate geçmişte ise, şu anki tarihe göre ayarla
        if (currentDate < startDate)
        {
            currentDate = CalculateNextDueDate(recurring, startDate);
        }

        while (currentDate <= endDate)
        {
            // EndDate kontrolü
            if (recurring.EndDate.HasValue && currentDate > recurring.EndDate.Value)
                break;

            payments.Add(new UpcomingPaymentDto
            {
                RecurringTransactionId = recurring.Id,
                Description = recurring.Description,
                Amount = recurring.Amount,
                DueDate = currentDate,
                Type = recurring.Type,
                CategoryName = recurring.Category?.Name,
                PaymentMethodName = recurring.PaymentMethod?.Name,
                CreditorName = recurring.Creditor?.Name,
                IsProcessed = false
            });

            currentDate = CalculateNextDueDate(recurring, currentDate);
        }

        return payments;
    }

    private DateTime CalculateNextDueDate(RecurringTransaction recurring, DateTime fromDate)
    {
        return recurring.Frequency switch
        {
            RecurrenceFrequency.Daily => fromDate.AddDays(1),
            RecurrenceFrequency.Weekly => fromDate.AddDays(7),
            RecurrenceFrequency.Monthly => CalculateNextMonthlyDate(fromDate, recurring.DayOfMonth),
            RecurrenceFrequency.Yearly => fromDate.AddYears(1),
            RecurrenceFrequency.OneTime => fromDate.AddYears(100), // OneTime için çok ileride bir tarih
            _ => fromDate.AddMonths(1)
        };
    }

    private DateTime CalculateNextMonthlyDate(DateTime fromDate, int? dayOfMonth)
    {
        var targetDay = dayOfMonth ?? fromDate.Day;
        var nextMonth = fromDate.AddMonths(1);
        var daysInNextMonth = DateTime.DaysInMonth(nextMonth.Year, nextMonth.Month);

        // Eğer hedef gün o ayda yoksa (örn: 31 Şubat), ayın son günü kullan
        var actualDay = Math.Min(targetDay, daysInNextMonth);

        return new DateTime(nextMonth.Year, nextMonth.Month, actualDay, fromDate.Hour, fromDate.Minute, fromDate.Second);
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
            DayOfMonth = recurring.DayOfMonth,
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

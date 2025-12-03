using BudgetTracker.Core.DTOs.Creditor;
using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Interfaces;
using BudgetTracker.Services.Interfaces;

namespace BudgetTracker.Services.Services;

public class CreditorService : ICreditorService
{
    private readonly IRepository<Creditor> _creditorRepo;
    private readonly IUnitOfWork _unitOfWork;

    public CreditorService(IRepository<Creditor> creditorRepo, IUnitOfWork unitOfWork)
    {
        _creditorRepo = creditorRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<CreditorDto> CreateAsync(string userId, CreateCreditorDto dto)
    {
        var creditor = new Creditor
        {
            UserId = userId,
            Name = dto.Name,
            ContactInfo = dto.ContactInfo,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _creditorRepo.AddAsync(creditor);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(creditor);
    }

    public async Task<CreditorDto> UpdateAsync(string userId, int id, UpdateCreditorDto dto)
    {
        var creditor = await _creditorRepo.GetByIdAsync(id);
        if (creditor == null || creditor.UserId != userId)
            throw new Exception("Creditor not found");

        creditor.Name = dto.Name;
        creditor.ContactInfo = dto.ContactInfo;
        creditor.Description = dto.Description;
        creditor.IsActive = dto.IsActive;

        await _creditorRepo.UpdateAsync(creditor);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(creditor);
    }

    public async Task<bool> DeleteAsync(string userId, int id)
    {
        var creditor = await _creditorRepo.GetByIdAsync(id);
        if (creditor == null || creditor.UserId != userId)
            return false;

        await _creditorRepo.DeleteAsync(creditor);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<CreditorDto?> GetByIdAsync(string userId, int id)
    {
        var creditor = await _creditorRepo.GetByIdAsync(id);
        if (creditor == null || creditor.UserId != userId)
            return null;

        return MapToDto(creditor);
    }

    public async Task<IEnumerable<CreditorDto>> GetAllAsync(string userId)
    {
        var creditors = await _creditorRepo.FindAsync(c => c.UserId == userId);
        return creditors.Select(MapToDto);
    }

    private static CreditorDto MapToDto(Creditor creditor)
    {
        return new CreditorDto
        {
            Id = creditor.Id,
            Name = creditor.Name,
            ContactInfo = creditor.ContactInfo,
            Description = creditor.Description,
            IsActive = creditor.IsActive,
            CreatedAt = creditor.CreatedAt
        };
    }
}

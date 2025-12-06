using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Enums;
using BudgetTracker.Core.Interfaces;

namespace BudgetTracker.Services.Services;

public class UserDataSeeder
{
    private readonly IRepository<Category> _categoryRepo;
    private readonly IRepository<PaymentMethod> _paymentMethodRepo;
    private readonly IRepository<Creditor> _creditorRepo;
    private readonly IUnitOfWork _unitOfWork;

    public UserDataSeeder(
        IRepository<Category> categoryRepo,
        IRepository<PaymentMethod> paymentMethodRepo,
        IRepository<Creditor> creditorRepo,
        IUnitOfWork unitOfWork)
    {
        _categoryRepo = categoryRepo;
        _paymentMethodRepo = paymentMethodRepo;
        _creditorRepo = creditorRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task SeedUserDataAsync(string userId)
    {
        // Seed Categories
        var hasCategories = (await _categoryRepo.FindAsync(c => c.UserId == userId)).Any();
        if (!hasCategories)
        {
            var categories = new List<Category>
            {
                new() { UserId = userId, Name = "Kira", Description = "Ev, ofis veya işyeri kirası", Color = "#FF6B6B", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Market", Description = "Gıda ve temizlik malzemeleri", Color = "#4ECDC4", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Elektrik", Description = "Elektrik faturası", Color = "#F7DC6F", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Su", Description = "Su faturası", Color = "#45B7D1", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Doğalgaz", Description = "Doğalgaz faturası", Color = "#FFA07A", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "İnternet", Description = "İnternet ve telefon faturası", Color = "#BB8FCE", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Ulaşım", Description = "Yakıt, toplu taşıma, otopark", Color = "#98D8C8", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Sağlık", Description = "İlaç, doktor, hastane masrafları", Color = "#F8B4D9", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Eğitim", Description = "Okul, kurs, kitap masrafları", Color = "#85C1E2", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Eğlence", Description = "Sinema, tiyatro, konser", Color = "#F39C12", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Giyim", Description = "Kıyafet ve ayakkabı", Color = "#E74C3C", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Abonelikler", Description = "Netflix, Spotify, YouTube Premium vb.", Color = "#9B59B6", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Restoran & Cafe", Description = "Dışarıda yemek", Color = "#E67E22", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Maaş", Description = "Aylık maaş geliri", Color = "#27AE60", IsActive = true, CreatedAt = DateTime.UtcNow }
            };

            foreach (var category in categories)
                await _categoryRepo.AddAsync(category);
        }

        // Seed Payment Methods
        var hasPaymentMethods = (await _paymentMethodRepo.FindAsync(p => p.UserId == userId)).Any();
        if (!hasPaymentMethods)
        {
            var paymentMethods = new List<PaymentMethod>
            {
                new() { UserId = userId, Name = "Nakit", Type = PaymentMethodType.Cash, Description = "Elden nakit ödeme", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Banka Kartı", Type = PaymentMethodType.Cash, Description = "Banka kartı ile anında ödeme", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Kredi Kartı", Type = PaymentMethodType.CreditCard, Description = "Kredi kartı ile ödeme", IsActive = true, CreatedAt = DateTime.UtcNow }
            };

            foreach (var paymentMethod in paymentMethods)
                await _paymentMethodRepo.AddAsync(paymentMethod);
        }

        // Seed Creditors
        var hasCreditors = (await _creditorRepo.FindAsync(c => c.UserId == userId)).Any();
        if (!hasCreditors)
        {
            var creditors = new List<Creditor>
            {
                new() { UserId = userId, Name = "Akbank", Description = "Banka", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Garanti BBVA", Description = "Banka", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "İş Bankası", Description = "Banka", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Yapı Kredi", Description = "Banka", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { UserId = userId, Name = "Ev Sahibi", Description = "Kira ödemeleri için", IsActive = true, CreatedAt = DateTime.UtcNow }
            };

            foreach (var creditor in creditors)
                await _creditorRepo.AddAsync(creditor);
        }

        await _unitOfWork.SaveChangesAsync();
    }
}

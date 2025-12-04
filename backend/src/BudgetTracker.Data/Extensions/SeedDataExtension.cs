using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Enums;
using BudgetTracker.Data.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BudgetTracker.Data.Extensions;

public static class SeedDataExtension
{
    public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // Ensure database is created
        await context.Database.MigrateAsync();

        // Seed demo user if not exists
        var demoUser = await userManager.FindByEmailAsync("demo@lonaflow.com");
        if (demoUser == null)
        {
            demoUser = new ApplicationUser
            {
                UserName = "demo@lonaflow.com",
                Email = "demo@lonaflow.com",
                FirstName = "Demo",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(demoUser, "Demo123!");
            if (!result.Succeeded)
            {
                return; // If demo user creation fails, don't seed data
            }
        }

        // Seed Creditors (Türkiye Bankaları ve Diğerleri)
        if (!await context.Creditors.AnyAsync())
        {
            var creditors = new List<Creditor>
            {
                // Bankalar
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Akbank",
                    Description = "Türkiye'nin önde gelen bankalarından",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Garanti BBVA",
                    Description = "Garanti Bankası",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "İş Bankası",
                    Description = "Türkiye İş Bankası A.Ş.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Yapı Kredi",
                    Description = "Yapı ve Kredi Bankası A.Ş.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Ziraat Bankası",
                    Description = "T.C. Ziraat Bankası A.Ş.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Halkbank",
                    Description = "Türkiye Halk Bankası A.Ş.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Vakıfbank",
                    Description = "Türkiye Vakıflar Bankası T.A.O.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "QNB Finansbank",
                    Description = "QNB Finansbank A.Ş.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Denizbank",
                    Description = "Denizbank A.Ş.",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "TEB",
                    Description = "Türk Ekonomi Bankası",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "ING",
                    Description = "ING Bank",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // Diğer Alacaklılar
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Ev Sahibi",
                    Description = "Kira ödemeleri için",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Elektrik Dağıtım Şirketi",
                    Description = "Elektrik faturaları",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Su ve Kanalizasyon İdaresi",
                    Description = "Su faturaları",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Creditor
                {
                    UserId = demoUser.Id,
                    Name = "Doğalgaz Dağıtım Şirketi",
                    Description = "Doğalgaz faturaları",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Creditors.AddRangeAsync(creditors);
            await context.SaveChangesAsync();
        }

        // Seed Payment Methods (Kredili Ürünler)
        if (!await context.PaymentMethods.AnyAsync())
        {
            var paymentMethods = new List<PaymentMethod>
            {
                // Kredi Kartları
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Akbank Kredi Kartı",
                    Type = PaymentMethodType.CreditCard,
                    Description = "Maximum, Axess veya diğer Akbank kredi kartları",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Garanti BBVA Kredi Kartı",
                    Type = PaymentMethodType.CreditCard,
                    Description = "Bonus, Wings veya diğer Garanti kredi kartları",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "İş Bankası Kredi Kartı",
                    Type = PaymentMethodType.CreditCard,
                    Description = "Maximum, Bonus veya diğer İş Bankası kredi kartları",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Yapı Kredi WorldCard",
                    Type = PaymentMethodType.CreditCard,
                    Description = "World, Advantage veya diğer Yapı Kredi kartları",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // Krediler
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Akbank İhtiyaç Kredisi",
                    Type = PaymentMethodType.Credit,
                    Description = "Tüketici kredisi",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Ziraat Bankası Konut Kredisi",
                    Type = PaymentMethodType.Credit,
                    Description = "Ev alımı için konut kredisi",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Garanti BBVA Taşıt Kredisi",
                    Type = PaymentMethodType.Credit,
                    Description = "Araç alımı için taşıt kredisi",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // Kredili Mevduat Hesabı (KMH)
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Akbank KMH",
                    Type = PaymentMethodType.OverdraftAccount,
                    Description = "Kredili mevduat hesabı",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "İş Bankası KMH",
                    Type = PaymentMethodType.OverdraftAccount,
                    Description = "Kredili mevduat hesabı",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // Nakit
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Nakit",
                    Type = PaymentMethodType.Cash,
                    Description = "Elden nakit ödeme",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PaymentMethod
                {
                    UserId = demoUser.Id,
                    Name = "Banka Kartı (Vadesiz)",
                    Type = PaymentMethodType.Cash,
                    Description = "Banka kartı ile anında ödeme",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.PaymentMethods.AddRangeAsync(paymentMethods);
            await context.SaveChangesAsync();
        }

        // Seed Categories
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Kira",
                    Description = "Ev, ofis veya işyeri kirası",
                    Color = "#FF6B6B",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Market",
                    Description = "Gıda ve temizlik malzemeleri",
                    Color = "#4ECDC4",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Elektrik",
                    Description = "Elektrik faturası",
                    Color = "#F7DC6F",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Su",
                    Description = "Su faturası",
                    Color = "#45B7D1",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Doğalgaz",
                    Description = "Doğalgaz faturası",
                    Color = "#FFA07A",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "İnternet",
                    Description = "İnternet ve telefon faturası",
                    Color = "#BB8FCE",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Ulaşım",
                    Description = "Yakıt, toplu taşıma, otopark",
                    Color = "#98D8C8",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Sağlık",
                    Description = "İlaç, doktor, hastane masrafları",
                    Color = "#F8B4D9",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Eğitim",
                    Description = "Okul, kurs, kitap masrafları",
                    Color = "#85C1E2",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Eğlence",
                    Description = "Sinema, tiyatro, konser",
                    Color = "#F39C12",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Giyim",
                    Description = "Kıyafet ve ayakkabı",
                    Color = "#E74C3C",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Abonelikler",
                    Description = "Netflix, Spotify, YouTube Premium vb.",
                    Color = "#9B59B6",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Restoran & Cafe",
                    Description = "Dışarıda yemek",
                    Color = "#E67E22",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Tamirat & Bakım",
                    Description = "Ev tamiri, araç bakımı vb.",
                    Color = "#34495E",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Sigorta",
                    Description = "Araç, ev, sağlık sigortası",
                    Color = "#16A085",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Maaş",
                    Description = "Aylık maaş geliri",
                    Color = "#27AE60",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Yatırım Geliri",
                    Description = "Hisse senedi, kripto, emlak geliri",
                    Color = "#2ECC71",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    UserId = demoUser.Id,
                    Name = "Serbest Çalışma",
                    Description = "Freelance, danışmanlık gelirleri",
                    Color = "#3498DB",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }
    }
}

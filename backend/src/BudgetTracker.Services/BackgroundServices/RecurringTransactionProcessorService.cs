using BudgetTracker.Core.Entities;
using BudgetTracker.Core.Enums;
using BudgetTracker.Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BudgetTracker.Services.BackgroundServices;

public class RecurringTransactionProcessorService : BackgroundService
{
    private readonly ILogger<RecurringTransactionProcessorService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public RecurringTransactionProcessorService(
        ILogger<RecurringTransactionProcessorService> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("RecurringTransactionProcessorService is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessRecurringTransactionsAsync();
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Her saat kontrol et
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing recurring transactions.");
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }

        _logger.LogInformation("RecurringTransactionProcessorService is stopping.");
    }

    private async Task ProcessRecurringTransactionsAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var now = DateTime.UtcNow.Date;

        var dueRecurringTransactions = await context.RecurringTransactions
            .Include(r => r.Category)
            .Include(r => r.PaymentMethod)
            .Include(r => r.Creditor)
            .Where(r => r.IsActive &&
                        (r.NextDueDate == null || r.NextDueDate <= now) &&
                        (r.EndDate == null || r.EndDate >= now))
            .ToListAsync();

        foreach (var recurring in dueRecurringTransactions)
        {
            try
            {
                // Calculate next due date if not set
                if (recurring.NextDueDate == null)
                {
                    recurring.NextDueDate = recurring.StartDate;
                }

                // Create instance
                var instance = new RecurringTransactionInstance
                {
                    RecurringTransactionId = recurring.Id,
                    DueDate = recurring.NextDueDate.Value,
                    CreatedAt = DateTime.UtcNow
                };

                context.RecurringTransactionInstances.Add(instance);

                // Create transaction
                var transaction = new Transaction
                {
                    UserId = recurring.UserId,
                    Type = recurring.Type,
                    Amount = recurring.Amount,
                    TransactionDate = recurring.NextDueDate.Value,
                    Description = recurring.Description,
                    Notes = $"Otomatik oluşturuldu: {recurring.Notes}",
                    CategoryId = recurring.CategoryId,
                    PaymentMethodId = recurring.PaymentMethodId,
                    CreditorId = recurring.CreditorId,
                    CreatedAt = DateTime.UtcNow
                };

                context.Transactions.Add(transaction);
                await context.SaveChangesAsync();

                // Link transaction to instance
                instance.Transaction = transaction;
                instance.RecurringTransactionInstanceId = transaction.Id;
                instance.IsProcessed = true;
                instance.ProcessedAt = DateTime.UtcNow;

                // Update recurring transaction
                recurring.LastProcessedDate = recurring.NextDueDate;
                recurring.NextDueDate = CalculateNextDueDate(recurring);
                recurring.UpdatedAt = DateTime.UtcNow;

                await context.SaveChangesAsync();

                _logger.LogInformation($"Processed recurring transaction {recurring.Id} for user {recurring.UserId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing recurring transaction {recurring.Id}");
            }
        }
    }

    private DateTime? CalculateNextDueDate(RecurringTransaction recurring)
    {
        if (recurring.NextDueDate == null) return null;

        var nextDate = recurring.Frequency switch
        {
            RecurrenceFrequency.Daily => recurring.NextDueDate.Value.AddDays(1),
            RecurrenceFrequency.Weekly => recurring.NextDueDate.Value.AddDays(7),
            RecurrenceFrequency.Monthly => recurring.NextDueDate.Value.AddMonths(1),
            _ => recurring.NextDueDate.Value.AddMonths(1)
        };

        // Check if beyond end date
        if (recurring.EndDate != null && nextDate > recurring.EndDate)
        {
            return null;
        }

        return nextDate;
    }
}

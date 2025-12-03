using BudgetTracker.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BudgetTracker.Data.Context;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Creditor> Creditors => Set<Creditor>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<RecurringTransaction> RecurringTransactions => Set<RecurringTransaction>();
    public DbSet<RecurringTransactionInstance> RecurringTransactionInstances => Set<RecurringTransactionInstance>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Transaction Configuration
        builder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Description).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Notes).HasMaxLength(1000);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.PaymentMethod)
                .WithMany(p => p.Transactions)
                .HasForeignKey(e => e.PaymentMethodId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.Creditor)
                .WithMany(c => c.Transactions)
                .HasForeignKey(e => e.CreditorId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasIndex(e => e.TransactionDate);
            entity.HasIndex(e => e.UserId);
        });

        // RecurringTransaction Configuration
        builder.Entity<RecurringTransaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Description).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Notes).HasMaxLength(1000);

            entity.HasOne(e => e.User)
                .WithMany(u => u.RecurringTransactions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.RecurringTransactions)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.PaymentMethod)
                .WithMany(p => p.RecurringTransactions)
                .HasForeignKey(e => e.PaymentMethodId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.Creditor)
                .WithMany(c => c.RecurringTransactions)
                .HasForeignKey(e => e.CreditorId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasIndex(e => e.NextDueDate);
            entity.HasIndex(e => e.IsActive);
        });

        // RecurringTransactionInstance Configuration
        builder.Entity<RecurringTransactionInstance>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.RecurringTransaction)
                .WithMany(r => r.Instances)
                .HasForeignKey(e => e.RecurringTransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Transaction)
                .WithOne(t => t.RecurringTransactionInstance)
                .HasForeignKey<Transaction>(t => t.RecurringTransactionInstanceId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasIndex(e => e.DueDate);
            entity.HasIndex(e => e.IsProcessed);
        });

        // PaymentMethod Configuration
        builder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);

            entity.HasOne(e => e.User)
                .WithMany(u => u.PaymentMethods)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.UserId);
        });

        // Category Configuration
        builder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Color).HasMaxLength(7);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Categories)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.UserId);
        });

        // Creditor Configuration
        builder.Entity<Creditor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ContactInfo).HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(500);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Creditors)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.UserId);
        });

        // ApplicationUser Configuration
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
        });
    }
}

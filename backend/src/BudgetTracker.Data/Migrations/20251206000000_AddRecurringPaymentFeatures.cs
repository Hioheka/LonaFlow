using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetTracker.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRecurringPaymentFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DayOfMonth",
                table: "RecurringTransactions",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayOfMonth",
                table: "RecurringTransactions");
        }
    }
}

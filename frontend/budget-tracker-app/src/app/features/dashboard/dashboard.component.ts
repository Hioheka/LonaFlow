import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { RecurringTransactionService } from '../../core/services/recurring-transaction.service';
import { DashboardSummary } from '../../shared/models/dashboard.model';
import { UpcomingPayment, RecurringTransaction } from '../../shared/models/transaction.model';
import { AddPaymentMethodComponent } from '../products/payment-methods/add-payment-method.component';
import { AddCategoryComponent } from '../products/categories/add-category.component';
import { AddCreditorComponent } from '../products/creditors/add-creditor.component';
import { AddIncomeComponent } from '../transactions/add-income/add-income.component';
import { AddExpenseComponent } from '../transactions/add-expense/add-expense.component';
import { IncomeListDialogComponent } from '../transactions/income-list/income-list-dialog.component';
import { ExpenseListDialogComponent } from '../transactions/expense-list/expense-list-dialog.component';
import { RecurringListDialogComponent } from '../transactions/recurring-list/recurring-list-dialog.component';
import { EditRecurringTransactionComponent } from '../transactions/edit-recurring/edit-recurring-transaction.component';
import { ConfirmDeleteDialogComponent } from '../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  upcomingPayments: UpcomingPayment[] = [];
  error: string | null = null;
  isLoading = false;
  isLoadingPayments = false;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private recurringService: RecurringTransactionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadUpcomingPayments();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.error = null;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.dashboardService.getMonthlyDashboard(year, month).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard yüklenirken hata:', err);
        this.error = 'Dashboard verileri yüklenirken bir hata oluştu. Lütfen backend API\'nin çalıştığından emin olun.';
        this.isLoading = false;
      }
    });
  }

  loadUpcomingPayments(): void {
    this.isLoadingPayments = true;

    // 30 gün için upcoming payments
    this.recurringService.getUpcomingPayments(undefined, 30).subscribe({
      next: (payments) => {
        this.upcomingPayments = payments;
        this.isLoadingPayments = false;
      },
      error: (err) => {
        console.error('Yaklaşan ödemeler yüklenirken hata:', err);
        this.upcomingPayments = [];
        this.isLoadingPayments = false;
      }
    });
  }

  openPaymentMethodDialog(): void {
    const dialogRef = this.dialog.open(AddPaymentMethodComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openCreditorDialog(): void {
    const dialogRef = this.dialog.open(AddCreditorComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openIncomeDialog(): void {
    const dialogRef = this.dialog.open(AddIncomeComponent, {
      width: '700px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openExpenseDialog(): void {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '700px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
        this.loadUpcomingPayments();
      }
    });
  }

  openIncomeListDialog(): void {
    const dialogRef = this.dialog.open(IncomeListDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openExpenseListDialog(): void {
    const dialogRef = this.dialog.open(ExpenseListDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openRecurringListDialog(): void {
    const dialogRef = this.dialog.open(RecurringListDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUpcomingPayments();
      }
    });
  }

  editRecurringPayment(payment: UpcomingPayment): void {
    // Önce recurring transaction'ı bul
    this.recurringService.getById(payment.recurringTransactionId).subscribe({
      next: (transaction: RecurringTransaction) => {
        const dialogRef = this.dialog.open(EditRecurringTransactionComponent, {
          width: '700px',
          data: { transaction }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadUpcomingPayments();
            this.loadDashboard();
            this.snackBar.open('Tekrarlayan işlem güncellendi', 'Kapat', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        console.error('İşlem detayları yüklenemedi:', error);
        this.snackBar.open('İşlem detayları yüklenemedi', 'Kapat', { duration: 3000 });
      }
    });
  }

  deleteRecurringPayment(payment: UpcomingPayment): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Tekrarlayan İşlemi Sil',
        message: `"${payment.description}" isimli tekrarlayan işlemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve gelecekteki tüm ödemeler iptal edilecek.`,
        itemName: payment.description
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.recurringService.delete(payment.recurringTransactionId).subscribe({
          next: () => {
            this.snackBar.open('Tekrarlayan işlem silindi', 'Kapat', { duration: 3000 });
            this.loadUpcomingPayments();
            this.loadDashboard();
          },
          error: (error) => {
            console.error('Silme hatası:', error);
            this.snackBar.open('Tekrarlayan işlem silinemedi', 'Kapat', { duration: 3000 });
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

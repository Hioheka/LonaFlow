import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction, TransactionType } from '../../../shared/models/transaction.model';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-expense-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './expense-list-dialog.component.html',
  styleUrls: ['./expense-list-dialog.component.scss']
})
export class ExpenseListDialogComponent implements OnInit {
  expenses: Transaction[] = [];
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];
  isLoading = false;

  constructor(
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<ExpenseListDialogComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.expenses = transactions
          .filter(t => t.type === TransactionType.Expense)
          .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Giderler yüklenirken hata:', error);
        this.snackBar.open('Giderler yüklenirken bir hata oluştu', 'Kapat', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deleteExpense(expense: Transaction): void {
    const confirmDialog = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Gideri Sil',
        message: 'Bu gideri silmek istediğinizden emin misiniz?',
        itemName: expense.description
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.deleteTransaction(expense.id).subscribe({
          next: () => {
            this.snackBar.open('Gider başarıyla silindi!', 'Kapat', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.loadExpenses();
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Gider silinirken hata:', error);
            this.snackBar.open('Gider silinirken bir hata oluştu', 'Kapat', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getTotalExpense(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}

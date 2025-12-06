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
  selector: 'app-income-list-dialog',
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
  templateUrl: './income-list-dialog.component.html',
  styleUrls: ['./income-list-dialog.component.scss']
})
export class IncomeListDialogComponent implements OnInit {
  incomes: Transaction[] = [];
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];
  isLoading = false;

  constructor(
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<IncomeListDialogComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadIncomes();
  }

  loadIncomes(): void {
    this.isLoading = true;
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.incomes = transactions
          .filter(t => t.type === TransactionType.Income)
          .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Gelirler yüklenirken hata:', error);
        this.snackBar.open('Gelirler yüklenirken bir hata oluştu', 'Kapat', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  deleteIncome(income: Transaction): void {
    const confirmDialog = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Geliri Sil',
        message: 'Bu geliri silmek istediğinizden emin misiniz?',
        itemName: income.description
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.deleteTransaction(income.id).subscribe({
          next: () => {
            this.snackBar.open('Gelir başarıyla silindi!', 'Kapat', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.loadIncomes();
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Gelir silinirken hata:', error);
            this.snackBar.open('Gelir silinirken bir hata oluştu', 'Kapat', {
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
}

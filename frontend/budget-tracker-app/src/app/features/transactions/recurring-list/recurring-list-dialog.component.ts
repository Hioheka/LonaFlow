import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { RecurringTransactionService } from '../../../core/services/recurring-transaction.service';
import { RecurringTransaction, RecurrenceFrequency } from '../../../shared/models/transaction.model';
import { EditRecurringTransactionComponent } from '../edit-recurring/edit-recurring-transaction.component';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-recurring-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './recurring-list-dialog.component.html',
  styleUrls: ['./recurring-list-dialog.component.scss']
})
export class RecurringListDialogComponent implements OnInit {
  transactions: RecurringTransaction[] = [];
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<RecurringListDialogComponent>,
    private recurringService: RecurringTransactionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.recurringService.getActive().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Tekrarlayan işlemler yüklenemedi:', error);
        this.snackBar.open('Tekrarlayan işlemler yüklenemedi', 'Kapat', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  editTransaction(transaction: RecurringTransaction): void {
    const dialogRef = this.dialog.open(EditRecurringTransactionComponent, {
      width: '700px',
      data: { transaction }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
        this.snackBar.open('Tekrarlayan işlem güncellendi', 'Kapat', { duration: 3000 });
      }
    });
  }

  deleteTransaction(transaction: RecurringTransaction): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Tekrarlayan İşlemi Sil',
        message: `"${transaction.description}" isimli tekrarlayan işlemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
        itemName: transaction.description
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.recurringService.delete(transaction.id).subscribe({
          next: () => {
            this.snackBar.open('Tekrarlayan işlem silindi', 'Kapat', { duration: 3000 });
            this.loadTransactions();
          },
          error: (error) => {
            console.error('Silme hatası:', error);
            this.snackBar.open('Tekrarlayan işlem silinemedi', 'Kapat', { duration: 3000 });
          }
        });
      }
    });
  }

  getFrequencyLabel(frequency: RecurrenceFrequency): string {
    switch (frequency) {
      case RecurrenceFrequency.Daily: return 'Günlük';
      case RecurrenceFrequency.Weekly: return 'Haftalık';
      case RecurrenceFrequency.Monthly: return 'Aylık';
      case RecurrenceFrequency.Yearly: return 'Yıllık';
      default: return 'Bilinmiyor';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { RecurringTransactionService } from '../../../core/services/recurring-transaction.service';
import { RecurringTransaction, Category, PaymentMethod, Creditor, RecurrenceFrequency } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-edit-recurring-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-recurring-transaction.component.html',
  styleUrls: ['./edit-recurring-transaction.component.scss']
})
export class EditRecurringTransactionComponent implements OnInit {
  editForm: FormGroup;
  categories: Category[] = [];
  paymentMethods: PaymentMethod[] = [];
  creditors: Creditor[] = [];
  isLoading = false;
  frequencies = [
    { value: RecurrenceFrequency.Daily, label: 'Günlük' },
    { value: RecurrenceFrequency.Weekly, label: 'Haftalık' },
    { value: RecurrenceFrequency.Monthly, label: 'Aylık' },
    { value: RecurrenceFrequency.Yearly, label: 'Yıllık' }
  ];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private recurringService: RecurringTransactionService,
    private dialogRef: MatDialogRef<EditRecurringTransactionComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { transaction: RecurringTransaction }
  ) {
    const transaction = this.data.transaction;
    this.editForm = this.fb.group({
      amount: [transaction.amount, [Validators.required, Validators.min(0.01)]],
      description: [transaction.description],
      notes: [transaction.notes || ''],
      categoryId: [transaction.categoryId || ''],
      paymentMethodId: [transaction.paymentMethodId || ''],
      creditorId: [transaction.creditorId || ''],
      frequency: [transaction.frequency, Validators.required],
      dayOfMonth: [transaction.dayOfMonth || ''],
      startDate: [new Date(transaction.startDate), Validators.required],
      endDate: [transaction.endDate ? new Date(transaction.endDate) : '']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadPaymentMethods();
    this.loadCreditors();
  }

  loadCategories(): void {
    this.transactionService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.filter(c => c.isActive);
      },
      error: (error) => {
        console.error('Kategoriler yüklenemedi:', error);
      }
    });
  }

  loadPaymentMethods(): void {
    this.transactionService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods.filter(m => m.isActive);
      },
      error: (error) => {
        console.error('Ödeme yöntemleri yüklenemedi:', error);
      }
    });
  }

  loadCreditors(): void {
    this.transactionService.getCreditors().subscribe({
      next: (creditors) => {
        this.creditors = creditors.filter(c => c.isActive);
      },
      error: (error) => {
        console.error('Alacaklılar yüklenemedi:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const formValue = this.editForm.value;

    const updateRequest = {
      type: this.data.transaction.type,
      amount: Number(formValue.amount),
      description: formValue.description,
      notes: formValue.notes || undefined,
      frequency: Number(formValue.frequency),
      dayOfMonth: formValue.dayOfMonth ? Number(formValue.dayOfMonth) : undefined,
      startDate: formValue.startDate,
      endDate: formValue.endDate || undefined,
      categoryId: formValue.categoryId ? Number(formValue.categoryId) : undefined,
      paymentMethodId: formValue.paymentMethodId ? Number(formValue.paymentMethodId) : undefined,
      creditorId: formValue.creditorId ? Number(formValue.creditorId) : undefined
    };

    this.recurringService.update(this.data.transaction.id, updateRequest).subscribe({
      next: () => {
        this.snackBar.open('Tekrarlayan işlem güncellendi!', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(
          error.error?.message || 'Güncelleme sırasında bir hata oluştu.',
          'Kapat',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          }
        );
        console.error('Güncelleme hatası:', error);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.editForm.get(field);
    if (control?.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (control?.hasError('min')) {
      return 'Geçerli bir tutar giriniz';
    }
    return '';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TransactionService } from '../../../core/services/transaction.service';
import { RecurringTransactionService } from '../../../core/services/recurring-transaction.service';
import { TransactionType, Category, PaymentMethod, Creditor, RecurrenceFrequency } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-expense',
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
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  categories: Category[] = [];
  paymentMethods: PaymentMethod[] = [];
  creditors: Creditor[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private recurringService: RecurringTransactionService,
    private dialogRef: MatDialogRef<AddExpenseComponent>,
    private snackBar: MatSnackBar
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionDate: [new Date(), Validators.required],
      description: [''],
      notes: [''],
      categoryId: [''],
      paymentMethodId: [''],
      creditorId: [''],
      isRecurring: [false],
      frequency: [RecurrenceFrequency.Monthly],
      dayOfMonth: [''],
      endDate: ['']
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
        this.snackBar.open('Kategoriler yüklenemedi', 'Kapat', { duration: 3000 });
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
        this.snackBar.open('Ödeme yöntemleri yüklenemedi', 'Kapat', { duration: 3000 });
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
        this.snackBar.open('Alacaklılar yüklenemedi', 'Kapat', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;

    const formValue = this.expenseForm.value;

    // Tekrarlayan ödeme ise
    if (formValue.isRecurring) {
      const recurringRequest = {
        type: TransactionType.Expense,
        amount: Number(formValue.amount),
        description: formValue.description,
        notes: formValue.notes || undefined,
        frequency: Number(formValue.frequency),
        dayOfMonth: formValue.dayOfMonth ? Number(formValue.dayOfMonth) : undefined,
        startDate: formValue.transactionDate,
        endDate: formValue.endDate || undefined,
        categoryId: formValue.categoryId ? Number(formValue.categoryId) : undefined,
        paymentMethodId: formValue.paymentMethodId ? Number(formValue.paymentMethodId) : undefined,
        creditorId: formValue.creditorId ? Number(formValue.creditorId) : undefined
      };

      this.recurringService.create(recurringRequest).subscribe({
        next: () => {
          this.snackBar.open('Tekrarlayan gider başarıyla eklendi!', 'Kapat', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Tekrarlayan gider eklenirken bir hata oluştu.',
            'Kapat',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            }
          );
          console.error('Tekrarlayan gider ekleme hatası:', error);
        }
      });
    } else {
      // Normal tek seferlik gider
      const request = {
        type: TransactionType.Expense,
        amount: Number(formValue.amount),
        transactionDate: formValue.transactionDate,
        description: formValue.description,
        notes: formValue.notes || undefined,
        categoryId: formValue.categoryId ? Number(formValue.categoryId) : undefined,
        paymentMethodId: formValue.paymentMethodId ? Number(formValue.paymentMethodId) : undefined,
        creditorId: formValue.creditorId ? Number(formValue.creditorId) : undefined
      };

      this.transactionService.createTransaction(request).subscribe({
        next: () => {
          this.snackBar.open('Gider başarıyla eklendi!', 'Kapat', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Gider eklenirken bir hata oluştu.',
            'Kapat',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            }
          );
          console.error('Gider ekleme hatası:', error);
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.expenseForm.get(field);
    if (control?.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (control?.hasError('min')) {
      return 'Geçerli bir tutar giriniz';
    }
    return '';
  }
}

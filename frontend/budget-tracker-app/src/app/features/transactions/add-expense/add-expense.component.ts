import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { TransactionType, Category, PaymentMethod, Creditor } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionDate: [new Date(), Validators.required],
      description: ['', Validators.required],
      notes: [''],
      categoryId: [''],
      paymentMethodId: [''],
      creditorId: ['']
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
        this.router.navigate(['/dashboard']);
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

  cancel(): void {
    this.router.navigate(['/dashboard']);
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

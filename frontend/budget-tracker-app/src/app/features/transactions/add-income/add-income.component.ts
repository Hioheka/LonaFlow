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
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionType, Category, PaymentMethod } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-income',
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
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {
  incomeForm: FormGroup;
  categories: Category[] = [];
  paymentMethods: PaymentMethod[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<AddIncomeComponent>,
    private snackBar: MatSnackBar
  ) {
    this.incomeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionDate: [new Date(), Validators.required],
      description: ['', Validators.required],
      notes: [''],
      categoryId: [''],
      paymentMethodId: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadPaymentMethods();
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

  onSubmit(): void {
    if (this.incomeForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;

    const formValue = this.incomeForm.value;
    const request = {
      type: TransactionType.Income,
      amount: Number(formValue.amount),
      transactionDate: formValue.transactionDate,
      description: formValue.description,
      notes: formValue.notes || undefined,
      categoryId: formValue.categoryId ? Number(formValue.categoryId) : undefined,
      paymentMethodId: formValue.paymentMethodId ? Number(formValue.paymentMethodId) : undefined
    };

    this.transactionService.createTransaction(request).subscribe({
      next: () => {
        this.snackBar.open('Gelir başarıyla eklendi!', 'Kapat', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(
          error.error?.message || 'Gelir eklenirken bir hata oluştu.',
          'Kapat',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          }
        );
        console.error('Gelir ekleme hatası:', error);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.incomeForm.get(field);
    if (control?.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (control?.hasError('min')) {
      return 'Geçerli bir tutar giriniz';
    }
    return '';
  }
}

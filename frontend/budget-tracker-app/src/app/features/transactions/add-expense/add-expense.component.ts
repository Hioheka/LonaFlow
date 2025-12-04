import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionType, Category, PaymentMethod, Creditor } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  categories: Category[] = [];
  paymentMethods: PaymentMethod[] = [];
  creditors: Creditor[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionDate: [new Date().toISOString().split('T')[0], Validators.required],
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
    if (this.expenseForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.expenseForm.value;
    const request = {
      type: TransactionType.Expense,
      amount: Number(formValue.amount),
      transactionDate: new Date(formValue.transactionDate),
      description: formValue.description,
      notes: formValue.notes || undefined,
      categoryId: formValue.categoryId ? Number(formValue.categoryId) : undefined,
      paymentMethodId: formValue.paymentMethodId ? Number(formValue.paymentMethodId) : undefined,
      creditorId: formValue.creditorId ? Number(formValue.creditorId) : undefined
    };

    this.transactionService.createTransaction(request).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Gider eklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        console.error('Gider ekleme hatası:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

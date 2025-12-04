import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionType, Category, PaymentMethod } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {
  incomeForm: FormGroup;
  categories: Category[] = [];
  paymentMethods: PaymentMethod[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.incomeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionDate: [new Date().toISOString().split('T')[0], Validators.required],
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

  onSubmit(): void {
    if (this.incomeForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.incomeForm.value;
    const request = {
      type: TransactionType.Income,
      amount: Number(formValue.amount),
      transactionDate: new Date(formValue.transactionDate),
      description: formValue.description,
      notes: formValue.notes || undefined,
      categoryId: formValue.categoryId ? Number(formValue.categoryId) : undefined,
      paymentMethodId: formValue.paymentMethodId ? Number(formValue.paymentMethodId) : undefined
    };

    this.transactionService.createTransaction(request).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Gelir eklenirken bir hata oluştu. Lütfen tekrar deneyin.';
        console.error('Gelir ekleme hatası:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

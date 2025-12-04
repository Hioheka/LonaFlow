import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentMethodService } from '../../../core/services/payment-method.service';
import { PaymentMethodType } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-payment-method',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent {
  paymentMethodForm: FormGroup;
  paymentMethodTypes = [
    { value: PaymentMethodType.Credit, label: 'Kredi' },
    { value: PaymentMethodType.CreditCard, label: 'Kredi Kartı' },
    { value: PaymentMethodType.Cash, label: 'Elden Ödeme' },
    { value: PaymentMethodType.OverdraftAccount, label: 'Kredili Mevduat Hesabı (KMH)' }
  ];
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private router: Router
  ) {
    this.paymentMethodForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: [PaymentMethodType.Credit, [Validators.required]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.paymentMethodForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.paymentMethodService.createPaymentMethod(this.paymentMethodForm.value).subscribe({
        next: () => {
          this.successMessage = 'Ödeme yöntemi başarıyla eklendi!';
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Ödeme yöntemi eklenirken bir hata oluştu.';
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

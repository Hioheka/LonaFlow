import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentMethodService } from '../../../core/services/payment-method.service';
import { PaymentMethodType } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-payment-method',
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
    MatSnackBarModule
  ],
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
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private router: Router,
    private snackBar: MatSnackBar
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

      this.paymentMethodService.createPaymentMethod(this.paymentMethodForm.value).subscribe({
        next: () => {
          this.snackBar.open('Ödeme yöntemi başarıyla eklendi!', 'Kapat', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Ödeme yöntemi eklenirken bir hata oluştu.',
            'Kapat',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            }
          );
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  getErrorMessage(field: string): string {
    const control = this.paymentMethodForm.get(field);
    if (control?.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (control?.hasError('minlength')) {
      return 'En az 2 karakter olmalıdır';
    }
    return '';
  }
}

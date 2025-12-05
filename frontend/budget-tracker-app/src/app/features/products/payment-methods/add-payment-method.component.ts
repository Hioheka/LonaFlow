import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentMethodService } from '../../../core/services/payment-method.service';
import { PaymentMethodType } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-add-payment-method',
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
    MatSnackBarModule
  ],
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent {
  paymentMethodForm: FormGroup;
  paymentMethodTypes = [
    { value: PaymentMethodType.Credit, label: 'Kredi', icon: 'account_balance' },
    { value: PaymentMethodType.CreditCard, label: 'Kredi Kartı', icon: 'credit_card' },
    { value: PaymentMethodType.Cash, label: 'Elden Ödeme', icon: 'payments' },
    { value: PaymentMethodType.OverdraftAccount, label: 'Kredili Mevduat Hesabı (KMH)', icon: 'account_balance_wallet' }
  ];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private dialogRef: MatDialogRef<AddPaymentMethodComponent>,
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
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(
            error.error?.message || 'Ödeme yöntemi eklenirken bir hata oluştu.',
            'Kapat',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTypeIcon(typeValue: number): string {
    return this.paymentMethodTypes.find(t => t.value === typeValue)?.icon || 'credit_card';
  }
}

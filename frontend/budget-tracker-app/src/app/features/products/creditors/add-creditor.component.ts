import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CreditorService } from '../../../core/services/creditor.service';

@Component({
  selector: 'app-add-creditor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './add-creditor.component.html',
  styleUrls: ['./add-creditor.component.scss']
})
export class AddCreditorComponent {
  creditorForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private creditorService: CreditorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.creditorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactInfo: [''],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.creditorForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.creditorService.createCreditor(this.creditorForm.value).subscribe({
        next: () => {
          this.snackBar.open('Alacaklı/Banka başarıyla eklendi!', 'Kapat', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(
            error.error?.message || 'Alacaklı/Banka eklenirken bir hata oluştu.',
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
    this.router.navigate(['/dashboard']);
  }
}

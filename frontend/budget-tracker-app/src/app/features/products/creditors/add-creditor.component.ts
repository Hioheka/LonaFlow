import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditorService } from '../../../core/services/creditor.service';

@Component({
  selector: 'app-add-creditor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-creditor.component.html',
  styleUrls: ['./add-creditor.component.scss']
})
export class AddCreditorComponent {
  creditorForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private creditorService: CreditorService,
    private router: Router
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
      this.errorMessage = '';
      this.successMessage = '';

      this.creditorService.createCreditor(this.creditorForm.value).subscribe({
        next: () => {
          this.successMessage = 'Alacaklı/Banka başarıyla eklendi!';
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Alacaklı/Banka eklenirken bir hata oluştu.';
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

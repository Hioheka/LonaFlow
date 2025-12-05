import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  categoryForm: FormGroup;
  colorOptions = [
    { value: '#FF6B6B', label: 'Kırmızı' },
    { value: '#4ECDC4', label: 'Turkuaz' },
    { value: '#45B7D1', label: 'Mavi' },
    { value: '#FFA07A', label: 'Turuncu' },
    { value: '#98D8C8', label: 'Yeşil' },
    { value: '#F7DC6F', label: 'Sarı' },
    { value: '#BB8FCE', label: 'Mor' },
    { value: '#F8B4D9', label: 'Pembe' },
    { value: '#85C1E2', label: 'Açık Mavi' },
    { value: '#F39C12', label: 'Altın' }
  ];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      color: ['#4ECDC4']
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.snackBar.open('Kategori başarıyla eklendi!', 'Kapat', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Kategori eklenirken bir hata oluştu.',
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

  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  getErrorMessage(field: string): string {
    const control = this.categoryForm.get(field);
    if (control?.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (control?.hasError('minlength')) {
      return 'En az 2 karakter olmalıdır';
    }
    return '';
  }
}

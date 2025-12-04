import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
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
      this.errorMessage = '';
      this.successMessage = '';

      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.successMessage = 'Kategori başarıyla eklendi!';
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Kategori eklenirken bir hata oluştu.';
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

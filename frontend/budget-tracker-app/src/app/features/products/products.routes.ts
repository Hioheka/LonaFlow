import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'payment-methods/add',
    loadComponent: () => import('./payment-methods/add-payment-method.component').then(m => m.AddPaymentMethodComponent)
  },
  {
    path: 'categories/add',
    loadComponent: () => import('./categories/add-category.component').then(m => m.AddCategoryComponent)
  },
  {
    path: 'creditors/add',
    loadComponent: () => import('./creditors/add-creditor.component').then(m => m.AddCreditorComponent)
  }
];

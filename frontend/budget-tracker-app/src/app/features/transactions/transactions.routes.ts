import { Routes } from '@angular/router';
import { AddIncomeComponent } from './add-income/add-income.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';

export const TRANSACTIONS_ROUTES: Routes = [
  { path: 'add-income', component: AddIncomeComponent },
  { path: 'add-expense', component: AddExpenseComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../shared/models/dashboard.model';
import { AddPaymentMethodComponent } from '../products/payment-methods/add-payment-method.component';
import { AddCategoryComponent } from '../products/categories/add-category.component';
import { AddCreditorComponent } from '../products/creditors/add-creditor.component';
import { AddIncomeComponent } from '../transactions/add-income/add-income.component';
import { AddExpenseComponent } from '../transactions/add-expense/add-expense.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  error: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.error = null;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.dashboardService.getMonthlyDashboard(year, month).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard yüklenirken hata:', err);
        this.error = 'Dashboard verileri yüklenirken bir hata oluştu. Lütfen backend API\'nin çalıştığından emin olun.';
        this.isLoading = false;
      }
    });
  }

  openPaymentMethodDialog(): void {
    const dialogRef = this.dialog.open(AddPaymentMethodComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openCreditorDialog(): void {
    const dialogRef = this.dialog.open(AddCreditorComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openIncomeDialog(): void {
    const dialogRef = this.dialog.open(AddIncomeComponent, {
      width: '700px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  openExpenseDialog(): void {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '700px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboard();
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

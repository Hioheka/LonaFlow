import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>LonaFlow - Bütçe Takip Uygulaması</span>
      <span class="spacer"></span>
      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon>
        Çıkış
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <p>Hoş geldiniz! Bu sayfa geliştirilme aşamasındadır.</p>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Genel Bakış</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Burada grafik ve KPI kartları gösterilecek.</p>
          <p>Lütfen backend API'yi çalıştırdığınızdan emin olun.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    mat-card {
      margin-top: 20px;
    }
  `]
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

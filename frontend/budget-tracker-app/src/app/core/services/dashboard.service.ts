import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary } from '../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getDashboardSummary(startDate: Date, endDate: Date): Observable<DashboardSummary> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<DashboardSummary>(`${this.API_URL}/dashboard/summary`, { params });
  }

  getMonthlyDashboard(year: number, month: number): Observable<DashboardSummary> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.http.get<DashboardSummary>(`${this.API_URL}/dashboard/monthly`, { params });
  }
}

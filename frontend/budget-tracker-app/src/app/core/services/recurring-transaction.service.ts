import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateRecurringTransactionRequest, RecurringTransaction, UpcomingPayment } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class RecurringTransactionService {
  private apiUrl = `${environment.apiUrl}/recurringtransactions`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<RecurringTransaction[]> {
    return this.http.get<RecurringTransaction[]>(this.apiUrl);
  }

  getActive(): Observable<RecurringTransaction[]> {
    return this.http.get<RecurringTransaction[]>(`${this.apiUrl}/active`);
  }

  getUpcomingPayments(months: number = 6): Observable<UpcomingPayment[]> {
    return this.http.get<UpcomingPayment[]>(`${this.apiUrl}/upcoming?months=${months}`);
  }

  getById(id: number): Observable<RecurringTransaction> {
    return this.http.get<RecurringTransaction>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateRecurringTransactionRequest): Observable<RecurringTransaction> {
    return this.http.post<RecurringTransaction>(this.apiUrl, request);
  }

  update(id: number, request: CreateRecurringTransactionRequest): Observable<RecurringTransaction> {
    return this.http.put<RecurringTransaction>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

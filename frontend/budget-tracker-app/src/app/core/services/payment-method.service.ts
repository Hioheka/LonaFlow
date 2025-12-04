import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod, PaymentMethodType } from '../../shared/models/transaction.model';
import { environment } from '../../../environments/environment';

export interface CreatePaymentMethodRequest {
  name: string;
  type: PaymentMethodType;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private apiUrl = `${environment.apiUrl}/paymentmethods`;

  constructor(private http: HttpClient) { }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.apiUrl);
  }

  getPaymentMethod(id: number): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.apiUrl}/${id}`);
  }

  createPaymentMethod(request: CreatePaymentMethodRequest): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(this.apiUrl, request);
  }

  updatePaymentMethod(id: number, request: CreatePaymentMethodRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  deletePaymentMethod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

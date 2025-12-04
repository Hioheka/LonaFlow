import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTransactionRequest, Transaction, Category, PaymentMethod, Creditor } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  createTransaction(request: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.API_URL}/transactions`, request);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.API_URL}/transactions`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.API_URL}/paymentmethods`);
  }

  getCreditors(): Observable<Creditor[]> {
    return this.http.get<Creditor[]>(`${this.API_URL}/creditors`);
  }
}

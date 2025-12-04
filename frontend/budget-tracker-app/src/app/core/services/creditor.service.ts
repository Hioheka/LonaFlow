import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Creditor } from '../../shared/models/transaction.model';
import { environment } from '../../../environments/environment';

export interface CreateCreditorRequest {
  name: string;
  contactInfo?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreditorService {
  private apiUrl = `${environment.apiUrl}/creditors`;

  constructor(private http: HttpClient) { }

  getCreditors(): Observable<Creditor[]> {
    return this.http.get<Creditor[]>(this.apiUrl);
  }

  getCreditor(id: number): Observable<Creditor> {
    return this.http.get<Creditor>(`${this.apiUrl}/${id}`);
  }

  createCreditor(request: CreateCreditorRequest): Observable<Creditor> {
    return this.http.post<Creditor>(this.apiUrl, request);
  }

  updateCreditor(id: number, request: CreateCreditorRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  deleteCreditor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

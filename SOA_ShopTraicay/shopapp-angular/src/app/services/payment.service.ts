import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments'; // Payment Service port 3000

  constructor(private http: HttpClient) { }

  // Lấy tất cả thanh toán với filters
  getAllPayments(filters?: {
    status?: string;
    order_id?: number;
    date_from?: string;
    date_to?: string;
  }): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.order_id) params = params.set('order_id', filters.order_id.toString());
      if (filters.date_from) params = params.set('date_from', filters.date_from);
      if (filters.date_to) params = params.set('date_to', filters.date_to);
    }
    return this.http.get<{success: boolean, data: any[], count: number}>(this.apiUrl, { params })
      .pipe(map(res => res.data || []));
  }

  // Lấy thanh toán theo ID
  getPaymentById(id: number): Observable<any> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  // Lấy thanh toán theo order_id
  getPaymentsByOrderId(orderId: number): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[], count: number}>(`${this.apiUrl}/order/${orderId}`)
      .pipe(map(res => res.data || []));
  }

  // Tạo thanh toán mới
  createPayment(paymentData: any): Observable<any> {
    return this.http.post<{success: boolean, data: any, message: string}>(this.apiUrl, paymentData)
      .pipe(map(res => res.data));
  }

  // Cập nhật thanh toán
  updatePayment(id: number, paymentData: any): Observable<any> {
    return this.http.put<{success: boolean, data: any, message: string}>(`${this.apiUrl}/${id}`, paymentData)
      .pipe(map(res => res.data));
  }

  // Xác nhận thanh toán
  confirmPayment(id: number, changedBy?: string): Observable<any> {
    return this.http.patch<{success: boolean, data: any, message: string}>(`${this.apiUrl}/${id}/confirm`, { changed_by: changedBy })
      .pipe(map(res => res.data));
  }

  // Hủy thanh toán
  cancelPayment(id: number, notes?: string, changedBy?: string): Observable<any> {
    return this.http.patch<{success: boolean, data: any, message: string}>(`${this.apiUrl}/${id}/cancel`, { notes, changed_by: changedBy })
      .pipe(map(res => res.data));
  }

  // Xóa thanh toán
  deletePayment(id: number): Observable<void> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  // Lấy lịch sử thanh toán
  getPaymentHistory(id: number): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[], count: number}>(`${this.apiUrl}/${id}/history`)
      .pipe(map(res => res.data || []));
  }

  // Lấy thống kê thanh toán
  getPaymentStatistics(filters?: {
    date_from?: string;
    date_to?: string;
  }): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.date_from) params = params.set('date_from', filters.date_from);
      if (filters.date_to) params = params.set('date_to', filters.date_to);
    }
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/statistics`, { params })
      .pipe(map(res => res.data));
  }
}


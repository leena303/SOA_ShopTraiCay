import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private apiUrl = 'http://localhost:3003/reports'; // Reporting Service port 3003

  constructor(private http: HttpClient) { }

  // ============================================
  // ORDER REPORTS
  // ============================================

  // Lấy danh sách báo cáo đơn hàng
  getOrderReports(filters?: { order_id?: number, date_from?: string, date_to?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/orders`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.order_id) params.append('order_id', filters.order_id.toString());
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }
    
    return this.http.get<{success: boolean, data: any[]}>(url).pipe(
      map(response => response.data || [])
    );
  }

  // Lấy chi tiết báo cáo đơn hàng
  getOrderReportById(id: number): Observable<any> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/orders/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Tạo báo cáo đơn hàng (CẦN JWT)
  createOrderReport(orderId: number): Observable<any> {
    return this.http.post<{success: boolean, data: any, message: string}>(`${this.apiUrl}/orders`, { order_id: orderId });
  }

  // Xóa báo cáo đơn hàng (CẦN JWT)
  deleteOrderReport(id: number): Observable<any> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/orders/${id}`);
  }

  // ============================================
  // PRODUCT REPORTS
  // ============================================

  // Lấy danh sách báo cáo sản phẩm
  getProductReports(filters?: { product_id?: number, order_report_id?: number, date_from?: string, date_to?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/products`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.product_id) params.append('product_id', filters.product_id.toString());
      if (filters.order_report_id) params.append('order_report_id', filters.order_report_id.toString());
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }
    
    return this.http.get<{success: boolean, data: any[]}>(url).pipe(
      map(response => response.data || [])
    );
  }

  // Lấy chi tiết báo cáo sản phẩm
  getProductReportById(id: number): Observable<any> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/products/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Lấy báo cáo tổng hợp sản phẩm
  getProductReportSummary(productId: number): Observable<any> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/products/${productId}/summary`).pipe(
      map(response => response.data)
    );
  }

  // Tạo báo cáo sản phẩm (CẦN JWT)
  createProductReport(reportData: { order_report_id: number, product_id: number, quantity: number, unit_price: number }): Observable<any> {
    return this.http.post<{success: boolean, data: any, message: string}>(`${this.apiUrl}/products`, reportData);
  }

  // Xóa báo cáo sản phẩm (CẦN JWT)
  deleteProductReport(id: number): Observable<any> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/products/${id}`);
  }
}


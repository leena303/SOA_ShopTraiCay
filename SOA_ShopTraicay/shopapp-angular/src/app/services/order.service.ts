import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3002/orders'; // Order Service port 3002
  private orderItemsUrl = 'http://localhost:3002/order_items';

  constructor(private http: HttpClient) { }

  // Tạo đơn hàng mới (CẦN JWT)
  createOrder(orderData: any): Observable<any> {
    // Validate input
    if (!orderData.customer_name && !orderData.customerName) {
      throw new Error('Tên khách hàng là bắt buộc');
    }
    if (!orderData.customer_email && !orderData.customerEmail) {
      throw new Error('Email khách hàng là bắt buộc');
    }
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất một sản phẩm');
    }

    // Chuyển đổi format để phù hợp với backend
    const backendOrderData: any = {
      customer_name: orderData.customer_name || orderData.customerName,
      customer_email: orderData.customer_email || orderData.customerEmail,
      items: (orderData.items || []).map((item: any) => ({
        product_id: item.product?.id || item.product_id || item.id,
        quantity: Number(item.quantity) || 1
      })).filter((item: any) => item.product_id && item.quantity > 0), // Filter invalid items
      payment_method: orderData.payment_method || 'cash',
      notes: orderData.notes || ''
    };
    
    // Thêm customer_id nếu có (từ user_id hoặc customer_id)
    if (orderData.customer_id || orderData.user_id) {
      backendOrderData.customer_id = orderData.customer_id || orderData.user_id;
    }

    console.log('Creating order with data:', backendOrderData);
    
    return this.http.post<{success: boolean, data: any, message: string}>(this.apiUrl, backendOrderData).pipe(
      map(response => {
        console.log('Order creation response:', response);
        // Backend trả về { success: true, data: {...}, message: string }
        if (response.success) {
          return {
            success: true,
            message: response.message || 'Tạo đơn hàng thành công',
            data: response.data
          };
        }
        throw new Error(response.message || 'Tạo đơn hàng thất bại');
      })
    );
  }
  // Lấy tất cả đơn hàng (không cần JWT)
  // Có thể truyền filters: { customer_id, customer_email, status, date_from, date_to }
  getOrders(filters?: { customer_id?: number, customer_email?: string, status?: string, date_from?: string, date_to?: string }): Observable<Order[]> {
    let url = this.apiUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.customer_id) params.append('customer_id', filters.customer_id.toString());
      if (filters.customer_email) params.append('customer_email', filters.customer_email);
      if (filters.status) params.append('status', filters.status);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      const queryString = params.toString();
      if (queryString) {
        url += '?' + queryString;
      }
    }
    
    return this.http.get<{success: boolean, data: any[], count?: number}>(url).pipe(
      map(response => {
        // Backend trả về { success: true, data: [...], count: number }
        const orders = (response.success && response.data) ? response.data : (Array.isArray(response) ? response : []);
        return orders.map((item: any) => new Order({
          id: item.id,
          order_code: item.order_number || item.orderNumber || item.order_code,
          user_id: item.customer_id || item.user_id || 0,
          customer_name: item.customer_name || item.customerName,
          customer_email: item.customer_email || item.customerEmail,
          total_price: item.total_amount || item.totalAmount || item.total_price || 0,
          createdAt: item.created_at || item.createdAt,
          status: item.status || 'pending',
          items: item.items || item.order_items || []
        }));
      })
    );
  }

  // Lấy tổng số đơn hàng (tính từ danh sách)
  getTotalOrders(): Observable<{ total_orders: number }> {
    return this.getOrders().pipe(
      map(orders => ({ total_orders: orders.length })),
      // Handle errors gracefully
      // catchError(() => of({ total_orders: 0 }))
    );
  }

  // Lấy thống kê đơn hàng
  getOrderStatistics(): Observable<any> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/statistics`);
  }

  // Lấy chi tiết đơn hàng theo orderId
  getOrderDetail(orderId: number): Observable<any> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/${orderId}`).pipe(
      map(response => {
        // Backend trả về { success: true, data: {...} }
        const order = (response.success && response.data) ? response.data : response;
        return new Order({
          id: order.id,
          order_code: order.order_number || order.orderNumber || order.order_code,
          user_id: order.customer_id || order.user_id || 0,
          customer_name: order.customer_name || order.customerName,
          customer_email: order.customer_email || order.customerEmail,
          total_price: order.total_amount || order.totalAmount || order.total_price || 0,
          createdAt: order.created_at || order.createdAt,
          status: order.status || 'pending',
          items: (order.items || order.order_items || []).map((item: any) => {
            // Tạo Product object với đầy đủ thông tin
            const productData = {
              id: item.product_id,
              name: item.product_name || item.name || 'Sản phẩm',
              unit_price: item.unit_price || item.price || item.product_price || 0,
              price: item.unit_price || item.price || item.product_price || 0,
              image: item.image_url || item.image || '',
              image_url: item.image_url || item.image || '',
              category: item.category || '',
              unit: item.unit || 'kg',
              quantity: 0
            };
            return {
              product: productData,
              quantity: item.quantity || 1
            };
          })
        });
      })
    );
  }

  // Lấy đơn hàng theo userId (lọc từ danh sách tất cả)
  getUserOrdersById(userId: number): Observable<Order[]> {
    return this.getOrders().pipe(
      map(orders => orders.filter(order => order.user_id === userId))
    );
  }

  // Lấy tất cả đơn hàng của user hiện tại
  getUserOrders(): Observable<Order[]> {
    return this.getOrders();
  }

  // Lấy đơn hàng theo orderId
  getOrderById(orderId: number): Observable<any> {
    return this.getOrderDetail(orderId);
  }

  // Xóa đơn hàng (CẦN JWT)
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${orderId}`);
  }

  // Cập nhật trạng thái đơn hàng (CẦN JWT)
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch<{success: boolean, data: any, message: string}>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  // Cập nhật đơn hàng (CẦN JWT)
  updateOrder(orderId: number, orderData: any): Observable<any> {
    return this.http.put<{success: boolean, data: any, message: string}>(`${this.apiUrl}/${orderId}`, orderData);
  }

  // Thêm order item (CẦN JWT)
  addOrderItem(orderItemData: any): Observable<any> {
    return this.http.post<{success: boolean, data: any}>(this.orderItemsUrl, orderItemData);
  }

  // Lấy order items theo order_id
  getOrderItems(orderId: number): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.orderItemsUrl}/order/${orderId}`).pipe(
      map(response => response.data || [])
    );
  }

  // Hủy đơn hàng (CẦN JWT) - dùng updateOrderStatus với status 'cancelled'
  cancelOrder(orderId: number): Observable<any> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }
}
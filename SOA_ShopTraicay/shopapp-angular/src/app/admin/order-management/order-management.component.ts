import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];
  showOrderList = true;
  selectedOrder: any = null;
  processingOrder: any = null;
  searchText: string = '';

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 7;

  // Form thêm đơn hàng
  showAddOrder: boolean = false;
  products: Product[] = [];
  customers: any[] = [];
  newOrder: any = {
    customer_id: null,
    customer_name: '',
    customer_email: '',
    items: [{ product_id: null, quantity: 1 }],
    payment_method: 'cash',
    notes: ''
  };

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.onShowOrders();
  }

  onShowOrders() {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res || [];
        this.showOrderList = true;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.orders = [];
        this.showOrderList = true;
        if (typeof window !== 'undefined') {
          alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể tải danh sách đơn hàng.'));
        }
      }
    });
  }

  viewOrderDetail(order: any) {
    const orderId = order.id || order.order_id;
    if (orderId) {
      this.orderService.getOrderDetail(orderId).subscribe({
        next: (detail) => {
          this.selectedOrder = detail;
        },
        error: (err) => {
          console.error('Error fetching order detail:', err);
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể tải chi tiết đơn hàng.'));
          }
        }
      });
    }
  }

  showStatusMenu(order: any) {
    this.processingOrder = order;
  }

  updateOrderStatus(order: any, status: string) {
    const orderId = order.id || order.order_id;
    if (orderId) {
      // Backend sử dụng: 'pending', 'completed', 'cancelled'
      // Map từ tiếng Việt sang tiếng Anh nếu cần
      let backendStatus = status;
      if (status === 'Đã xác nhận') backendStatus = 'completed';
      else if (status === 'Đã hủy') backendStatus = 'cancelled';
      else if (status === 'Đang xử lý') backendStatus = 'pending';
      
      this.orderService.updateOrderStatus(orderId, backendStatus).subscribe({
        next: () => {
          order.status = backendStatus;
          this.processingOrder = null;
          // Refresh orders list
          this.onShowOrders();
          if (typeof window !== 'undefined') {
            alert('Cập nhật trạng thái đơn hàng thành công!');
          }
        },
        error: (err) => {
          console.error('Error updating order status:', err);
          if (typeof window !== 'undefined') {
            alert('Cập nhật trạng thái đơn hàng thất bại: ' + (err.error?.message || err.message || 'Lỗi không xác định'));
          }
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Đang xử lý';
      case 'completed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Đang xử lý';
    }
  }

  deleteOrder(order: any) {
    const orderId = order.id || order.order_id;
    if (!orderId) return;
    
    if (typeof window !== 'undefined' && confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.onShowOrders();
          if (typeof window !== 'undefined') {
            alert('Xóa đơn hàng thành công!');
          }
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          console.error('Error details:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            errorBody: err.error
          });
          
          // Xử lý lỗi 401 - token không hợp lệ
          if (err.status === 401) {
            if (typeof window !== 'undefined') {
              alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            this.authService.logout().subscribe(() => {
              this.router.navigate(['/login']);
            });
          } else {
            const errorMessage = err.error?.message || err.message || 'Không thể xóa đơn hàng.';
            if (typeof window !== 'undefined') {
              alert('Lỗi: ' + errorMessage);
            }
          }
        }
      });
    }
  }

  filteredOrders() {
    if (!this.searchText) return this.orders;
    const txt = this.searchText.toLowerCase();
    return this.orders.filter(order =>
      (order.order_code && order.order_code.toLowerCase().includes(txt)) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(txt)) ||
      (order.status && order.status.toLowerCase().includes(txt)) ||
      (
        order.order_date &&
        (
          new Date(order.order_date).toLocaleDateString('vi-VN').toLowerCase().includes(txt) ||
          new Date(order.order_date).toLocaleTimeString('vi-VN').toLowerCase().includes(txt) ||
          new Date(order.order_date).toLocaleString('vi-VN').toLowerCase().includes(txt)
        )
      )
    );
  }

// Phân trang cho đơn hàng
get pagedOrders() {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredOrders().slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.filteredOrders().length / this.pageSize);
}

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ========== Chức năng thêm đơn hàng ==========
  
  showAddOrderForm() {
    this.showAddOrder = true;
    this.loadProducts();
    this.loadCustomers();
    // Reset form
    this.newOrder = {
      customer_id: null,
      customer_name: '',
      customer_email: '',
      items: [{ product_id: null, quantity: 1 }],
      payment_method: 'cash',
      notes: ''
    };
  }

  closeAddOrderForm() {
    this.showAddOrder = false;
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products || [];
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.products = [];
      }
    });
  }

  loadCustomers() {
    // Customer service runs on port 3004
    this.http.get<{success: boolean, data: any[]}>('http://localhost:3004/customers').subscribe({
      next: (response) => {
        this.customers = (response.success && response.data) ? response.data : [];
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.customers = [];
      }
    });
  }

  addProductItem() {
    this.newOrder.items.push({ product_id: null, quantity: 1 });
  }

  removeProductItem(index: number) {
    if (this.newOrder.items.length > 1) {
      this.newOrder.items.splice(index, 1);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    // This will be called when quantity changes
  }

  calculateOrderTotal(): number {
    let total = 0;
    this.newOrder.items.forEach((item: any) => {
      if (item.product_id && item.quantity) {
        const product = this.products.find(p => p.id === item.product_id);
        if (product && product.price) {
          total += (product.price as number) * item.quantity;
        }
      }
    });
    return total;
  }

  onCustomerSelect() {
    const selectedCustomer = this.customers.find(c => c.id === this.newOrder.customer_id);
    if (selectedCustomer) {
      this.newOrder.customer_name = selectedCustomer.name;
      this.newOrder.customer_email = selectedCustomer.email;
    }
  }

  submitNewOrder() {
    // Validate form
    if (!this.newOrder.customer_name || !this.newOrder.customer_email) {
      alert('Vui lòng nhập đầy đủ thông tin khách hàng!');
      return;
    }

    if (this.newOrder.items.length === 0 || !this.newOrder.items.some((item: any) => item.product_id && item.quantity > 0)) {
      alert('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    // Filter out invalid items
    const validItems = this.newOrder.items.filter((item: any) => 
      item.product_id && item.quantity > 0
    );

    if (validItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm hợp lệ!');
      return;
    }

    // Prepare order data
    const orderData = {
      customer_id: this.newOrder.customer_id || null,
      customer_name: this.newOrder.customer_name,
      customer_email: this.newOrder.customer_email,
      items: validItems.map((item: any) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity)
      })),
      payment_method: this.newOrder.payment_method || 'cash',
      notes: this.newOrder.notes || ''
    };

    // Create order
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        if (typeof window !== 'undefined') {
          alert('Tạo đơn hàng thành công!');
        }
        this.closeAddOrderForm();
        this.onShowOrders(); // Refresh orders list
      },
      error: (err) => {
        console.error('Error creating order:', err);
        if (typeof window !== 'undefined') {
          alert('Lỗi tạo đơn hàng: ' + (err.error?.message || err.message || 'Lỗi không xác định'));
        }
      }
    });
  }

}
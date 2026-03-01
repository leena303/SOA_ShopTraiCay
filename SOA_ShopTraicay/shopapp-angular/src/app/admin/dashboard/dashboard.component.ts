import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalOrders = 0;
  totalProducts = 0; 
  totalUsers = 0;
  totalInStock = 0;
  totalOutStock = 0;
  showInStockCount = false;
  inStockProducts: any[] = [];
  outOfStockProducts: any[] = [];
  showOutOfStockCount = false;
  products: any[] = [];
  showOrderList = false;
  orders: any[] = [];
  selectedOrder: any = null;
  showUserList = false;
  users: any[] = [];
  processingOrder: any = null;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderService.getTotalOrders().subscribe((res: any) => {
      this.totalOrders = res.total_orders || 0; 
    });
  
    // Lấy tổng số users - chỉ khi đã đăng nhập
    if (this.authService.tokenValue && this.authService.isLoggedIn()) {
      this.userService.getTotalUsers().subscribe({
        next: (res: any) => {
          this.totalUsers = res.total || 0;
        },
        error: (err) => {
          // Chỉ log lỗi, không hiển thị alert cho 401 (token hết hạn)
          if (err.status === 401) {
            console.warn('Token expired or invalid, skipping user count');
          } else {
            console.error('Error loading total users:', err);
          }
          this.totalUsers = 0;
        }
      });
    } else {
      this.totalUsers = 0;
    }
  
    this.productService.getInStockCount().subscribe({
      next: (res: any) => {
        this.totalInStock = res.total || 0;
      },
      error: (err) => {
        console.error('Error loading in stock count:', err);
        this.totalInStock = 0;
      }
    });

    this.productService.getOutStockCount().subscribe({
      next: (res: any) => {
        this.totalOutStock = res.total || 0;
      },
      error: (err) => {
        console.error('Error loading out stock count:', err);
        this.totalOutStock = 0;
      }
    });
  }
  onShowOrders() {
    if (!this.showOrderList) {
      this.orderService.getOrders().subscribe({
        next: (res) => {
          this.orders = res;
          this.showOrderList = true;
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          if (typeof window !== 'undefined') {
            alert('Không thể tải danh sách đơn hàng: ' + (err.error?.message || err.message || 'Lỗi không xác định'));
          }
        }
      });
    } else {
      this.showOrderList = false;
    }
  }

  viewOrderDetail(order: any) {
    const orderId = order.id || order.order_id;
    if (orderId) {
      this.orderService.getOrderDetail(orderId).subscribe({
        next: (detail) => {
          this.selectedOrder = detail;
        },
        error: (err) => {
          console.error('Error loading order detail:', err);
          if (typeof window !== 'undefined') {
            alert('Không thể tải chi tiết đơn hàng: ' + (err.error?.message || err.message || 'Lỗi không xác định'));
          }
        }
      });
    }
  }

  onShowUsers() {
    if (!this.showUserList) {
      this.userService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          this.showUserList = true;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          // Xử lý lỗi 401 - tự động chuyển đến trang login
          if (err.status === 401) {
            this.authService.logout().subscribe(() => {
              this.router.navigate(['/login']);
            });
          } else {
            this.users = [];
            this.showUserList = true;
            if (typeof window !== 'undefined') {
              alert('Không thể tải danh sách người dùng: ' + (err.error?.message || err.message || 'Lỗi không xác định'));
            }
          }
        }
      });
    } else {
      this.showUserList = false;
    }
  }

onShowInStockCount() {
  if (!this.showInStockCount) {
    this.productService.getInStockCount().subscribe((res: any) => {
      this.inStockProducts = res.products || [];
      this.showInStockCount = true;
    });
  } else {
    this.showInStockCount = false;
  }
}

onShowOutOfStockCount() {
    if (!this.showOutOfStockCount) {
      this.productService.getOutStockCount().subscribe((res: any) => {
        this.outOfStockProducts = res.products || [];
        this.showOutOfStockCount = true;
      });
    } else {
      this.showOutOfStockCount = false;
    }
  }

showStatusMenu(order: any) {
  this.processingOrder = order;
}

updateOrderStatus(order: any, status: string) {
  const orderId = order.id || order.order_id;
  if (orderId) {
    this.orderService.updateOrderStatus(orderId, status).subscribe(() => {
      order.status = status; // Cập nhật lại trạng thái trên FE
      this.processingOrder = null;
      // Refresh orders list
      this.onShowOrders();
    });
  }
}
}
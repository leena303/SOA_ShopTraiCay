import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';
import { Subscription, forkJoin, of } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading: boolean = true;
  error: string | null = null;
  showAllOrders: boolean = false; // Debug mode: hiển thị tất cả đơn hàng
  private userSubscription!: Subscription;
  private routerSubscription!: Subscription;
  private userId: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    public authService: AuthService  // Changed to public for template access
  ) {
    console.log('OrderHistoryComponent constructor called');
  }

  ngOnInit(): void {
    console.log('=== OrderHistoryComponent ngOnInit START ===');
    console.log('AuthService currentUserValue:', this.authService.currentUserValue);
    
    // Lấy thông tin user hiện tại
    this.userSubscription = this.authService.currentUser.subscribe({
      next: (user) => {
        console.log('AuthService currentUser emitted:', user);
        if (user) {
          this.userId = user.id || 0;
          console.log('User found, ID:', this.userId);
          this.loadOrders();
        } else {
          console.warn('No user logged in');
          this.error = 'Vui lòng đăng nhập để xem lịch sử đặt hàng';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error in currentUser subscription:', err);
        this.error = 'Lỗi khi lấy thông tin người dùng';
        this.loading = false;
      }
    });
    
    // Fallback: Nếu currentUserValue đã có sẵn, load ngay
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      console.log('Current user already available, loading orders immediately');
      this.userId = currentUser.id || 0;
      this.loadOrders();
    }
    
    // Reload orders khi navigate đến trang này (để hiển thị đơn hàng mới)
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/order-history' || event.urlAfterRedirects === '/order-history') {
        console.log('Navigated to order-history, reloading orders...');
        this.loadOrders();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadOrders(): void {
    console.log('=== LOAD ORDERS START ===');
    this.loading = true;
    this.error = null;
    
    // Lấy thông tin user để lấy user ID
    const currentUser = this.authService.currentUserValue;
    const userId = currentUser?.id || this.userId;
    
    console.log('🔍 Current user info:', {
      id: userId,
      fullUser: currentUser,
      hasToken: !!this.authService.tokenValue
    });
    
    // Nếu không có user, cảnh báo
    if (!currentUser || !userId) {
      console.error('❌ ERROR: No user logged in or no user ID!');
      this.error = 'Vui lòng đăng nhập để xem lịch sử đặt hàng';
      this.loading = false;
      return;
    }
    
    // Lấy đơn hàng với filter theo customer_id (user_id)
    console.log('Loading orders for user ID:', userId);
    const ordersObservable = this.orderService.getOrders({ customer_id: userId });
    
    ordersObservable.subscribe({
      next: (orders) => {
        console.log('Orders from backend (ALL - no filter):', orders);
        console.log('Total orders:', orders.length);
        
        // Debug: Log thông tin từng order
        orders.forEach((order, index) => {
          console.log(`Order ${index + 1}:`, {
            id: order.id,
            customer_id: order.user_id,
            customer_email: order.customer_email,
            customer_name: order.customer_name,
            status: order.status
          });
        });
        
        // Lọc orders theo user ID (tài khoản đăng nhập) - CHỈ LỌC THEO USER ID
        let filteredOrders: Order[] = [];
        
        if (orders.length === 0) {
          console.log('No orders in database');
          filteredOrders = [];
        } else if (userId) {
          // CHỈ lọc theo user_id (customer_id) - không dùng email
          console.log('=== FILTERING ORDERS BY USER ID ===');
          console.log('User ID:', userId);
          
          filteredOrders = orders.filter(order => {
            // Chỉ match theo user_id
            const orderUserId = order.user_id;
            if (orderUserId && orderUserId === userId) {
              console.log(`✓ Order ${order.id} matched by user_id:`, orderUserId, '===', userId);
              return true;
            } else {
              console.log(`✗ Order ${order.id} did not match - user_id:`, orderUserId, '!==', userId);
              return false;
            }
          });
          
          console.log('Filtered orders count:', filteredOrders.length);
        } else {
          // Nếu không có user ID, không hiển thị đơn hàng nào
          console.warn('⚠️ No user ID available, cannot filter orders');
          console.warn('⚠️ Current user:', currentUser);
          filteredOrders = [];
        }
        
        // Load items cho mỗi order đã lọc
        if (filteredOrders.length > 0) {
          const orderDetailObservables = filteredOrders.map(order => 
            this.orderService.getOrderDetail(order.id!).pipe(
              map(detail => {
                console.log(`Order ${order.id} detail loaded:`, detail);
                // detail là Order object, lấy items từ đó
                const items = detail.items || [];
                console.log(`Order ${order.id} items:`, items);
                return { ...order, items };
              }),
              catchError(err => {
                console.error(`Error loading order ${order.id} details:`, err);
                console.error(`Error details:`, err);
                return of({ ...order, items: [] });
              })
            )
          );
          
          forkJoin(orderDetailObservables).subscribe({
            next: (ordersWithItems) => {
              console.log('Orders with items (final):', ordersWithItems);
              // Convert to Order objects
              this.orders = ordersWithItems.map(orderData => new Order(orderData));
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading order details:', error);
              // Convert to Order objects
              this.orders = filteredOrders.map(order => new Order({ ...order, items: [] }));
              this.loading = false;
            }
          });
        } else {
          console.warn('No orders found at all in database.');
          this.orders = [];
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('=== ERROR loading orders ===');
        console.error('Error object:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error body:', error.error);
        
        this.error = 'Không thể tải lịch sử đặt hàng. Vui lòng thử lại sau.';
        this.loading = false;
        
        if (error.status === 401) {
          // Redirect to login if unauthorized
          if (typeof window !== 'undefined') {
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            this.authService.logout().subscribe(() => {
              this.router.navigate(['/login']);
            });
          }
        } else if (error.status === 0) {
          // Connection error
          console.error('Connection error - Order Service might not be running');
          this.error = 'Không thể kết nối đến server. Vui lòng kiểm tra Order Service (port 3002) có đang chạy không.';
        }
      }
    });
  }

  // Hàm chuyển trạng thái sang tiếng Việt
  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Đang xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Không xác định';
    }
  }

  // Hàm trả về class cho trạng thái
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Hàm kiểm tra xem đơn hàng có thể hủy được không
  canCancelOrder(order: Order): boolean {
    if (!order || !order.status) {
      return false;
    }
    const status = (order.status || '').toString().toLowerCase().trim();
    
    // Danh sách các trạng thái KHÔNG thể hủy
    const nonCancellableStatuses = ['completed', 'cancelled', 'đã hoàn thành', 'đã hủy'];
    
    // Kiểm tra xem status có trong danh sách không thể hủy không
    const cannotCancel = nonCancellableStatuses.some(nonStatus => 
      status === nonStatus || status.includes(nonStatus)
    );
    
    // Chỉ cho phép hủy các đơn hàng ở trạng thái pending hoặc processing
    const canCancel = status === 'pending' || status === 'processing';
    
    console.log(`canCancelOrder check for order ${order.id}:`, {
      status: order.status,
      normalizedStatus: status,
      cannotCancel,
      canCancel,
      result: canCancel && !cannotCancel
    });
    
    return canCancel && !cannotCancel;
  }

  //Hủy đơn hàng
  getOrders() {
    this.orderService.getUserOrdersById(this.userId).subscribe(data => {
      this.orders = data;
    });
  }

  // Helper methods để xử lý items với type safety
  getItemImage(item: any): string {
    // Thử nhiều cách để lấy image
    let image = item.product?.image || 
                item.product?.image_url || 
                (item as any).image_url || 
                (item as any).image || 
                '';
    
    // Nếu không có image, dùng default
    if (!image || image.trim() === '') {
      return this.getDefaultImageUrl();
    }
    
    // Nếu đã là full URL (http/https), trả về nguyên
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Nếu là data URI, trả về nguyên
    if (image.startsWith('data:')) {
      return image;
    }
    
    // Nếu là relative path, thêm base URL từ backend product service
    // Đảm bảo có dấu / ở đầu
    const path = image.startsWith('/') ? image : `/${image}`;
    return `http://localhost:3001${path}`;
  }

  getItemName(item: any): string {
    return item.product?.name || (item as any).product_name || 'Sản phẩm';
  }

  getItemPrice(item: any): number {
    return item.product?.price || (item as any).unit_price || 0;
  }

  getItemQuantity(item: any): number {
    return item.quantity || 1;
  }

  // Helper method để lấy default image URL
  getDefaultImageUrl(): string {
    // Sử dụng data URI thay vì file asset để tránh 404
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.getDefaultImageUrl();
    }
  }

  cancelOrder(orderId: number) {
    // Tìm đơn hàng để kiểm tra trạng thái
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return;
    }

    // Kiểm tra lại xem có thể hủy không (double check)
    if (!this.canCancelOrder(order)) {
      if (typeof window !== 'undefined') {
        alert('Không thể hủy đơn hàng này. Đơn hàng đã hoàn thành hoặc đã bị hủy.');
      }
      return;
    }

    if (typeof window !== 'undefined' && confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      console.log('Cancelling order:', orderId, 'Current status:', order.status);
      this.orderService.cancelOrder(orderId).subscribe({
        next: (response) => {
          console.log('Order cancelled successfully:', response);
          // Cập nhật trạng thái đơn hàng trong danh sách hiện tại NGAY LẬP TỨC
          const orderIndex = this.orders.findIndex(o => o.id === orderId);
          if (orderIndex !== -1) {
            // Cập nhật status và trigger change detection
            this.orders[orderIndex].status = 'cancelled';
            // Tạo mảng mới để trigger change detection
            this.orders = [...this.orders];
            console.log('Updated order status in local list to cancelled, button should now be hidden');
          }
          
          if (typeof window !== 'undefined') {
            alert('Hủy đơn hàng thành công!');
          }
          
          // Sau đó reload để đảm bảo đồng bộ với backend (sau khi user thấy thay đổi)
          setTimeout(() => {
            this.loadOrders();
          }, 1000);
        },
        error: (err: any) => {
          console.error('Error cancelling order:', err);
          console.error('Error details:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          if (typeof window !== 'undefined') {
            const errorMessage = err.error?.message || err.message || 'Lỗi không xác định';
            alert('Hủy đơn thất bại: ' + errorMessage);
          }
        }
      });
    }
  }


  // Optional: Method to view details of a specific order
  // viewOrderDetails(orderId: number): void {
  //   // Navigate to a detailed order view page
  //   this.router.navigate(['/order-details', orderId]);
  // }
} 
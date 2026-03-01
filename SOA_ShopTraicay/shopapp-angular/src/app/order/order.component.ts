import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';
import { Order } from '../models/order.model';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
// Import AuthService nếu bạn dùng để lấy User ID
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  loading: boolean = false;
  error: string | null = null;
  couponCode: string = '';
  user_id: number = 0; // <-- Đảm bảo thuộc tính này được gán User ID thực
  orderPlaced: boolean = false;
  customer_name: string = ''; // Tên khách hàng (backend yêu cầu)
  customer_email: string = ''; // Email khách hàng (backend yêu cầu)
  shipping_address: string = ''; // Địa chỉ giao hàng
  selectedPaymentMethod: string = 'cash'; // Phương thức thanh toán (mặc định: cash)
  discountAmount: number = 0; // Property for discount amount
  shippingCost: number = 0; // Property for shipping cost (placeholder)
  finalTotalAmount: number = 0; // Property for final total amount
  agreeTerms: boolean = false; // Property for terms and conditions checkbox
  orderNotes: string = ''; // Ghi chú đơn hàng
  private userSubscription!: Subscription; // Subscription để quản lý việc hủy đăng ký

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService // <-- AuthService đã được inject
  ) { console.log('OrderComponent constructor'); }

  ngOnInit(): void {
    console.log('OrderComponent ngOnInit');
    // Logic để lấy User ID thực của người dùng đã đăng nhập và gán cho this.user_id
    // Đăng ký theo dõi currentUser từ AuthService
    this.userSubscription = this.authService.currentUser.subscribe(currentUser => {
      console.log('AuthService currentUser emitted:', currentUser);
      if (currentUser && currentUser.id) {
        this.user_id = currentUser.id;
        console.log("Đã lấy được User ID và gán vào this.user_id:", this.user_id);
        
        // Tự động điền email và tên từ user nếu chưa có
        // QUAN TRỌNG: Ưu tiên email hoặc username để đảm bảo khớp với database
        // Logic: Ưu tiên email thật, nếu không có thì dùng username (vì username thường match với database)
        const preferredEmail = currentUser.email || currentUser.customer_email || currentUser.username;
        if (!this.customer_email || this.customer_email !== preferredEmail) {
          this.customer_email = preferredEmail;
          console.log("Đã tự động điền/đồng bộ email:", this.customer_email, "from:", {
            email: currentUser.email,
            customer_email: currentUser.customer_email,
            username: currentUser.username
          });
        }
        if (!this.customer_name || this.customer_name !== currentUser.username) {
          this.customer_name = currentUser.username || currentUser.email || 'Khách hàng';
          console.log("Đã tự động điền/đồng bộ tên:", this.customer_name);
        }
        
        // Đảm bảo customer_email luôn có giá trị (fallback về username nếu không có email)
        if (!this.customer_email) {
          this.customer_email = currentUser.username || 'guest';
          console.warn("No email found, using username as customer_email:", this.customer_email);
        }
      } else {
         this.user_id = 0; // Reset user_id nếu không có user (đăng xuất)
         console.warn("AuthService: Không tìm thấy thông tin người dùng đã đăng nhập hoặc ID.");
         // Có thể hiển thị thông báo hoặc điều hướng
         // this.error = "Bạn cần đăng nhập để đặt hàng."; 
         // this.router.navigate(['/login']);
      }
    });

    this.loadCartItems();
  }

  // Quan trọng: Hủy đăng ký khi component bị hủy để tránh memory leaks
  ngOnDestroy(): void {
    console.log('OrderComponent ngOnDestroy');
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      const itemPrice = Number(item.product.price) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
    // Calculate final total (subtotal - discount + shipping)
    this.finalTotalAmount = this.totalAmount - this.discountAmount + this.shippingCost;
  }

  updateQuantity(productId: number, quantity: number): void {
    const success = this.cartService.updateQuantity(productId, quantity);
    if (success) {
      this.loadCartItems(); // Reload để cập nhật UI
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  getItemTotalPrice(item: CartItem): number {
    return item.getTotalPrice();
  }

  // Getter to check if the order form is valid to enable placing the order
  get isOrderValid(): boolean {
    return this.cartItems.length > 0 &&
           !!this.customer_name &&
           !!this.customer_email &&
           !!this.shipping_address &&
           !!this.selectedPaymentMethod &&
           this.agreeTerms;
  }

  placeOrder(): void {
    // Kiểm tra hợp lệ
    if (this.cartItems.length === 0) {
      this.error = 'Giỏ hàng của bạn đang trống';
      if (typeof window !== 'undefined') {
        alert(this.error);
      }
      return;
    }

    if (!this.customer_name || !this.customer_email || !this.shipping_address || !this.selectedPaymentMethod) {
      this.error = 'Vui lòng điền đầy đủ thông tin khách hàng và địa chỉ giao hàng.';
      if (typeof window !== 'undefined') {
        alert(this.error);
      }
      return;
    }

    if (!this.agreeTerms) {
      this.error = 'Bạn phải đồng ý với các điều khoản và điều kiện.';
      if (typeof window !== 'undefined') {
        alert(this.error);
      }
      return;
    }

    // Kiểm tra token JWT
    if (!this.authService.tokenValue) {
      this.error = 'Bạn cần đăng nhập để đặt hàng.';
      if (typeof window !== 'undefined') {
        alert(this.error);
        this.router.navigate(['/login']);
      }
      return;
    }

    // Lấy thông tin user hiện tại để đảm bảo customer_email khớp
    const currentUser = this.authService.currentUserValue;
    const finalCustomerEmail = this.customer_email || currentUser?.email || currentUser?.customer_email || currentUser?.username || '';
    const finalCustomerName = this.customer_name || currentUser?.username || currentUser?.email || 'Khách hàng';
    const finalCustomerId = this.user_id || currentUser?.id || null;

    console.log('=== PLACE ORDER DEBUG ===');
    console.log('Current user:', currentUser);
    console.log('User ID:', finalCustomerId);
    console.log('Customer email (final):', finalCustomerEmail);
    console.log('Customer name (final):', finalCustomerName);
    console.log('Customer email (form):', this.customer_email);
    console.log('Customer name (form):', this.customer_name);

    // Tạo body yêu cầu phù hợp với backend (cửa hàng trái cây)
    const orderData = {
      user_id: finalCustomerId, // Gửi user_id để backend lưu customer_id
      customer_id: finalCustomerId, // Cũng gửi customer_id để đảm bảo
      customer_name: finalCustomerName,
      customer_email: finalCustomerEmail, // QUAN TRỌNG: Phải khớp với email/username của user
      items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      payment_method: this.selectedPaymentMethod || 'cash',
      notes: this.orderNotes ? `${this.orderNotes} | Địa chỉ: ${this.shipping_address}` : `Địa chỉ giao hàng: ${this.shipping_address}`
    };

    console.log('Dữ liệu đơn hàng gửi đi:', orderData);
    console.log('Token exists:', !!this.authService.tokenValue);

    this.loading = true;
    this.error = null;

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.loading = false;
        this.error = null;
        this.cartService.clearCart();
        if (typeof window !== 'undefined') {
          alert(response.message || 'Đặt hàng thành công!');
        }
        this.orderPlaced = true;
        // Redirect sau 2 giây
        setTimeout(() => {
          this.router.navigate(['/order-history']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error placing order:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorBody: error.error
        });
        
        // Xử lý lỗi 401 - token không hợp lệ
        if (error.status === 401) {
          this.error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          if (typeof window !== 'undefined') {
            alert(this.error);
          }
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else if (error.status === 400) {
          // Lỗi validation từ backend
          const errorMessage = error.error?.message || error.message || 'Dữ liệu đơn hàng không hợp lệ.';
          this.error = errorMessage;
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + errorMessage);
          }
        } else {
          const errorMessage = error.error?.message || error.error?.error || error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.';
          this.error = errorMessage;
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + errorMessage);
          }
        }
      }
    });
  }

  // Method để điều hướng đến trang chủ để tiếp tục mua sắm
  continueShopping(): void {
    this.router.navigate(['/']);
  }

  // Method để xem lịch sử đặt hàng
  viewOrderHistory(): void {
    this.router.navigate(['/order-history']);
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getProductMaxQuantity(product: any): number {
    if (!product || !product.quantity) {
      return 0;
    }
    return typeof product.quantity === 'number' 
      ? product.quantity 
      : parseInt(String(product.quantity)) || 0;
  }
}

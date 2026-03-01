import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.scss'
})
export class OrderConfirmComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  getItemTotalPrice(item: CartItem): number {
    return item.getTotalPrice();
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/order']);
  }

  clearCart(): void {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      this.cartService.clearCart();
    }
  }
}

import { CartItem } from './cart-item.model';
import { Product } from './product.model';

export class Order {
    id?: number;
    order_code?: string;
    user_id: number;
    customer_name?: string;
    customer_email?: string;
    items: CartItem[];
    total_price: number;
    createdAt: Date;
    couponCode?: string;
    discount?: number;
    status: string;

        constructor(data: any = {}) {
        this.id = data.id;
        this.order_code =
          typeof data.order_code === 'object'
            ? String(data.order_code.code)
            : data.order_code !== undefined && data.order_code !== null
              ? String(data.order_code)
              : data.orderCode !== undefined && data.orderCode !== null
                ? String(data.orderCode)
                : data.code !== undefined && data.code !== null
                  ? String(data.code)
                  : '';
        this.user_id = data.userId || data.user_id || 0;
        this.customer_name = data.customer_name || data.customerName;
        this.customer_email = data.customer_email || data.customerEmail;
        // Map items và đảm bảo product là Product object
        this.items = (data.items || []).map((item: any) => {
          const product = item.product instanceof Product 
            ? item.product 
            : new Product(item.product || {});
          return new CartItem(product, item.quantity || 1);
        });
        this.total_price = data.totalPrice || data.total_price || 0;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.couponCode = data.couponCode;
        this.discount = data.discount || 0;
        this.status = data.status || 'pending'; // Default status
    }

    // Calculate total price including discount
    calculateTotalPrice(): number {
        const subtotal = this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
        if (this.discount) {
            return subtotal - (subtotal * this.discount / 100);
        }
        return subtotal;
    }

    // Get formatted total price
    getFormattedTotalPrice(): string {
        return `${this.calculateTotalPrice()} VNĐ`;
    }

    // Add item to order
    addItem(item: CartItem): void {
        const existingItem = this.items.find(i => i.product.id === item.product.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
    }

    // Remove item from order
    removeItem(productId: number): void {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    // Apply coupon
    applyCoupon(code: string, discount: number): void {
        this.couponCode = code;
        this.discount = discount;
    }
} 
import { Product } from './product.model';

export class CartItem {
    product: Product;
    quantity: number;

    constructor(product: Product, quantity: number = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    // Calculate total price for this item
    getTotalPrice(): number {
        let price: number;
        if (typeof this.product.price === 'number') {
            price = this.product.price;
        } else {
            const priceStr = String(this.product.price || '0');
            price = parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
        }
        return price * this.quantity;
    }

    // Get formatted total price
    getFormattedTotalPrice(): string {
        return `${this.getTotalPrice()} VNĐ`;
    }

    // Increase quantity
    increaseQuantity(): void {
        this.quantity++;
    }

    // Decrease quantity
    decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }
} 
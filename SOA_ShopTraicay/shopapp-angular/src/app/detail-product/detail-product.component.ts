import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule]
})
export class DetailProductComponent implements OnInit {

  product: Product = new Product({});
  productImages: string[] = [];
  selectedImage: string = '';
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;

      // Xử lý images: luôn trả về mảng các chuỗi URL
      if (Array.isArray(this.product.images)) {
        this.productImages = this.product.images;
      } else if (typeof this.product.images === 'string') {
        try {
          this.productImages = JSON.parse(this.product.images);
        } catch {
          this.productImages = [];
        }
      } else {
        this.productImages = [];
      }

      // Nếu phần tử đầu tiên vẫn là chuỗi JSON, parse tiếp (fix dữ liệu lồng)
      while (
        this.productImages.length === 1 &&
        typeof this.productImages[0] === 'string' &&
        this.productImages[0].trim().startsWith('[')
      ) {
        try {
          this.productImages = JSON.parse(this.productImages[0]);
        } catch {
          this.productImages = [];
          break;
        }
      }

      // Nếu không có images, dùng image làm ảnh duy nhất
      if (!this.productImages.length && this.product.image) {
        this.productImages = [this.product.image];
      }

      // Chuyển đổi tất cả image paths thành full URLs với base URL từ backend
      this.productImages = this.productImages.map(img => this.getFullImageUrl(img));

      // Đảm bảo selectedImage là chuỗi URL
      this.currentImageIndex = 0;
      this.selectedImage = this.productImages.length > 0 ? this.productImages[0] : this.product.getDefaultImage();

      // Debug
      console.log('productImages:', this.productImages);
      console.log('selectedImage:', this.selectedImage);
    });
  }

  selectImage(img: string) {
    this.selectedImage = img;
    this.currentImageIndex = this.productImages.indexOf(img);
  }

  prevImage() {
    if (this.productImages.length === 0) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.productImages.length) % this.productImages.length;
    this.selectedImage = this.productImages[this.currentImageIndex];
  }

  nextImage() {
    if (this.productImages.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
    this.selectedImage = this.productImages[this.currentImageIndex];
  }

  increaseQuantity() {
    // Kiểm tra tồn kho trước khi tăng
    if (!this.product.isInStock()) {
      if (typeof window !== 'undefined') {
        alert('Sản phẩm này đã hết hàng!');
      }
      return;
    }
    
    const productStock = typeof this.product.quantity === 'number' ? this.product.quantity : parseInt(String(this.product.quantity)) || 0;
    if (this.quantity >= productStock) {
      if (typeof window !== 'undefined') {
        alert(`Sản phẩm chỉ còn ${productStock} ${this.product.unit || 'kg'}. Không thể thêm nữa!`);
      }
      return;
    }
    
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    // Kiểm tra tồn kho
    if (!this.product.isInStock()) {
      if (typeof window !== 'undefined') {
        alert('Sản phẩm này đã hết hàng!');
      }
      return;
    }
    
    const productStock = typeof this.product.quantity === 'number' ? this.product.quantity : parseInt(String(this.product.quantity)) || 0;
    if (this.quantity > productStock) {
      if (typeof window !== 'undefined') {
        alert(`Sản phẩm chỉ còn ${productStock} ${this.product.unit || 'kg'}. Vui lòng chọn số lượng phù hợp!`);
      }
      this.quantity = productStock;
      return;
    }
    
    // Thêm từng item một và kiểm tra tồn kho
    let addedCount = 0;
    for (let i = 0; i < this.quantity; i++) {
      if (this.cartService.addItem(this.product)) {
        addedCount++;
      } else {
        break; // Dừng nếu không thể thêm
      }
    }
    
    if (addedCount > 0) {
      if (typeof window !== 'undefined') {
        alert(`Đã thêm ${addedCount} ${this.product.unit || 'kg'} vào giỏ hàng`);
      }
    }
  }

  buyNow() {
    // Kiểm tra tồn kho
    if (!this.product.isInStock()) {
      if (typeof window !== 'undefined') {
        alert('Sản phẩm này đã hết hàng!');
      }
      return;
    }
    
    const productStock = typeof this.product.quantity === 'number' ? this.product.quantity : parseInt(String(this.product.quantity)) || 0;
    if (this.quantity > productStock) {
      if (typeof window !== 'undefined') {
        alert(`Sản phẩm chỉ còn ${productStock} ${this.product.unit || 'kg'}. Vui lòng chọn số lượng phù hợp!`);
      }
      this.quantity = productStock;
      return;
    }
    
    // Thêm vào giỏ hàng trước
    let addedCount = 0;
    for (let i = 0; i < this.quantity; i++) {
      if (this.cartService.addItem(this.product)) {
        addedCount++;
      } else {
        break;
      }
    }
    
    if (addedCount > 0) {
      this.router.navigate(['/order']);
    }
  }

  onQuantityChange() {
    // Đảm bảo quantity không vượt quá tồn kho
    if (!this.product.isInStock()) {
      this.quantity = 0;
      return;
    }
    
    const productStock = typeof this.product.quantity === 'number' ? this.product.quantity : parseInt(String(this.product.quantity)) || 0;
    if (this.quantity > productStock) {
      if (typeof window !== 'undefined') {
        alert(`Sản phẩm chỉ còn ${productStock} ${this.product.unit || 'kg'}.`);
      }
      this.quantity = productStock;
    }
    
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }

  getProductQuantity(): number | null {
    if (!this.product || !this.product.quantity) {
      return null;
    }
    return typeof this.product.quantity === 'number' 
      ? this.product.quantity 
      : parseInt(String(this.product.quantity)) || null;
  }

  // Helper method để chuyển đổi image path thành full URL
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return this.product.getDefaultImage();
    // Nếu đã là full URL (bắt đầu bằng http/https), trả về nguyên
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Nếu là relative path, thêm base URL từ backend
    // Đảm bảo có dấu / ở đầu nếu chưa có
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:3001${path}`;
  }
}
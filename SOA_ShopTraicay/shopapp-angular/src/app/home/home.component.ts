import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: string[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  page: number = 1;
  pageSize: number = 9;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories = [];
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.allProducts = [];
        this.products = [];
      }
    });
  }

  applyFilters(): void {
    let filtered = this.allProducts;

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        (product.description && product.description.toLowerCase().includes(search)) ||
        (product.category && product.category.toLowerCase().includes(search))
      );
    }

    this.products = filtered;
    this.page = 1;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  addToCart(product: Product): void {
    if (!product.isInStock()) {
      if (typeof window !== 'undefined') {
        alert('Sản phẩm này đã hết hàng!');
      }
      return;
    }
    
    if (this.cartService.addItem(product)) {
      this.router.navigate(['/order-confirm']);
    }
  }

  buyNow(product: Product): void {
    if (!product.isInStock()) {
      if (typeof window !== 'undefined') {
        alert('Sản phẩm này đã hết hàng!');
      }
      return;
    }
    
    if (this.cartService.addItem(product)) {
      this.router.navigate(['/order']);
    }
  }

  get pagedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.products.length / this.pageSize));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  viewDetail(product: Product): void {
  this.router.navigate(['/product', product.id]);
}

  goToDetail(productId: number) {
  this.router.navigate(['/product', productId]);
  }
}
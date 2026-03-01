import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3001/products'; // Product Service port 3001

  constructor(private http: HttpClient) { }

  // Lấy tất cả sản phẩm
  getProducts(): Observable<Product[]> {
    return this.http.get<{success: boolean, data: any[], count?: number}>(this.apiUrl).pipe(
      map(response => {
        // Backend trả về { success: true, data: [...], count: number }
        const products = (response.success && response.data) ? response.data : (Array.isArray(response) ? response : []);
        return products.map(item => new Product(item));
      })
    );
  }

  // Lấy sản phẩm theo ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const product = response.data || response;
        return new Product(product);
      })
    );
  }

  // Tìm kiếm sản phẩm (backend không có endpoint này, filter ở frontend)
  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  // Lọc sản phẩm theo danh mục
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/category/${encodeURIComponent(category)}`).pipe(
      map(response => {
        const products = response.data || response;
        return (Array.isArray(products) ? products : []).map(item => new Product(item));
      })
    );
  }

  // Lấy tất cả danh mục
  getCategories(): Observable<string[]> {
    return this.http.get<{success: boolean, data: string[]}>(`${this.apiUrl}/categories`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }

  // Thêm sản phẩm mới (CẦN JWT)
  addProduct(product: Product): Observable<Product> {
    const priceValue = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || '0')) || 0;
    const quantityValue = typeof product.quantity === 'number' ? product.quantity : parseInt(String(product.quantity || '0')) || 0;
    
    const productData = {
      name: product.name,
      description: product.description || '',
      category: product.category || '',
      unit_price: priceValue,
      quantity: quantityValue,
      unit: product.unit || 'kg',
      image_url: product.image || '',
      is_active: product.is_active !== false
    };
    return this.http.post<{success: boolean, data: any, message?: string}>(this.apiUrl, productData).pipe(
      map(response => {
        // Backend trả về { success: true, data: {...}, message: string }
        const productData = (response.success && response.data) ? response.data : response;
        return new Product(productData);
      })
    );
  }

  // Cập nhật sản phẩm (CẦN JWT)
  updateProduct(product: Product): Observable<Product> {
    const productData: any = {};
    if (product.name) productData.name = product.name;
    if (product.description !== undefined) productData.description = product.description;
    if (product.category !== undefined) productData.category = product.category;
    if (product.unit !== undefined) productData.unit = product.unit;
    if (product.price !== undefined) {
      productData.unit_price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price)) || 0;
    }
    if (product.quantity !== undefined) {
      productData.quantity = typeof product.quantity === 'number' ? product.quantity : parseInt(String(product.quantity)) || 0;
    }
    if (product.image !== undefined) productData.image_url = product.image;
    if (product.is_active !== undefined) productData.is_active = product.is_active;
    
    return this.http.put<{success: boolean, data: any, message?: string}>(`${this.apiUrl}/${product.id}`, productData).pipe(
      map(response => {
        // Backend trả về { success: true, data: {...}, message: string }
        const productData = (response.success && response.data) ? response.data : response;
        return new Product(productData);
      })
    );
  }

  // Xóa sản phẩm (CẦN JWT)
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${id}`);
  }

  // Đếm sản phẩm còn hàng (tính từ danh sách)
  getInStockCount(): Observable<{ status: string, total: number, products: any[] }> {
    return this.getProducts().pipe(
      map(products => {
        const inStock = products.filter(p => p.isInStock && p.isInStock());
        return {
          status: 'success',
          total: inStock.length,
          products: inStock
        };
      })
    );
  }

  // Đếm sản phẩm hết hàng (tính từ danh sách)
  getOutStockCount(): Observable<{ status: string, total: number, products: any[] }> {
    return this.getProducts().pipe(
      map(products => {
        const outOfStock = products.filter(p => !p.isInStock || !p.isInStock());
        return {
          status: 'success',
          total: outOfStock.length,
          products: outOfStock
        };
      })
    );
  }

  // Upload ảnh sản phẩm (backend không hỗ trợ, trả về mock)
  uploadImage(formData: FormData): Observable<{ imageUrl: string }> {
    // Backend không có endpoint upload, trả về mock URL
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ imageUrl: 'assets/default-product.png' });
        observer.complete();
      }, 100);
    });
  }

  // Upload nhiều ảnh sản phẩm (backend không hỗ trợ, trả về mock)
  uploadImages(formData: FormData): Observable<{ imageUrls: string[] }> {
    // Backend không có endpoint upload, trả về mock URLs
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ imageUrls: ['assets/default-product.png'] });
        observer.complete();
      }, 100);
    });
  }
}
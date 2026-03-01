import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  searchText: string = '';
  editMode: boolean = false;
  editingProduct: Product | null = null;
  products: Product[] = [];
  viewingProduct: Product | null = null;
  page: number = 1;
  pageSize: number = 5;
  categories: string[] = []; // Danh mục trái cây (Táo, Cam, Chuối, etc.)

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => {
          const product = new Product(p);
          // Cập nhật image URL nếu cần
          if (product.image) {
            // Nếu image không bắt đầu bằng http/https, thêm base URL
            if (!product.image.startsWith('http') && !product.image.startsWith('data:')) {
              // Nếu image bắt đầu bằng /, thêm localhost:3001
              if (product.image.startsWith('/')) {
                product.image = `http://localhost:3001${product.image}`;
              } else {
                // Nếu không có /, thêm / trước
                product.image = `http://localhost:3001/${product.image}`;
              }
            }
          } else {
            // Nếu không có image, dùng default
            product.image = product.getDefaultImage();
          }
          return product;
        });
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.products = [];
        if (typeof window !== 'undefined') {
          alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể tải danh sách sản phẩm.'));
        }
      }
    });
  }

  filteredProducts(): Product[] {
    const search = this.searchText.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search) ||
      (p.trademark && p.trademark.toLowerCase().includes(search))
    );
  }


  get pagedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts().length / this.pageSize);
  }

  addProduct() {
    this.editingProduct = new Product({
      id: 0,
      name: '',
      price: '0',
      category: '',
      unit: 'kg',
      is_active: true,
      image: '',
      images: [],
      quantity: '0',
      description: ''
    });
    this.editMode = true;
  }

  editProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.editingProduct = new Product({
        ...product,
        images: Array.isArray(product.images) ? [...product.images] : []
      });
      this.editMode = true;
    }
  }

  saveEdit() {
    if (!this.editingProduct) return;
    
    // Kiểm tra token trước khi lưu
    if (!this.authService.tokenValue) {
      if (typeof window !== 'undefined') {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }
    
    // Validation
    if (!this.editingProduct.name || !this.editingProduct.category) {
      if (typeof window !== 'undefined') {
        alert('Vui lòng điền đầy đủ tên sản phẩm và danh mục.');
      }
      return;
    }

    const saveObs = this.editingProduct.id === 0
      ? this.productService.addProduct(this.editingProduct)
      : this.productService.updateProduct(this.editingProduct);

    saveObs.subscribe({
      next: () => {
        this.fetchProducts();
        this.cancelEdit();
        if (typeof window !== 'undefined') {
          alert('Lưu thành công!');
        }
      },
      error: (err) => {
        console.error('Error saving product:', err);
        // Xử lý lỗi 401 - token không hợp lệ
        if (err.status === 401) {
          if (typeof window !== 'undefined') {
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          }
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          const errorMessage = err.error?.message || err.message || 'Không thể lưu sản phẩm.';
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + errorMessage);
          }
        }
      }
    });
  }

  deleteProduct(id: number) {
    // Kiểm tra token trước khi xóa
    if (!this.authService.tokenValue) {
      if (typeof window !== 'undefined') {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    if (typeof window !== 'undefined' && confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      console.log('Deleting product ID:', id);
      console.log('Token exists:', !!this.authService.tokenValue);
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          console.log('Delete product success:', response);
          this.fetchProducts();
          if (typeof window !== 'undefined') {
            alert('Xóa sản phẩm thành công!');
          }
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          console.error('Error details:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          
          // Xử lý lỗi 401 - token không hợp lệ
          if (err.status === 401) {
            if (typeof window !== 'undefined') {
              alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            // Tự động logout và redirect đến login
            this.authService.logout().subscribe(() => {
              this.router.navigate(['/login']);
            });
          } else {
            const errorMessage = err.error?.message || err.message || 'Không thể xóa sản phẩm.';
            if (typeof window !== 'undefined') {
              alert('Lỗi: ' + errorMessage);
            }
          }
        }
      });
    }
  }

  cancelEdit() {
    this.editingProduct = null;
    this.editMode = false;
  }

  // --- Image Upload ---
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Kiểm tra định dạng
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ cho phép ảnh JPG, PNG, WEBP, GIF!');
      return;
    }

      const formData = new FormData();
      formData.append('image', file);

      this.productService.uploadImage(formData).subscribe({
        next: (res: any) => {
          if (this.editingProduct) {
            const imageUrl = res.imageUrl && res.imageUrl.startsWith('http')
              ? res.imageUrl
              : `http://localhost:3001${res.imageUrl}`;
            this.editingProduct.image = imageUrl;
          }
        },
        error: (err: any) => {
          alert('Lỗi upload ảnh!');
          console.error(err);
        }
      });
    }
  }
  // --- Upload nhiều ảnh chi tiết ---
onMultiFileSelected(event: any) {
  const files: FileList = event.target.files;
  if (!this.editingProduct) return;
  if (!this.editingProduct.images) this.editingProduct.images = [];

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const formData = new FormData();
  let validFileCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (allowedTypes.includes(file.type)) {
      formData.append('images', file);
      validFileCount++;
    } else {
      alert(`File "${file.name}" không hợp lệ. Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF.`);
    }
  }

  if (validFileCount === 0) {
    alert('Không có ảnh hợp lệ để upload!');
    return;
  }

  this.productService.uploadImages(formData).subscribe({
    next: (res: any) => {
      const urls = (res.imageUrls || [])
        .filter((url: string) => !!url)
        .map((url: string) => url.startsWith('http') ? url : `http://localhost:3001${url}`);
      this.editingProduct!.images!.push(...urls);
    },
    error: (err: any) => {
      alert('Lỗi upload ảnh chi tiết!');
      console.error(err);
    }
  });
}


  // // Giả sử bạn đã có hàm uploadFile trả về Promise<string>
  // uploadFile(file: File): Promise<string> {
  //   const formData = new FormData();
  //   formData.append('images', file);
  //   return new Promise((resolve, reject) => {
  //     this.productService.uploadImage(formData).subscribe({
  //       next: (res) => {
  //         const imageUrl = res.imageUrl.startsWith('http')
  //           ? res.imageUrl
  //           : `http://localhost:3000${res.imageUrl}`;
  //         resolve(imageUrl);
  //       },
  //       error: (err) => {
  //         alert('Lỗi upload ảnh chi tiết!');
  //         reject(err);
  //       }
  //     });
  //   });
  // }


  removeDetailImage(index: number) {
    if (this.editingProduct && this.editingProduct.images) {
      this.editingProduct.images.splice(index, 1);
    }
  }

  // --- Modal Xem Chi Tiết ---
  viewDetail(product: Product) {
    this.viewingProduct = product;
  }

  closeDetail() {
    this.viewingProduct = null;
  }

  // Helper method để lấy full image URL
  getFullImageUrl(imagePath: string | undefined | null): string {
    if (!imagePath || imagePath.trim() === '') {
      return this.getDefaultImageUrl();
    }
    
    // Nếu đã là full URL (http/https), trả về nguyên
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Nếu là data URI, trả về nguyên
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    // Nếu là relative path, thêm base URL từ backend product service
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:3001${path}`;
  }

  // Helper method để lấy default image URL
  getDefaultImageUrl(): string {
    // Sử dụng data URI thay vì file asset để tránh 404
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  // Helper method để xử lý lỗi khi load ảnh
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.getDefaultImageUrl();
    }
  }

  
}
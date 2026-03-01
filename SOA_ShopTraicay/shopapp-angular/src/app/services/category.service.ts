import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  // Category Service chạy trên port 3000 (server chính) với route /api/categories
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  // Lấy danh sách categories
  getCategories(): Observable<Category[]> {
    return this.http.get<{success: boolean, data: any[], count?: number}>(this.apiUrl).pipe(
      map(response => {
        // Backend trả về { success: true, data: [...], count: number }
        const categories = (response.success && response.data) ? response.data : [];
        return categories.map((cat: any, index: number) => ({
          category_id: cat.id || cat.category_id || index + 1,
          name: cat.name || cat,
          description: cat.description || ''
        } as Category));
      }),
      catchError(err => {
        console.error('Error fetching categories:', err);
        // Fallback: thử lấy từ Product Service
        return this.http.get<{success: boolean, data: string[]}>('http://localhost:3001/products/categories').pipe(
          map(response => {
            const categories = response.data || response;
            return (Array.isArray(categories) ? categories : []).map((cat: string, index: number) => ({
              category_id: index + 1,
              name: cat,
              description: ''
            } as Category));
          })
        );
      })
    );
  }

  // Thêm category mới (CẦN JWT)
  addCategory(category: Category): Observable<Category> {
    const categoryData = {
      name: category.name,
      description: category.description || ''
    };
    return this.http.post<{success: boolean, data: any, message?: string}>(this.apiUrl, categoryData).pipe(
      map(response => {
        // Backend trả về { success: true, data: {...}, message: string }
        const categoryData = (response.success && response.data) ? response.data : response;
        return {
          category_id: categoryData.id || categoryData.category_id,
          name: categoryData.name,
          description: categoryData.description || ''
        } as Category;
      }),
      catchError(err => {
        console.error('Error adding category:', err);
        return throwError(() => err);
      })
    );
  }

  // Cập nhật category (CẦN JWT)
  updateCategory(category: Category): Observable<Category> {
    const categoryData: any = {};
    if (category.name) categoryData.name = category.name;
    if (category.description !== undefined) categoryData.description = category.description;

    return this.http.put<{success: boolean, data: any, message?: string}>(`${this.apiUrl}/${category.category_id}`, categoryData).pipe(
      map(response => {
        // Backend trả về { success: true, data: {...}, message: string }
        const categoryData = (response.success && response.data) ? response.data : response;
        return {
          category_id: categoryData.id || categoryData.category_id || category.category_id,
          name: categoryData.name,
          description: categoryData.description || ''
        } as Category;
      }),
      catchError(err => {
        console.error('Error updating category:', err);
        return throwError(() => err);
      })
    );
  }

  // Xóa category (CẦN JWT)
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error deleting category:', err);
        return throwError(() => err);
      })
    );
  }
}
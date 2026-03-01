import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = 'http://localhost:3000/users'; // Auth Service port 3000

    constructor(private http: HttpClient) { }

    // Lấy tổng số users (CẦN JWT)
    getTotalUsers(): Observable<{ total: number }> {
        return this.http.get<{success: boolean, total: number}>(`${this.apiUrl}/total`).pipe(
            map(response => {
                // Backend trả về { success: true, total: number }
                if (response.success) {
                    return { total: response.total || 0 };
                }
                return { total: 0 };
            })
        );
    }

    // Lấy tất cả users (CẦN JWT)
    getUsers(): Observable<User[]> {
        return this.http.get<{success: boolean, data: any[], count?: number}>(this.apiUrl).pipe(
            map(response => {
                // Backend trả về { success: true, data: [...], count: number }
                const users = (response.success && response.data) ? response.data : [];
                return users.map((item: any) => new User({
                    id: item.id,
                    username: item.username,
                    email: item.email || item.username,
                    role: item.role,
                    createdAt: item.createdAt || item.created_at,
                    updatedAt: item.updatedAt || item.updated_at
                }));
            })
        );
    }

    // Lấy user theo ID (CẦN JWT)
    getUserById(id: number): Observable<User> {
        return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/${id}`).pipe(
            map(response => {
                // Backend trả về { success: true, data: {...} }
                const userData = (response.success && response.data) ? response.data : response;
                return new User(userData);
            })
        );
    }

    // Thêm user mới (CẦN JWT) - dùng register endpoint
    addUser(user: User): Observable<User> {
        // Sử dụng register endpoint
        return this.http.post<{success: boolean, user: any, message?: string}>('http://localhost:3000/register', {
            userName: user.username || user.email,
            password: user.password || '123456', // Default password
            role: user.role || 'customer'
        }).pipe(
            map(response => {
                // Backend trả về { success: true, user: {...}, message: string }
                const userData = (response.success && response.user) ? response.user : response;
                return new User({
                    id: userData.id,
                    username: userData.username,
                    role: userData.role,
                    email: userData.username || userData.email
                });
            })
        );
    }

    // Cập nhật user (CẦN JWT)
    updateUser(user: User): Observable<User> {
        if (!user.id) {
            console.error('User ID is missing:', user);
            throw new Error('User ID is required for update');
        }

        const updateData: any = {};
        
        // Gửi username nếu có
        if (user.username && user.username.trim() !== '') {
            updateData.username = user.username.trim();
        }
        
        // Gửi email riêng (có thể khác với username)
        if (user.email !== undefined) {
            updateData.email = user.email.trim() || '';
        }
        
        // Chỉ gửi password nếu có (không bắt buộc khi sửa)
        if (user.password && user.password.trim() !== '') {
            updateData.password = user.password.trim();
        }

        if (user.role) {
            updateData.role = user.role;
        }  

        const url = `${this.apiUrl}/${user.id}`;
        console.log('Updating user - URL:', url);
        console.log('Updating user - Data:', updateData);
        console.log('Updating user - Full user object:', user);

        return this.http.put<{success: boolean, data: any, message?: string}>(url, updateData).pipe(
            map(response => {
                console.log('Update user response:', response);
                // Backend trả về { success: true, data: {...}, message: string }
                const userData = (response.success && response.data) ? response.data : response;
                return new User(userData);
            })
        );
    }

    // Xóa user (CẦN JWT)
    deleteUser(id: number): Observable<any> {
        return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${id}`);
    }
}
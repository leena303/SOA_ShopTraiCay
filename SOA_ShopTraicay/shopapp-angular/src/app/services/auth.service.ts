import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Auth Service port 3000
  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;

  constructor(private http: HttpClient) {
    // Load user and token from localStorage if exists (chỉ trên trình duyệt)
    let savedUser = null;
    let savedToken = null;
    if (typeof window !== 'undefined') {
      savedUser = localStorage.getItem('currentUser');
      savedToken = localStorage.getItem('jwt_token');
    }
    this.currentUserSubject = new BehaviorSubject<any | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.tokenSubject = new BehaviorSubject<string | null>(savedToken);
    this.token = this.tokenSubject.asObservable();
  }

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  public get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  register(userData: any): Observable<any> {
    // Backend yêu cầu: { userName, password }
    const registerData = {
      userName: userData.userName || userData.username || userData.email,
      password: userData.password
    };
    // Backend trả về { success: true, user: {...}, message: string }
    return this.http.post<{success: boolean, user: any, message: string}>(`${this.apiUrl}/register`, registerData);
  }

  login(credentials: any): Observable<any> {
    // Backend yêu cầu: { userName, password }
    // Frontend có thể gửi emailOrUsername, username, hoặc userName
    const loginData = {
      userName: credentials.userName || credentials.username || credentials.emailOrUsername,
      password: credentials.password
    };
    
    return this.http.post<{success: boolean, token: string, user: any, message: string}>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        // Backend trả về { success: true, token: string, user: {...}, message: string }
        // Store user details and token in localStorage (chỉ trên trình duyệt)
        if (response && response.success && typeof window !== 'undefined') {
          if (response.token) {
            localStorage.setItem('jwt_token', response.token);
            this.tokenSubject.next(response.token);
          }
          if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = this.tokenValue;
    // Luôn clear auth trước (để đảm bảo logout ngay cả khi API lỗi)
    this.clearAuth();
    
    if (token) {
      // Gọi API logout nếu backend hỗ trợ (nhưng không chặn nếu lỗi)
      return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
        tap(() => {
          // Auth đã được clear ở trên
        }),
        catchError(() => {
          // Nếu API logout lỗi, vẫn trả về success vì đã clear auth
          return of({ success: true, message: 'Đăng xuất thành công' });
        })
      );
    } else {
      // Không có token, trả về success ngay
      return of({ success: true, message: 'Đăng xuất thành công' });
    }
  }

  private clearAuth(): void {
    // Remove user and token from localStorage (chỉ trên trình duyệt)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('jwt_token');
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  // Kiểm tra đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!this.tokenValue && !!this.currentUserSubject.value;
  }

  // Xác thực token với backend
  authenticate(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth`, {});
  }
}
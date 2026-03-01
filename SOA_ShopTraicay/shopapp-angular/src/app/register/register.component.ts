import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FooterComponent, FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = '';
  agreeTerms: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  onRegister(): void {
    if (!this.email || !this.password || !this.confirmPassword || !this.username || !this.agreeTerms) {
      if (typeof window !== 'undefined') {
        alert('Vui lòng điền đầy đủ thông tin và đồng ý với điều kiện.');
      }
      return;
    }

    if (this.password !== this.confirmPassword) {
      if (typeof window !== 'undefined') {
        alert('Mật khẩu nhập lại không khớp.');
      }
      return;
    }

    // Backend chỉ cần userName và password
    const userData = {
      userName: this.username || this.email, // Ưu tiên username, nếu không có thì dùng email
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        if (typeof window !== 'undefined') {
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
        }
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        const errorMessage = error.error?.message || error.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        if (typeof window !== 'undefined') {
          alert(errorMessage);
        }
      }
    });
  }

  togglePasswordVisibility(fieldId: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    const icon = input.nextElementSibling as HTMLElement;
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  }

}

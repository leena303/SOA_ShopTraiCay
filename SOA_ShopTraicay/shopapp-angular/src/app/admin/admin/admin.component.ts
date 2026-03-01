import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  constructor(private router: Router, private authService: AuthService) { }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        if (typeof window !== 'undefined') {
          alert('Bạn đã đăng xuất thành công!');
        }
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Nếu logout API lỗi, vẫn clear local storage và redirect
        console.error('Logout error:', err);
        if (typeof window !== 'undefined') {
          alert('Bạn đã đăng xuất thành công!');
        }
        this.router.navigate(['/login']);
      }
    });
  }

}

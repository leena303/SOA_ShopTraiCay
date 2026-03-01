import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  currentUserSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

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

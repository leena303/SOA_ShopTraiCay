import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { OrderComponent } from "./order/order.component";
import { OrderConfirmComponent } from "./order-confirm/order-confirm.component";
import { LoginComponent } from "./login/login.component";
// Sửa đường dẫn import AdminComponent
import { AdminComponent } from "./admin/admin/admin.component";
import { CategoryComponent } from './admin/category/category.component';
import { CommonModule } from '@angular/common';
import { ProductComponent } from "./admin/product/product.component";
import { DashboardComponent } from "./admin/dashboard/dashboard.component";
import { UserComponent } from "./admin/user/user.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'shopapp-angular';
}
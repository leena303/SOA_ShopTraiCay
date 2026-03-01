import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { AdminComponent } from './admin/admin/admin.component';
import { ProductComponent } from './admin/product/product.component';
import { CategoryComponent } from './admin/category/category.component';
import { UserComponent } from './admin/user/user.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { OrderManagementComponent } from './admin/order-management/order-management.component';
import { PaymentManagementComponent } from './admin/payment-management/payment-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product/:id', component: DetailProductComponent }, 
  // { path: 'admin/orders/:id', component: OrderDetailComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order-confirm', component: OrderConfirmComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'payments', component: PaymentManagementComponent },
      { path: 'products', component: ProductComponent },
      { path: 'categories', component: CategoryComponent },
      { path: 'users', component: UserComponent }
    ]
  }
];

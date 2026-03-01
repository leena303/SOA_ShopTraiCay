import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: User[] = [];
  searchText: string = '';
  editMode: boolean = false;
  editingUser: User | null = null;
  selectedUser: User | null = null;
  loading: boolean = false;
  error: string | null = null;
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Kiểm tra đăng nhập trước khi fetch users
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchUsers();
  }

  fetchUsers() {
    // Kiểm tra lại token trước khi gọi API
    if (!this.authService.tokenValue) {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    this.loading = true;
    this.error = null;
    console.log('Fetching users... Token:', this.authService.tokenValue ? 'exists' : 'missing');

    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Users received:', users);
        this.users = users || [];
        this.loading = false;
        if (this.users.length === 0) {
          this.error = 'Không có người dùng nào trong hệ thống.';
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.users = []; // Set empty array if error
        this.loading = false;
        
        // Xử lý lỗi 401 (Unauthorized) - token không hợp lệ
        if (err.status === 401) {
          this.error = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          // Tự động logout và chuyển đến trang login
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.error = err.error?.message || err.message || 'Không thể tải danh sách người dùng.';
          // Các lỗi khác vẫn hiển thị thông báo
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + this.error);
          }
        }
      }
    });
  }

  get filteredUsers(): User[] {
    return this.users.filter(u =>
      (u.username?.toLowerCase() || '').includes(this.searchText.toLowerCase()) ||
      (u.email?.toLowerCase() || '').includes(this.searchText.toLowerCase())
    );
  }

  addUser() {
    this.editingUser = new User({
      id: 0,
      username: '',
      email: '',
      password: ''
    });
    this.editMode = true;
  }

  editUser(user: User) {
    console.log('Editing user:', user);
    this.editingUser = new User({ ...user });
    console.log('Editing user after copy:', this.editingUser);
    this.editMode = true;
  }

  saveUser(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    
    if (!this.editingUser) return;

    // Validation
    if (!this.editingUser.username || this.editingUser.username.trim() === '') {
      if (typeof window !== 'undefined') {
        alert('Vui lòng điền tên đăng nhập.');
      }
      return;
    }

    if (!this.editingUser.email || this.editingUser.email.trim() === '') {
      if (typeof window !== 'undefined') {
        alert('Vui lòng điền email.');
      }
      return;
    }

    // Nếu là user mới (id = 0 hoặc undefined), cần password
    if ((!this.editingUser.id || this.editingUser.id === 0) && (!this.editingUser.password || this.editingUser.password.trim() === '')) {
      if (typeof window !== 'undefined') {
        alert('Vui lòng nhập mật khẩu cho người dùng mới.');
      }
      return;
    }

    // Tạo object để gửi đi - đảm bảo username luôn có (kể cả khi không thay đổi)
    const userToSave: any = {
      id: this.editingUser.id
    };

    // Luôn gửi username (kể cả khi không thay đổi)
    if (this.editingUser.username && this.editingUser.username.trim() !== '') {
      userToSave.username = this.editingUser.username.trim();
    }

    // Luôn gửi email (kể cả khi không thay đổi)
    if (this.editingUser.email !== undefined) {
      userToSave.email = this.editingUser.email.trim() || '';
    }

    // Chỉ thêm password nếu có (khi sửa, password là optional)
    if (this.editingUser.password && this.editingUser.password.trim() !== '') {
      userToSave.password = this.editingUser.password.trim();
    }

    console.log('Saving user:', userToSave);
    console.log('Is new user?', !this.editingUser.id || this.editingUser.id === 0);
    
    const saveObs = (!this.editingUser.id || this.editingUser.id === 0)
      ? this.userService.addUser(userToSave)
      : this.userService.updateUser(userToSave);

    saveObs.subscribe({
      next: (result) => {
        console.log('Save user success:', result);
        this.fetchUsers();
        this.cancelEdit();
        if (typeof window !== 'undefined') {
          alert('Lưu thành công!');
        }
      },
      error: (err) => {
        console.error('Error saving user:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          errorBody: err.error
        });
        
        // Xử lý lỗi 401 - tự động chuyển đến trang login
        if (err.status === 401) {
          if (typeof window !== 'undefined') {
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          }
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          const errorMessage = err.error?.message || err.message || 'Không thể lưu người dùng.';
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + errorMessage);
          }
        }
      }
    });
  }

  cancelEdit() {
    this.editingUser = null;
    this.editMode = false;
  }

  deleteUser(id: number | undefined) {
    if (!id) return;
    if (typeof window !== 'undefined' && confirm('Bạn có chắc muốn xóa người dùng này?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.fetchUsers();
          if (typeof window !== 'undefined') {
            alert('Xóa người dùng thành công!');
          }
        },
        error: (err) => {
          // Xử lý lỗi 401 - tự động chuyển đến trang login
          if (err.status === 401) {
            this.authService.logout().subscribe(() => {
              this.router.navigate(['/login']);
            });
          } else {
            if (typeof window !== 'undefined') {
              alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể xóa người dùng.'));
            }
          }
        }
      });
    }
  }

  // Xem chi tiết người dùng
  viewUserDetail(user: User) {
    // Load chi tiết đầy đủ từ API
    if (user.id) {
      this.userService.getUserById(user.id).subscribe({
        next: (userDetail) => {
          this.selectedUser = userDetail;
        },
        error: (err) => {
          console.error('Error fetching user detail:', err);
          // Nếu lỗi, vẫn hiển thị thông tin từ user hiện tại
          this.selectedUser = new User({ ...user });
          if (typeof window !== 'undefined') {
            alert('Không thể tải chi tiết người dùng. Hiển thị thông tin cơ bản.');
          }
        }
      });
    } else {
      this.selectedUser = new User({ ...user });
    }
  }

  closeUserDetail() {
    this.selectedUser = null;
  }

  editUserFromDetail() {
    if (this.selectedUser) {
      this.editingUser = new User({ ...this.selectedUser });
      this.editMode = true;
      this.selectedUser = null; // Đóng modal chi tiết
    }
  }
}
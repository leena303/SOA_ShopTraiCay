import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-management.component.html',
  styleUrl: './payment-management.component.scss'
})
export class PaymentManagementComponent implements OnInit {
  payments: any[] = [];
  selectedPayment: any = null;
  processingPayment: any = null;
  searchText: string = '';
  
  // Filters
  statusFilter: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  
  // Statistics
  statistics: any = null;
  showStatistics: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 7;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.loadPayments();
    this.loadStatistics();
  }

  loadPayments() {
    const filters: any = {};
    if (this.statusFilter) filters.status = this.statusFilter;
    if (this.dateFrom) filters.date_from = this.dateFrom;
    if (this.dateTo) filters.date_to = this.dateTo;
    
    this.paymentService.getAllPayments(filters).subscribe({
      next: (data) => {
        this.payments = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error,
          url: err.url
        });
        this.payments = [];
        
        // Xử lý các loại lỗi khác nhau
        let errorMessage = 'Không thể tải danh sách thanh toán.';
        if (err.status === 0 || err.status === 404) {
          errorMessage = 'Không tìm thấy endpoint. Vui lòng kiểm tra Payment Service có đang chạy không (port 3000).';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        if (typeof window !== 'undefined') {
          alert('Lỗi: ' + errorMessage);
        }
      }
    });
  }

  loadStatistics() {
    const filters: any = {};
    if (this.dateFrom) filters.date_from = this.dateFrom;
    if (this.dateTo) filters.date_to = this.dateTo;
    
    this.paymentService.getPaymentStatistics(filters).subscribe({
      next: (data) => {
        this.statistics = data;
      },
      error: (err) => {
        console.error('Error fetching statistics:', err);
        // Không hiển thị alert cho statistics vì không quan trọng bằng payments list
        this.statistics = null;
      }
    });
  }

  viewPaymentDetail(payment: any) {
    const paymentId = payment.id || payment.payment_id;
    if (paymentId) {
      this.paymentService.getPaymentById(paymentId).subscribe({
        next: (detail) => {
          this.selectedPayment = detail;
        },
        error: (err) => {
          console.error('Error fetching payment detail:', err);
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể tải chi tiết thanh toán.'));
          }
        }
      });
    }
  }

  showActionMenu(payment: any) {
    this.processingPayment = payment;
  }

  confirmPayment(payment: any) {
    const paymentId = payment.id || payment.payment_id;
    if (paymentId) {
      this.paymentService.confirmPayment(paymentId).subscribe({
        next: () => {
          this.processingPayment = null;
          this.loadPayments();
          this.loadStatistics();
          if (typeof window !== 'undefined') {
            alert('Xác nhận thanh toán thành công!');
          }
        },
        error: (err) => {
          console.error('Error confirming payment:', err);
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể xác nhận thanh toán.'));
          }
        }
      });
    }
  }

  cancelPayment(payment: any) {
    const paymentId = payment.id || payment.payment_id;
    if (paymentId) {
      const notes = prompt('Nhập lý do hủy thanh toán:');
      if (notes !== null) {
        this.paymentService.cancelPayment(paymentId, notes).subscribe({
          next: () => {
            this.processingPayment = null;
            this.loadPayments();
            this.loadStatistics();
            if (typeof window !== 'undefined') {
              alert('Hủy thanh toán thành công!');
            }
          },
          error: (err) => {
            console.error('Error cancelling payment:', err);
            if (typeof window !== 'undefined') {
              alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể hủy thanh toán.'));
            }
          }
        });
      }
    }
  }

  deletePayment(payment: any) {
    const paymentId = payment.id || payment.payment_id;
    if (!paymentId) return;
    
    if (typeof window !== 'undefined' && confirm('Bạn có chắc muốn xóa thanh toán này?')) {
      this.paymentService.deletePayment(paymentId).subscribe({
        next: () => {
          this.loadPayments();
          this.loadStatistics();
          if (typeof window !== 'undefined') {
            alert('Xóa thanh toán thành công!');
          }
        },
        error: (err) => {
          console.error('Error deleting payment:', err);
          if (typeof window !== 'undefined') {
            alert('Lỗi: ' + (err.error?.message || err.message || 'Không thể xóa thanh toán.'));
          }
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'completed':
        return 'Đã thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      default:
        return status || 'Chờ xử lý';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-confirmed';
      case 'cancelled':
      case 'failed':
        return 'status-cancelled';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadPayments();
    this.loadStatistics();
  }

  clearFilters() {
    this.statusFilter = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.searchText = '';
    this.currentPage = 1;
    this.loadPayments();
    this.loadStatistics();
  }

  filteredPayments() {
    if (!this.searchText) return this.payments;
    const txt = this.searchText.toLowerCase();
    return this.payments.filter(payment =>
      (payment.payment_id && payment.payment_id.toString().includes(txt)) ||
      (payment.order_id && payment.order_id.toString().includes(txt)) ||
      (payment.payment_method && payment.payment_method.toLowerCase().includes(txt)) ||
      (payment.status && payment.status.toLowerCase().includes(txt)) ||
      (payment.amount && payment.amount.toString().includes(txt))
    );
  }

  get pagedPayments() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPayments().slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPayments().length / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }
}

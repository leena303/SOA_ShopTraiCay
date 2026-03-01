const Payment = require('../models/Payment');
const Order = require('../../order-service/models/Order');

class PaymentService {
  // Lấy tất cả thanh toán
  async getAllPayments(filters = {}) {
    try {
      return await Payment.getAll(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách thanh toán: ${error.message}`);
    }
  }

  // Lấy thanh toán theo ID
  async getPaymentById(id) {
    try {
      const payment = await Payment.getById(id);
      if (!payment) {
        throw new Error('Không tìm thấy thanh toán');
      }
      return payment;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thanh toán: ${error.message}`);
    }
  }

  // Lấy thanh toán theo order_id
  async getPaymentsByOrderId(orderId) {
    try {
      return await Payment.getByOrderId(orderId);
    } catch (error) {
      throw new Error(`Lỗi khi lấy thanh toán theo đơn hàng: ${error.message}`);
    }
  }

  // Tạo thanh toán mới (chỉ tiền mặt)
  async createPayment(paymentData) {
    try {
      const { order_id, amount, notes } = paymentData;

      if (!order_id || !amount) {
        throw new Error('order_id và amount là bắt buộc');
      }

      if (amount <= 0) {
        throw new Error('Số tiền thanh toán phải lớn hơn 0');
      }

      // Kiểm tra đơn hàng tồn tại
      const order = await Order.getById(order_id);
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      // Kiểm tra số tiền không vượt quá tổng đơn hàng
      if (parseFloat(amount) > parseFloat(order.total_amount)) {
        throw new Error('Số tiền thanh toán không được vượt quá tổng đơn hàng');
      }

      return await Payment.create({ order_id, amount, notes });
    } catch (error) {
      throw new Error(`Lỗi khi tạo thanh toán: ${error.message}`);
    }
  }

  // Cập nhật thanh toán
  async updatePayment(id, paymentData) {
    try {
      const existingPayment = await Payment.getById(id);
      if (!existingPayment) {
        throw new Error('Không tìm thấy thanh toán');
      }

      // Nếu cập nhật status thành completed, tự động cập nhật order payment_status
      if (paymentData.status === 'completed' && existingPayment.status !== 'completed') {
        await Order.update(existingPayment.order_id, { payment_status: 'paid' });
      }

      return await Payment.update(id, paymentData);
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật thanh toán: ${error.message}`);
    }
  }

  // Xác nhận thanh toán (chuyển status thành completed)
  async confirmPayment(id, changedBy = 'system') {
    try {
      const payment = await Payment.getById(id);
      if (!payment) {
        throw new Error('Không tìm thấy thanh toán');
      }

      if (payment.status === 'completed') {
        throw new Error('Thanh toán đã được xác nhận');
      }

      const updateData = {
        status: 'completed',
        changed_by: changedBy
      };

      return await this.updatePayment(id, updateData);
    } catch (error) {
      throw new Error(`Lỗi khi xác nhận thanh toán: ${error.message}`);
    }
  }

  // Hủy thanh toán
  async cancelPayment(id, notes = null, changedBy = 'system') {
    try {
      const payment = await Payment.getById(id);
      if (!payment) {
        throw new Error('Không tìm thấy thanh toán');
      }

      if (payment.status === 'completed') {
        throw new Error('Không thể hủy thanh toán đã hoàn thành');
      }

      const updateData = {
        status: 'cancelled',
        notes: notes || payment.notes,
        changed_by: changedBy
      };

      const updatedPayment = await this.updatePayment(id, updateData);

      // Kiểm tra xem tất cả payments của order này có bị hủy không
      // Nếu có, tự động hủy order (trừ khi order đã completed)
      try {
        const orderId = payment.order_id;
        const allPayments = await Payment.getByOrderId(orderId);
        const order = await Order.getById(orderId);
        
        if (order && order.status !== 'completed' && order.status !== 'cancelled') {
          // Kiểm tra xem tất cả payments có bị hủy hoặc cancelled không
          const allCancelled = allPayments.every(p => 
            p.status === 'cancelled' || p.status === 'failed'
          );
          
          if (allCancelled && allPayments.length > 0) {
            // Tất cả payments đều bị hủy, tự động hủy order
            await Order.update(orderId, { status: 'cancelled' });
            console.log(`Auto-cancelled order ${orderId} because all payments are cancelled`);
          }
        }
      } catch (orderError) {
        // Log warning nhưng không throw error để payment vẫn được hủy thành công
        console.warn('Error checking order status after payment cancellation:', orderError.message);
      }

      return updatedPayment;
    } catch (error) {
      throw new Error(`Lỗi khi hủy thanh toán: ${error.message}`);
    }
  }

  // Xóa thanh toán
  async deletePayment(id) {
    try {
      const payment = await Payment.getById(id);
      if (!payment) {
        throw new Error('Không tìm thấy thanh toán');
      }

      if (payment.status === 'completed') {
        throw new Error('Không thể xóa thanh toán đã hoàn thành');
      }

      return await Payment.delete(id);
    } catch (error) {
      throw new Error(`Lỗi khi xóa thanh toán: ${error.message}`);
    }
  }

  // Lấy lịch sử thanh toán
  async getPaymentHistory(paymentId) {
    try {
      return await Payment.getHistory(paymentId);
    } catch (error) {
      throw new Error(`Lỗi khi lấy lịch sử thanh toán: ${error.message}`);
    }
  }

  // Thống kê thanh toán
  async getPaymentStatistics(filters = {}) {
    try {
      return await Payment.getStatistics(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê thanh toán: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();


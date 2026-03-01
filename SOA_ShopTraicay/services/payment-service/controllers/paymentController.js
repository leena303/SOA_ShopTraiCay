const paymentService = require('../services/paymentService');

class PaymentController {
  async getAllPayments(req, res) {
    try {
      const filters = {
        status: req.query.status,
        order_id: req.query.order_id,
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };
      const payments = await paymentService.getAllPayments(filters);
      res.json({
        success: true,
        data: payments,
        count: payments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaymentById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaymentsByOrderId(req, res) {
    try {
      const payments = await paymentService.getPaymentsByOrderId(req.params.orderId);
      res.json({
        success: true,
        data: payments,
        count: payments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createPayment(req, res) {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo thanh toán thành công',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePayment(req, res) {
    try {
      const payment = await paymentService.updatePayment(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cập nhật thanh toán thành công',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async confirmPayment(req, res) {
    try {
      const { changed_by } = req.body;
      const payment = await paymentService.confirmPayment(
        req.params.id,
        changed_by
      );
      res.json({
        success: true,
        message: 'Xác nhận thanh toán thành công',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async cancelPayment(req, res) {
    try {
      const { notes, changed_by } = req.body;
      const payment = await paymentService.cancelPayment(
        req.params.id,
        notes,
        changed_by
      );
      res.json({
        success: true,
        message: 'Hủy thanh toán thành công',
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deletePayment(req, res) {
    try {
      await paymentService.deletePayment(req.params.id);
      res.json({
        success: true,
        message: 'Xóa thanh toán thành công'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaymentHistory(req, res) {
    try {
      const history = await paymentService.getPaymentHistory(req.params.id);
      res.json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaymentStatistics(req, res) {
    try {
      const filters = {
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };
      const stats = await paymentService.getPaymentStatistics(filters);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PaymentController();


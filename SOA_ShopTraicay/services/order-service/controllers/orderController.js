const orderService = require('../services/orderService');

class OrderController {
  async getAllOrders(req, res) {
    try {
      const filters = {
        status: req.query.status,
        customer_id: req.query.customer_id ? parseInt(req.query.customer_id) : undefined,
        customer_email: req.query.customer_email,
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };
      
      console.log('getAllOrders - Request query:', req.query);
      console.log('getAllOrders - Filters:', filters);
      
      const orders = await orderService.getAllOrders(filters);
      
      console.log('getAllOrders - Found orders:', orders.length);
      if (orders.length > 0) {
        console.log('getAllOrders - First order sample:', {
          id: orders[0].id,
          customer_id: orders[0].customer_id,
          customer_email: orders[0].customer_email
        });
      }
      
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('getAllOrders - Error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateOrder(req, res) {
    try {
      const order = await orderService.updateOrder(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cập nhật đơn hàng thành công',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteOrder(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message: 'ID đơn hàng không hợp lệ'
        });
      }
      
      await orderService.deleteOrder(orderId);
      res.json({
        success: true,
        message: 'Xóa đơn hàng thành công'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Không thể xóa đơn hàng'
      });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      
      console.log('updateOrderStatus - Request received:', {
        orderId,
        status,
        body: req.body,
        headers: req.headers
      });

      // Validate status
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái đơn hàng là bắt buộc'
        });
      }

      const order = await orderService.updateOrderStatus(orderId, status);
      console.log('updateOrderStatus - Success:', order);
      
      res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: order
      });
    } catch (error) {
      console.error('updateOrderStatus - Error:', error);
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOrderStatistics(req, res) {
    try {
      const filters = {
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };
      const stats = await orderService.getOrderStatistics(filters);
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

module.exports = new OrderController();


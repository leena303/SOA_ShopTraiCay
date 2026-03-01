const orderItemsService = require('../services/orderItemsService');

class OrderItemsController {
  async getAllOrderItems(req, res) {
    try {
      const filters = {
        order_id: req.query.order_id,
        product_id: req.query.product_id
      };

      const items = await orderItemsService.getAllOrderItems(filters);
      res.json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOrderItemById(req, res) {
    try {
      const item = await orderItemsService.getOrderItemById(req.params.id);
      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOrderItemsByOrderId(req, res) {
    try {
      const items = await orderItemsService.getOrderItemsByOrderId(req.params.orderId);
      res.json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createOrderItem(req, res) {
    try {
      const item = await orderItemsService.createOrderItem(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo order item thành công',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateOrderItem(req, res) {
    try {
      const item = await orderItemsService.updateOrderItem(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cập nhật order item thành công',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteOrderItem(req, res) {
    try {
      await orderItemsService.deleteOrderItem(req.params.id);
      res.json({
        success: true,
        message: 'Xóa order item thành công'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new OrderItemsController();


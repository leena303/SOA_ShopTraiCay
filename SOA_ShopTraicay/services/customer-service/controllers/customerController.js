const customerService = require('../services/customerService');

class CustomerController {
  async getAllCustomers(req, res) {
    try {
      const filters = {
        search: req.query.search
      };
      const customers = await customerService.getAllCustomers(filters);
      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCustomerById(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async createCustomer(req, res) {
    try {
      const customer = await customerService.createCustomer(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo khách hàng thành công',
        data: customer
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateCustomer(req, res) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cập nhật khách hàng thành công',
        data: customer
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteCustomer(req, res) {
    try {
      await customerService.deleteCustomer(req.params.id);
      res.json({
        success: true,
        message: 'Xóa khách hàng thành công'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOrderHistory(req, res) {
    try {
      const orders = await customerService.getOrderHistory(req.params.id);
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCustomerStatistics(req, res) {
    try {
      const stats = await customerService.getCustomerStatistics(req.params.id);
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

module.exports = new CustomerController();


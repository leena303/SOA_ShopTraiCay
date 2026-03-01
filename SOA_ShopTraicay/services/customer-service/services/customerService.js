const Customer = require('../models/Customer');

class CustomerService {
  // Lấy tất cả khách hàng
  async getAllCustomers(filters = {}) {
    try {
      return await Customer.getAll(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách khách hàng: ${error.message}`);
    }
  }

  // Lấy khách hàng theo ID
  async getCustomerById(id) {
    try {
      const customer = await Customer.getById(id);
      if (!customer) {
        throw new Error('Không tìm thấy khách hàng');
      }
      return customer;
    } catch (error) {
      throw new Error(`Lỗi khi lấy khách hàng: ${error.message}`);
    }
  }

  // Tạo khách hàng mới
  async createCustomer(customerData) {
    try {
      if (!customerData.name) {
        throw new Error('Tên khách hàng là bắt buộc');
      }

      // Kiểm tra email trùng lặp nếu có
      if (customerData.email) {
        const existing = await Customer.getAll({ search: customerData.email });
        const emailExists = existing.some(c => c.email === customerData.email);
        if (emailExists) {
          throw new Error('Email đã tồn tại');
        }
      }

      return await Customer.create(customerData);
    } catch (error) {
      throw new Error(`Lỗi khi tạo khách hàng: ${error.message}`);
    }
  }

  // Cập nhật khách hàng
  async updateCustomer(id, customerData) {
    try {
      const existingCustomer = await Customer.getById(id);
      if (!existingCustomer) {
        throw new Error('Không tìm thấy khách hàng');
      }

      // Kiểm tra email trùng lặp nếu có
      if (customerData.email && customerData.email !== existingCustomer.email) {
        const existing = await Customer.getAll({ search: customerData.email });
        const emailExists = existing.some(c => c.email === customerData.email && c.id !== parseInt(id));
        if (emailExists) {
          throw new Error('Email đã tồn tại');
        }
      }

      return await Customer.update(id, customerData);
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật khách hàng: ${error.message}`);
    }
  }

  // Xóa khách hàng
  async deleteCustomer(id) {
    try {
      const customer = await Customer.getById(id);
      if (!customer) {
        throw new Error('Không tìm thấy khách hàng');
      }

      return await Customer.delete(id);
    } catch (error) {
      throw new Error(`Lỗi khi xóa khách hàng: ${error.message}`);
    }
  }

  // Lấy lịch sử đơn hàng
  async getOrderHistory(customerId) {
    try {
      return await Customer.getOrderHistory(customerId);
    } catch (error) {
      throw new Error(`Lỗi khi lấy lịch sử đơn hàng: ${error.message}`);
    }
  }

  // Lấy thống kê khách hàng
  async getCustomerStatistics(customerId) {
    try {
      return await Customer.getStatistics(customerId);
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê khách hàng: ${error.message}`);
    }
  }
}

module.exports = new CustomerService();


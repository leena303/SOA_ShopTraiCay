const pool = require('../../config/database');

class Customer {
  // Lấy tất cả khách hàng
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (filters.search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Lấy khách hàng theo ID
  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Tạo khách hàng mới
  static async create(customerData) {
    const { name, email, phone, address } = customerData;

    const [result] = await pool.execute(
      `INSERT INTO customers (name, email, phone, address)
       VALUES (?, ?, ?, ?)`,
      [name, email, phone, address]
    );

    return this.getById(result.insertId);
  }

  // Cập nhật khách hàng
  static async update(id, customerData) {
    const fields = [];
    const values = [];

    Object.keys(customerData).forEach(key => {
      if (customerData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(customerData[key]);
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Xóa khách hàng
  static async delete(id) {
    await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
    return { message: 'Khách hàng đã được xóa' };
  }

  // Lấy lịch sử đơn hàng của khách hàng
  static async getOrderHistory(customerId) {
    const [rows] = await pool.execute(
      `SELECT o.*, 
       (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
       FROM orders o
       WHERE o.customer_id = ?
       ORDER BY o.created_at DESC`,
      [customerId]
    );
    return rows;
  }

  // Thống kê khách hàng
  static async getStatistics(customerId) {
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        AVG(o.total_amount) as average_order_value,
        MAX(o.created_at) as last_order_date
       FROM orders o
       WHERE o.customer_id = ?`,
      [customerId]
    );
    return stats[0];
  }
}

module.exports = Customer;


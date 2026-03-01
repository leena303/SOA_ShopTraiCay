const pool = require('../../config/database');

class Order {
  // Tạo số đơn hàng duy nhất
  static generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  // Lấy tất cả đơn hàng
  static async getAll(filters = {}) {
    let query = `
      SELECT o.*, 
             COALESCE(o.customer_name, c.name) as customer_name,
             COALESCE(o.customer_email, c.email) as customer_email,
             c.phone as customer_phone,
             (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND o.status = ?';
      params.push(filters.status);
    }

    if (filters.customer_id) {
      query += ' AND o.customer_id = ?';
      params.push(filters.customer_id);
    }

    if (filters.customer_email) {
      query += ' AND o.customer_email = ?';
      params.push(filters.customer_email);
    }

    if (filters.date_from) {
      query += ' AND DATE(o.created_at) >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ' AND DATE(o.created_at) <= ?';
      params.push(filters.date_to);
    }

    query += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Lấy đơn hàng theo ID
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT o.*, 
              c.name as customer_name, c.email as customer_email, c.phone as customer_phone
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Tạo đơn hàng mới
  static async create(orderData) {
    const {
      customer_id,
      customer_name,      // Yêu cầu BTH4
      customer_email,    // Yêu cầu BTH4
      order_number,
      total_amount,
      status = 'pending',
      payment_method,
      payment_status = 'pending',
      notes
    } = orderData;

    // Nếu có customer_id, lấy customer_name và customer_email từ bảng customers
    let finalCustomerName = customer_name;
    let finalCustomerEmail = customer_email;

    if (customer_id && (!customer_name || !customer_email)) {
      const [customers] = await pool.execute(
        'SELECT name, email FROM customers WHERE id = ?',
        [customer_id]
      );
      if (customers.length > 0) {
        finalCustomerName = finalCustomerName || customers[0].name;
        finalCustomerEmail = finalCustomerEmail || customers[0].email;
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO orders (customer_id, customer_name, customer_email, order_number, total_amount, status, payment_method, payment_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, finalCustomerName, finalCustomerEmail, order_number, total_amount, status, payment_method, payment_status, notes]
    );

    return this.getById(result.insertId);
  }

  // Cập nhật đơn hàng
  static async update(id, orderData) {
    const fields = [];
    const values = [];

    Object.keys(orderData).forEach(key => {
      if (orderData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(orderData[key]);
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Xóa đơn hàng
  static async delete(id) {
    await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
    return { message: 'Đơn hàng đã được xóa' };
  }

  // Lấy chi tiết đơn hàng (items)
  static async getOrderItems(orderId) {
    const [rows] = await pool.execute(
      `SELECT oi.*, 
              COALESCE(oi.product_name, p.name) as product_name,
              COALESCE(oi.total_price, oi.subtotal) as total_price,
              p.unit, p.category, p.image_url, p.unit_price as product_price
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?
       ORDER BY oi.id`,
      [orderId]
    );
    return rows;
  }

  // Thêm item vào đơn hàng
  static async addOrderItem(orderId, itemData) {
    const { product_id, product_name, quantity, unit_price, subtotal, total_price } = itemData;

    // Lấy product_name nếu chưa có
    let finalProductName = product_name;
    if (!finalProductName && product_id) {
      const [products] = await pool.execute(
        'SELECT name FROM products WHERE id = ?',
        [product_id]
      );
      if (products.length > 0) {
        finalProductName = products[0].name;
      }
    }

    // Sử dụng total_price nếu có, nếu không dùng subtotal
    const finalTotalPrice = total_price !== undefined ? total_price : subtotal;

    const [result] = await pool.execute(
      `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, product_id, finalProductName, quantity, unit_price, subtotal || finalTotalPrice, finalTotalPrice]
    );

    return result.insertId;
  }

  // Xóa item khỏi đơn hàng
  static async removeOrderItem(itemId) {
    await pool.execute('DELETE FROM order_items WHERE id = ?', [itemId]);
    return { message: 'Item đã được xóa' };
  }

  // Tính lại tổng tiền đơn hàng
  static async recalculateTotal(orderId) {
    const [rows] = await pool.execute(
      'SELECT SUM(subtotal) as total FROM order_items WHERE order_id = ?',
      [orderId]
    );

    const total = rows[0].total || 0;
    await this.update(orderId, { total_amount: total });
    return total;
  }

  // Thống kê đơn hàng
  static async getStatistics(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders
      WHERE 1=1
    `;
    const params = [];

    if (filters.date_from) {
      query += ' AND DATE(created_at) >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ' AND DATE(created_at) <= ?';
      params.push(filters.date_to);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0];
  }
}

module.exports = Order;


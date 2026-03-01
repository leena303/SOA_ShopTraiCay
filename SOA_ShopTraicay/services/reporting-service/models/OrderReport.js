const pool = require('../../config/database');

class OrderReport {
  // Lấy tất cả báo cáo đơn hàng
  static async getAll(filters = {}) {
    let query = `
      SELECT or.*, 
             o.order_number,
             o.status as order_status,
             o.customer_name,
             o.customer_email,
             o.total_amount as order_total_amount
      FROM orders_reports or
      INNER JOIN orders o ON or.order_id = o.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.order_id) {
      query += ' AND or.order_id = ?';
      params.push(filters.order_id);
    }

    if (filters.date_from) {
      query += ' AND DATE(or.created_at) >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ' AND DATE(or.created_at) <= ?';
      params.push(filters.date_to);
    }

    query += ' ORDER BY or.created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Lấy báo cáo đơn hàng theo ID
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT or.*, 
              o.order_number,
              o.status as order_status,
              o.customer_name,
              o.customer_email,
              o.total_amount as order_total_amount
       FROM orders_reports or
       INNER JOIN orders o ON or.order_id = o.id
       WHERE or.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  // Lấy báo cáo đơn hàng theo order_id
  static async getByOrderId(orderId) {
    const [rows] = await pool.execute(
      `SELECT or.*, 
              o.order_number,
              o.status as order_status,
              o.customer_name,
              o.customer_email,
              o.total_amount as order_total_amount
       FROM orders_reports or
       INNER JOIN orders o ON or.order_id = o.id
       WHERE or.order_id = ?`,
      [orderId]
    );

    return rows;
  }

  // Tạo báo cáo đơn hàng mới
  static async create(reportData) {
    const { order_id, total_revenue, total_cost, total_profit } = reportData;

    const [result] = await pool.execute(
      `INSERT INTO orders_reports (order_id, total_revenue, total_cost, total_profit)
       VALUES (?, ?, ?, ?)`,
      [order_id, total_revenue, total_cost, total_profit]
    );

    return this.getById(result.insertId);
  }

  // Cập nhật báo cáo đơn hàng
  static async update(id, reportData) {
    const { total_revenue, total_cost, total_profit } = reportData;
    const fields = [];
    const values = [];

    if (total_revenue !== undefined) {
      fields.push('total_revenue = ?');
      values.push(total_revenue);
    }

    if (total_cost !== undefined) {
      fields.push('total_cost = ?');
      values.push(total_cost);
    }

    if (total_profit !== undefined) {
      fields.push('total_profit = ?');
      values.push(total_profit);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    await pool.execute(
      `UPDATE orders_reports SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Xóa báo cáo đơn hàng
  static async delete(id) {
    await pool.execute('DELETE FROM orders_reports WHERE id = ?', [id]);
    return { message: 'Báo cáo đơn hàng đã được xóa' };
  }
}

module.exports = OrderReport;


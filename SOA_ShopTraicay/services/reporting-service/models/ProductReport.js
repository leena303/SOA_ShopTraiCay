const pool = require('../../config/database');

class ProductReport {
  // Lấy tất cả báo cáo sản phẩm
  static async getAll(filters = {}) {
    let query = `
      SELECT pr.*, 
             p.name as product_name,
             p.category,
             or.order_id,
             o.order_number
      FROM product_reports pr
      INNER JOIN orders_reports or ON pr.order_report_id = or.id
      INNER JOIN orders o ON or.order_id = o.id
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.product_id) {
      query += ' AND pr.product_id = ?';
      params.push(filters.product_id);
    }

    if (filters.order_report_id) {
      query += ' AND pr.order_report_id = ?';
      params.push(filters.order_report_id);
    }

    if (filters.date_from) {
      query += ' AND DATE(pr.created_at) >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ' AND DATE(pr.created_at) <= ?';
      params.push(filters.date_to);
    }

    query += ' ORDER BY pr.created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Lấy báo cáo sản phẩm theo ID
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT pr.*, 
              p.name as product_name,
              p.category,
              or.order_id,
              o.order_number
       FROM product_reports pr
       INNER JOIN orders_reports or ON pr.order_report_id = or.id
       INNER JOIN orders o ON or.order_id = o.id
       LEFT JOIN products p ON pr.product_id = p.id
       WHERE pr.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  // Lấy báo cáo sản phẩm theo product_id (tổng hợp)
  static async getByProductId(productId) {
    const [rows] = await pool.execute(
      `SELECT 
         pr.product_id,
         p.name as product_name,
         SUM(pr.total_sold) as total_sold,
         SUM(pr.revenue) as total_revenue,
         SUM(pr.cost) as total_cost,
         SUM(pr.profit) as total_profit
       FROM product_reports pr
       LEFT JOIN products p ON pr.product_id = p.id
       WHERE pr.product_id = ?
       GROUP BY pr.product_id, p.name`,
      [productId]
    );

    return rows[0] || null;
  }

  // Tạo báo cáo sản phẩm mới
  static async create(reportData) {
    const { order_report_id, product_id, total_sold, revenue, cost, profit } = reportData;

    const [result] = await pool.execute(
      `INSERT INTO product_reports (order_report_id, product_id, total_sold, revenue, cost, profit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order_report_id, product_id, total_sold, revenue, cost, profit]
    );

    return this.getById(result.insertId);
  }

  // Cập nhật báo cáo sản phẩm
  static async update(id, reportData) {
    const { total_sold, revenue, cost, profit } = reportData;
    const fields = [];
    const values = [];

    if (total_sold !== undefined) {
      fields.push('total_sold = ?');
      values.push(total_sold);
    }

    if (revenue !== undefined) {
      fields.push('revenue = ?');
      values.push(revenue);
    }

    if (cost !== undefined) {
      fields.push('cost = ?');
      values.push(cost);
    }

    if (profit !== undefined) {
      fields.push('profit = ?');
      values.push(profit);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    await pool.execute(
      `UPDATE product_reports SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Xóa báo cáo sản phẩm
  static async delete(id) {
    await pool.execute('DELETE FROM product_reports WHERE id = ?', [id]);
    return { message: 'Báo cáo sản phẩm đã được xóa' };
  }

  // Lấy báo cáo sản phẩm theo order_report_id
  static async getByOrderReportId(orderReportId) {
    const [rows] = await pool.execute(
      `SELECT pr.*, 
              p.name as product_name,
              p.category
       FROM product_reports pr
       LEFT JOIN products p ON pr.product_id = p.id
       WHERE pr.order_report_id = ?`,
      [orderReportId]
    );

    return rows;
  }
}

module.exports = ProductReport;


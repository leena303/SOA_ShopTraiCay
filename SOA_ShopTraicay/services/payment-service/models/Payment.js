const pool = require('../../config/database');

class Payment {
  // Lấy tất cả thanh toán
  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, o.order_number, o.total_amount as order_total, o.status as order_status,
             c.name as customer_name
      FROM payments p
      INNER JOIN orders o ON p.order_id = o.id
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND p.status = ?';
      params.push(filters.status);
    }


    if (filters.order_id) {
      query += ' AND p.order_id = ?';
      params.push(filters.order_id);
    }

    if (filters.date_from) {
      query += ' AND DATE(p.created_at) >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += ' AND DATE(p.created_at) <= ?';
      params.push(filters.date_to);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Lấy thanh toán theo ID
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, o.order_number, o.total_amount as order_total, o.status as order_status,
              c.name as customer_name, c.email as customer_email
       FROM payments p
       INNER JOIN orders o ON p.order_id = o.id
       LEFT JOIN customers c ON o.customer_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Lấy thanh toán theo order_id
  static async getByOrderId(orderId) {
    const [rows] = await pool.execute(
      'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC',
      [orderId]
    );
    return rows;
  }

  // Tạo thanh toán mới (chỉ tiền mặt)
  static async create(paymentData) {
    const {
      order_id,
      amount,
      status = 'pending',
      notes
    } = paymentData;

    const [result] = await pool.execute(
      `INSERT INTO payments (order_id, amount, status, notes)
       VALUES (?, ?, ?, ?)`,
      [order_id, amount, status, notes]
    );

    return this.getById(result.insertId);
  }

  // Cập nhật thanh toán
  static async update(id, paymentData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Lấy trạng thái hiện tại
      const [current] = await connection.execute(
        'SELECT status FROM payments WHERE id = ?',
        [id]
      );

      const oldStatus = current[0]?.status;
      const newStatus = paymentData.status;

      // Cập nhật thanh toán
      const fields = [];
      const values = [];

      Object.keys(paymentData).forEach(key => {
        if (paymentData[key] !== undefined && key !== 'changed_by') {
          fields.push(`${key} = ?`);
          values.push(paymentData[key]);
        }
      });

      if (fields.length > 0) {
        // Nếu status thay đổi thành completed, cập nhật payment_date
        if (newStatus === 'completed' && oldStatus !== 'completed') {
          fields.push('payment_date = NOW()');
        }

        values.push(id);
        await connection.execute(
          `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`,
          values
        );
      }

      // Ghi lại lịch sử nếu status thay đổi
      if (newStatus && newStatus !== oldStatus) {
        await connection.execute(
          `INSERT INTO payment_history (payment_id, status_from, status_to, changed_by, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [id, oldStatus, newStatus, paymentData.changed_by || 'system', paymentData.notes || null]
        );
      }

      await connection.commit();
      return this.getById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Xóa thanh toán
  static async delete(id) {
    await pool.execute('DELETE FROM payments WHERE id = ?', [id]);
    return { message: 'Thanh toán đã được xóa' };
  }

  // Lấy lịch sử thanh toán
  static async getHistory(paymentId) {
    const [rows] = await pool.execute(
      'SELECT * FROM payment_history WHERE payment_id = ? ORDER BY created_at DESC',
      [paymentId]
    );
    return rows;
  }

  // Thống kê thanh toán
  static async getStatistics(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_payments,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count
      FROM payments
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

module.exports = Payment;


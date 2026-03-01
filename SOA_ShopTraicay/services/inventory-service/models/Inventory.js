const pool = require('../../config/database');

class Inventory {
  // Lấy tất cả kho hàng
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT i.*, p.name as product_name, p.unit_price, p.unit, p.category
      FROM inventory i
      INNER JOIN products p ON i.product_id = p.id
      ORDER BY i.updated_at DESC
    `);
    return rows;
  }

  // Lấy kho hàng theo product_id
  static async getByProductId(productId) {
    const [rows] = await pool.execute(`
      SELECT i.*, p.name as product_name, p.unit_price, p.unit, p.category
      FROM inventory i
      INNER JOIN products p ON i.product_id = p.id
      WHERE i.product_id = ?
    `, [productId]);
    return rows[0];
  }

  // Lấy kho hàng theo ID
  static async getById(id) {
    const [rows] = await pool.execute(`
      SELECT i.*, p.name as product_name, p.unit_price, p.unit, p.category
      FROM inventory i
      INNER JOIN products p ON i.product_id = p.id
      WHERE i.id = ?
    `, [id]);
    return rows[0];
  }

  // Tạo hoặc cập nhật kho hàng
  static async upsert(inventoryData) {
    const {
      product_id,
      quantity,
      min_stock_level = 0,
      max_stock_level,
      location
    } = inventoryData;

    // Kiểm tra xem đã tồn tại chưa
    const existing = await this.getByProductId(product_id);

    if (existing) {
      // Cập nhật
      await pool.execute(
        `UPDATE inventory 
         SET quantity = ?, min_stock_level = ?, max_stock_level = ?, location = ?
         WHERE product_id = ?`,
        [quantity, min_stock_level, max_stock_level, location, product_id]
      );
      return this.getByProductId(product_id);
    } else {
      // Tạo mới
      const [result] = await pool.execute(
        `INSERT INTO inventory (product_id, quantity, min_stock_level, max_stock_level, location)
         VALUES (?, ?, ?, ?, ?)`,
        [product_id, quantity, min_stock_level, max_stock_level, location]
      );
      return this.getById(result.insertId);
    }
  }

  // Cập nhật số lượng tồn kho
  static async updateQuantity(productId, quantity, transactionType = 'adjustment', referenceType = null, referenceId = null, notes = null) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Cập nhật số lượng
      await connection.execute(
        'UPDATE inventory SET quantity = ? WHERE product_id = ?',
        [quantity, productId]
      );

      // Ghi lại transaction
      await connection.execute(
        `INSERT INTO inventory_transactions 
         (product_id, transaction_type, quantity, reference_type, reference_id, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [productId, transactionType, quantity, referenceType, referenceId, notes]
      );

      // Cập nhật last_restocked_at nếu là nhập kho
      if (transactionType === 'in') {
        await connection.execute(
          'UPDATE inventory SET last_restocked_at = NOW() WHERE product_id = ?',
          [productId]
        );
      }

      await connection.commit();
      return this.getByProductId(productId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Nhập kho
  static async stockIn(productId, quantity, notes = null) {
    const current = await this.getByProductId(productId);
    if (!current) {
      throw new Error('Sản phẩm chưa có trong kho');
    }
    const newQuantity = parseFloat(current.quantity) + parseFloat(quantity);
    return this.updateQuantity(productId, newQuantity, 'in', null, null, notes);
  }

  // Xuất kho
  static async stockOut(productId, quantity, referenceType = null, referenceId = null, notes = null) {
    const current = await this.getByProductId(productId);
    if (!current) {
      throw new Error('Sản phẩm chưa có trong kho');
    }
    const newQuantity = parseFloat(current.quantity) - parseFloat(quantity);
    if (newQuantity < 0) {
      throw new Error('Số lượng tồn kho không đủ');
    }
    return this.updateQuantity(productId, newQuantity, 'out', referenceType, referenceId, notes);
  }

  // Lấy sản phẩm sắp hết hàng
  static async getLowStock() {
    const [rows] = await pool.execute(`
      SELECT i.*, p.name as product_name, p.unit_price, p.unit, p.category
      FROM inventory i
      INNER JOIN products p ON i.product_id = p.id
      WHERE i.quantity <= i.min_stock_level
      ORDER BY i.quantity ASC
    `);
    return rows;
  }

  // Lấy lịch sử giao dịch kho
  static async getTransactions(filters = {}) {
    let query = `
      SELECT it.*, p.name as product_name
      FROM inventory_transactions it
      INNER JOIN products p ON it.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.product_id) {
      query += ' AND it.product_id = ?';
      params.push(filters.product_id);
    }

    if (filters.transaction_type) {
      query += ' AND it.transaction_type = ?';
      params.push(filters.transaction_type);
    }

    query += ' ORDER BY it.created_at DESC LIMIT 100';

    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

module.exports = Inventory;


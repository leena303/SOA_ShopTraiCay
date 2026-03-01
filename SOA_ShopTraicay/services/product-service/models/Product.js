const pool = require('../../config/database');

class Product {
  // Lấy tất cả sản phẩm
  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, 
        p.unit_price as price,
        COALESCE(p.quantity, 0) as quantity,
        c.name as category_name, 
        c.id as category_id_ref
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category) {
      query += ' AND (p.category = ? OR c.name = ?)';
      params.push(filters.category, filters.category);
    }

    if (filters.category_id) {
      query += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.is_active !== undefined) {
      query += ' AND p.is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Lấy sản phẩm theo ID
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, 
        p.unit_price as price,
        COALESCE(p.quantity, 0) as quantity,
        c.name as category_name, 
        c.id as category_id_ref
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Tạo sản phẩm mới
  static async create(productData) {
    const {
      name,
      description,
      category,
      price,           // Yêu cầu BTH3 (mới)
      unit_price,      // Giữ để tương thích với database hiện tại
      quantity = 0,    // Yêu cầu BTH3
      unit = 'kg',
      image_url,
      is_active = true
    } = productData;

    // Sử dụng price nếu có, nếu không dùng unit_price (tương thích)
    const finalPrice = price !== undefined ? price : unit_price;

    // Tạo sản phẩm với quantity (nếu cột tồn tại)
    const [result] = await pool.execute(
      `INSERT INTO products (name, description, category, unit_price, quantity, unit, image_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category, finalPrice, quantity || 0, unit, image_url, is_active]
    );

    return this.getById(result.insertId);
  }

  // Cập nhật sản phẩm
  static async update(id, productData) {
    const fields = [];
    const values = [];

    Object.keys(productData).forEach(key => {
      if (productData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(productData[key]);
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Xóa sản phẩm (hard delete - xóa hoàn toàn khỏi database)
  static async delete(id) {
    const productId = parseInt(id);
    if (isNaN(productId)) {
      throw new Error('ID sản phẩm không hợp lệ');
    }
    
    // Kiểm tra sản phẩm có tồn tại không
    const product = await this.getById(productId);
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    
    // Xóa hoàn toàn khỏi database
    await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [productId]
    );
    return { message: 'Sản phẩm đã được xóa hoàn toàn' };
  }

  // Lấy sản phẩm theo danh mục
  static async getByCategory(category) {
    const [rows] = await pool.execute(
      `SELECT p.*, 
        p.unit_price as price,
        COALESCE(p.quantity, 0) as quantity,
        c.name as category_name, 
        c.id as category_id_ref
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE (p.category = ? OR c.name = ?) AND p.is_active = TRUE`,
      [category, category]
    );
    return rows;
  }

  // Lấy tất cả danh mục (từ bảng categories)
  static async getCategories() {
    try {
      // Lấy từ bảng categories
      const [categoryRows] = await pool.execute(
        'SELECT name FROM categories WHERE is_active = TRUE ORDER BY name ASC'
      );
      if (categoryRows && categoryRows.length > 0) {
        return categoryRows.map(row => row.name);
      }
    } catch (error) {
      // Nếu bảng categories không tồn tại hoặc lỗi, lấy từ products
      console.log('Lỗi khi lấy từ categories, lấy từ products:', error.message);
    }
    
    // Fallback: Lấy từ bảng products (DISTINCT category)
    const [rows] = await pool.execute(
      'SELECT DISTINCT category as name FROM products WHERE category IS NOT NULL AND category != "" AND is_active = TRUE ORDER BY category ASC'
    );
    return rows.map(row => row.name);
  }
}

module.exports = Product;


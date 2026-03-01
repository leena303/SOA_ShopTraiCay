const pool = require('../../config/database');

class Category {
  // Lấy tất cả danh mục
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM categories WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.search) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.search}%`);
    }

    query += ' ORDER BY name ASC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Lấy danh mục theo ID
  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Lấy danh mục theo tên
  static async getByName(name) {
    const [rows] = await pool.execute(
      'SELECT * FROM categories WHERE name = ?',
      [name]
    );
    return rows[0];
  }

  // Tạo danh mục mới
  static async create(categoryData) {
    const {
      name,
      description,
      is_active = true
    } = categoryData;

    const [result] = await pool.execute(
      `INSERT INTO categories (name, description, is_active)
       VALUES (?, ?, ?)`,
      [name, description, is_active]
    );

    return this.getById(result.insertId);
  }

  // Cập nhật danh mục
  static async update(id, categoryData) {
    const fields = [];
    const values = [];

    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(categoryData[key]);
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Xóa danh mục (hard delete - xóa hoàn toàn khỏi database)
  static async delete(id) {
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      throw new Error('ID danh mục không hợp lệ');
    }
    
    // Kiểm tra danh mục có tồn tại không
    const category = await this.getById(categoryId);
    if (!category) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Xóa hoàn toàn khỏi database
    await pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [categoryId]
    );
    return { message: 'Danh mục đã được xóa hoàn toàn' };
  }

  // Lấy số lượng sản phẩm trong mỗi danh mục
  static async getProductCounts() {
    const [rows] = await pool.execute(`
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id, c.name, c.description
      ORDER BY c.name ASC
    `);
    return rows;
  }
}

module.exports = Category;


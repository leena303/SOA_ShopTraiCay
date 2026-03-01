const Category = require('../models/Category');

class CategoryService {
  // Lấy tất cả danh mục
  async getAllCategories(filters = {}) {
    try {
      return await Category.getAll(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách danh mục: ${error.message}`);
    }
  }

  // Lấy danh mục theo ID
  async getCategoryById(id) {
    try {
      const category = await Category.getById(id);
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }
      return category;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh mục: ${error.message}`);
    }
  }

  // Tạo danh mục mới
  async createCategory(categoryData) {
    try {
      if (!categoryData.name) {
        throw new Error('Tên danh mục là bắt buộc');
      }

      // Kiểm tra tên danh mục đã tồn tại chưa
      const existing = await Category.getByName(categoryData.name);
      if (existing) {
        throw new Error('Tên danh mục đã tồn tại');
      }

      return await Category.create(categoryData);
    } catch (error) {
      throw new Error(`Lỗi khi tạo danh mục: ${error.message}`);
    }
  }

  // Cập nhật danh mục
  async updateCategory(id, categoryData) {
    try {
      const existingCategory = await Category.getById(id);
      if (!existingCategory) {
        throw new Error('Không tìm thấy danh mục');
      }

      // Kiểm tra tên danh mục trùng lặp nếu có
      if (categoryData.name && categoryData.name !== existingCategory.name) {
        const existing = await Category.getByName(categoryData.name);
        if (existing) {
          throw new Error('Tên danh mục đã tồn tại');
        }
      }

      return await Category.update(id, categoryData);
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật danh mục: ${error.message}`);
    }
  }

  // Xóa danh mục
  async deleteCategory(id) {
    try {
      const categoryId = parseInt(id);
      if (isNaN(categoryId)) {
        throw new Error('ID danh mục không hợp lệ');
      }

      const category = await Category.getById(categoryId);
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }

      return await Category.delete(categoryId);
    } catch (error) {
      throw new Error(`Lỗi khi xóa danh mục: ${error.message}`);
    }
  }

  // Lấy số lượng sản phẩm trong mỗi danh mục
  async getCategoryProductCounts() {
    try {
      return await Category.getProductCounts();
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê danh mục: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();


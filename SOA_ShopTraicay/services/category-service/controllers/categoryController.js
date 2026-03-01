const categoryService = require('../services/categoryService');

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const filters = {
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
        search: req.query.search
      };
      const categories = await categoryService.getAllCategories(filters);
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo danh mục thành công',
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cập nhật danh mục thành công',
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({
          success: false,
          message: 'ID danh mục không hợp lệ'
        });
      }
      
      await categoryService.deleteCategory(categoryId);
      res.json({
        success: true,
        message: 'Xóa danh mục thành công'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa danh mục'
      });
    }
  }

  async getCategoryProductCounts(req, res) {
    try {
      const categories = await categoryService.getCategoryProductCounts();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new CategoryController();


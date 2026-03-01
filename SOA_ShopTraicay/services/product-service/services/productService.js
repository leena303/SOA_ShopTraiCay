const Product = require('../models/Product');

class ProductService {
  // Lấy tất cả sản phẩm với filter
  async getAllProducts(filters = {}) {
    try {
      return await Product.getAll(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(id) {
    try {
      const product = await Product.getById(id);
      if (!product) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      return product;
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm: ${error.message}`);
    }
  }

  // Tạo sản phẩm mới
  async createProduct(productData) {
    try {
      // Validate dữ liệu
      if (!productData.name || !productData.unit_price) {
        throw new Error('Tên sản phẩm và giá là bắt buộc');
      }

      if (productData.unit_price < 0) {
        throw new Error('Giá sản phẩm không được âm');
      }

      return await Product.create(productData);
    } catch (error) {
      throw new Error(`Lỗi khi tạo sản phẩm: ${error.message}`);
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(id, productData) {
    try {
      const existingProduct = await Product.getById(id);
      if (!existingProduct) {
        throw new Error('Không tìm thấy sản phẩm');
      }

      if (productData.unit_price !== undefined && productData.unit_price < 0) {
        throw new Error('Giá sản phẩm không được âm');
      }

      return await Product.update(id, productData);
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    }
  }

  // Xóa sản phẩm
  async deleteProduct(id) {
    try {
      const product = await Product.getById(id);
      if (!product) {
        throw new Error('Không tìm thấy sản phẩm');
      }

      return await Product.delete(id);
    } catch (error) {
      throw new Error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  }

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(category) {
    try {
      return await Product.getByCategory(category);
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm theo danh mục: ${error.message}`);
    }
  }

  // Lấy tất cả danh mục
  async getCategories() {
    try {
      return await Product.getCategories();
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách danh mục: ${error.message}`);
    }
  }
}

module.exports = new ProductService();


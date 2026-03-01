const Inventory = require('../models/Inventory');

class InventoryService {
  // Lấy tất cả kho hàng
  async getAllInventory() {
    try {
      return await Inventory.getAll();
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách kho hàng: ${error.message}`);
    }
  }

  // Lấy kho hàng theo product_id
  async getInventoryByProductId(productId) {
    try {
      const inventory = await Inventory.getByProductId(productId);
      if (!inventory) {
        throw new Error('Không tìm thấy sản phẩm trong kho');
      }
      return inventory;
    } catch (error) {
      throw new Error(`Lỗi khi lấy kho hàng: ${error.message}`);
    }
  }

  // Tạo hoặc cập nhật kho hàng
  async upsertInventory(inventoryData) {
    try {
      if (!inventoryData.product_id || inventoryData.quantity === undefined) {
        throw new Error('product_id và quantity là bắt buộc');
      }

      if (inventoryData.quantity < 0) {
        throw new Error('Số lượng không được âm');
      }

      return await Inventory.upsert(inventoryData);
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật kho hàng: ${error.message}`);
    }
  }

  // Nhập kho
  async stockIn(productId, quantity, notes = null) {
    try {
      if (!productId || !quantity || quantity <= 0) {
        throw new Error('product_id và quantity (dương) là bắt buộc');
      }

      return await Inventory.stockIn(productId, quantity, notes);
    } catch (error) {
      throw new Error(`Lỗi khi nhập kho: ${error.message}`);
    }
  }

  // Xuất kho
  async stockOut(productId, quantity, referenceType = null, referenceId = null, notes = null) {
    try {
      if (!productId || !quantity || quantity <= 0) {
        throw new Error('product_id và quantity (dương) là bắt buộc');
      }

      return await Inventory.stockOut(productId, quantity, referenceType, referenceId, notes);
    } catch (error) {
      throw new Error(`Lỗi khi xuất kho: ${error.message}`);
    }
  }

  // Lấy sản phẩm sắp hết hàng
  async getLowStock() {
    try {
      return await Inventory.getLowStock();
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm sắp hết hàng: ${error.message}`);
    }
  }

  // Lấy lịch sử giao dịch kho
  async getTransactions(filters = {}) {
    try {
      return await Inventory.getTransactions(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy lịch sử giao dịch: ${error.message}`);
    }
  }

  // Kiểm tra số lượng tồn kho có đủ không
  async checkStockAvailability(productId, quantity) {
    try {
      const inventory = await Inventory.getByProductId(productId);
      if (!inventory) {
        return { available: false, message: 'Sản phẩm không tồn tại trong kho' };
      }

      if (parseFloat(inventory.quantity) >= parseFloat(quantity)) {
        return { available: true, currentStock: inventory.quantity };
      } else {
        return {
          available: false,
          message: `Số lượng tồn kho không đủ. Hiện có: ${inventory.quantity}`,
          currentStock: inventory.quantity
        };
      }
    } catch (error) {
      throw new Error(`Lỗi khi kiểm tra tồn kho: ${error.message}`);
    }
  }
}

module.exports = new InventoryService();


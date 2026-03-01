const inventoryService = require('../services/inventoryService');

class InventoryController {
  async getAllInventory(req, res) {
    try {
      const inventory = await inventoryService.getAllInventory();
      res.json({
        success: true,
        data: inventory,
        count: inventory.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getInventoryByProductId(req, res) {
    try {
      const inventory = await inventoryService.getInventoryByProductId(req.params.productId);
      res.json({
        success: true,
        data: inventory
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async upsertInventory(req, res) {
    try {
      const inventory = await inventoryService.upsertInventory(req.body);
      res.json({
        success: true,
        message: 'Cập nhật kho hàng thành công',
        data: inventory
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async stockIn(req, res) {
    try {
      const { product_id, quantity, notes } = req.body;
      const inventory = await inventoryService.stockIn(product_id, quantity, notes);
      res.json({
        success: true,
        message: 'Nhập kho thành công',
        data: inventory
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async stockOut(req, res) {
    try {
      const { product_id, quantity, reference_type, reference_id, notes } = req.body;
      const inventory = await inventoryService.stockOut(
        product_id,
        quantity,
        reference_type,
        reference_id,
        notes
      );
      res.json({
        success: true,
        message: 'Xuất kho thành công',
        data: inventory
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getLowStock(req, res) {
    try {
      const products = await inventoryService.getLowStock();
      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTransactions(req, res) {
    try {
      const filters = {
        product_id: req.query.product_id,
        transaction_type: req.query.transaction_type
      };
      const transactions = await inventoryService.getTransactions(filters);
      res.json({
        success: true,
        data: transactions,
        count: transactions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async checkStockAvailability(req, res) {
    try {
      const { product_id, quantity } = req.query;
      const result = await inventoryService.checkStockAvailability(product_id, quantity);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new InventoryController();


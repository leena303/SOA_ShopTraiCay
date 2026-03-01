const OrderReport = require('../models/OrderReport');
const ProductReport = require('../models/ProductReport');
const pool = require('../../config/database');

class ReportService {
  // ============================================
  // ORDER REPORTS
  // ============================================

  // Lấy tất cả báo cáo đơn hàng
  async getAllOrderReports(filters = {}) {
    try {
      return await OrderReport.getAll(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách báo cáo đơn hàng: ${error.message}`);
    }
  }

  // Lấy báo cáo đơn hàng theo ID
  async getOrderReportById(id) {
    try {
      const report = await OrderReport.getById(id);
      if (!report) {
        throw new Error('Không tìm thấy báo cáo đơn hàng');
      }

      // Lấy các báo cáo sản phẩm liên quan
      const productReports = await ProductReport.getByOrderReportId(id);
      report.product_reports = productReports;

      return report;
    } catch (error) {
      throw new Error(`Lỗi khi lấy báo cáo đơn hàng: ${error.message}`);
    }
  }

  // Tạo báo cáo đơn hàng mới
  async createOrderReport(orderId) {
    try {
      // Kiểm tra xem đơn hàng đã có báo cáo chưa
      const existingReports = await OrderReport.getByOrderId(orderId);
      if (existingReports.length > 0) {
        throw new Error('Đơn hàng này đã có báo cáo');
      }

      // Lấy thông tin đơn hàng
      const [orders] = await pool.execute(
        `SELECT o.*, 
                (SELECT SUM(oi.total_price) FROM order_items oi WHERE oi.order_id = o.id) as calculated_total
         FROM orders o
         WHERE o.id = ?`,
        [orderId]
      );

      if (orders.length === 0) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      const order = orders[0];
      const totalRevenue = parseFloat(order.calculated_total || order.total_amount || 0);

      // Lấy chi tiết đơn hàng (order_items)
      const [orderItems] = await pool.execute(
        `SELECT oi.*, 
                p.name as product_name,
                p.unit_price as current_price
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      // Tính tổng chi phí (giả sử cost = 70% của revenue, hoặc lấy từ bảng products nếu có cost_price)
      let totalCost = 0;
      const productReportsData = [];

      for (const item of orderItems) {
        const unitPrice = parseFloat(item.unit_price || item.current_price || 0);
        const quantity = parseInt(item.quantity || 0);
        const revenue = unitPrice * quantity;

        // Tính cost: nếu có cost_price trong products thì dùng, nếu không thì 70% revenue
        const [products] = await pool.execute(
          'SELECT cost_price, unit_price FROM products WHERE id = ?',
          [item.product_id]
        );

        let costPerUnit = 0;
        if (products.length > 0 && products[0].cost_price) {
          costPerUnit = parseFloat(products[0].cost_price);
        } else {
          // Mặc định cost = 70% của unit_price
          costPerUnit = unitPrice * 0.7;
        }

        const cost = costPerUnit * quantity;
        const profit = revenue - cost;

        totalCost += cost;

        productReportsData.push({
          product_id: item.product_id,
          total_sold: quantity,
          revenue: revenue,
          cost: cost,
          profit: profit
        });
      }

      const totalProfit = totalRevenue - totalCost;

      // Tạo báo cáo đơn hàng
      const orderReport = await OrderReport.create({
        order_id: orderId,
        total_revenue: totalRevenue,
        total_cost: totalCost,
        total_profit: totalProfit
      });

      // Tạo báo cáo sản phẩm cho từng item
      for (const productData of productReportsData) {
        await ProductReport.create({
          order_report_id: orderReport.id,
          ...productData
        });
      }

      return await this.getOrderReportById(orderReport.id);
    } catch (error) {
      throw new Error(`Lỗi khi tạo báo cáo đơn hàng: ${error.message}`);
    }
  }

  // Xóa báo cáo đơn hàng
  async deleteOrderReport(id) {
    try {
      const report = await OrderReport.getById(id);
      if (!report) {
        throw new Error('Không tìm thấy báo cáo đơn hàng');
      }

      return await OrderReport.delete(id);
    } catch (error) {
      throw new Error(`Lỗi khi xóa báo cáo đơn hàng: ${error.message}`);
    }
  }

  // ============================================
  // PRODUCT REPORTS
  // ============================================

  // Lấy tất cả báo cáo sản phẩm
  async getAllProductReports(filters = {}) {
    try {
      return await ProductReport.getAll(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách báo cáo sản phẩm: ${error.message}`);
    }
  }

  // Lấy báo cáo sản phẩm theo ID
  async getProductReportById(id) {
    try {
      const report = await ProductReport.getById(id);
      if (!report) {
        throw new Error('Không tìm thấy báo cáo sản phẩm');
      }
      return report;
    } catch (error) {
      throw new Error(`Lỗi khi lấy báo cáo sản phẩm: ${error.message}`);
    }
  }

  // Lấy báo cáo tổng hợp theo product_id
  async getProductReportSummary(productId) {
    try {
      return await ProductReport.getByProductId(productId);
    } catch (error) {
      throw new Error(`Lỗi khi lấy báo cáo tổng hợp sản phẩm: ${error.message}`);
    }
  }

  // Tạo báo cáo sản phẩm mới (từ order)
  async createProductReport(orderReportId, productId, quantity, unitPrice) {
    try {
      // Kiểm tra order_report_id tồn tại
      const orderReport = await OrderReport.getById(orderReportId);
      if (!orderReport) {
        throw new Error('Không tìm thấy báo cáo đơn hàng');
      }

      // Lấy thông tin sản phẩm
      const [products] = await pool.execute(
        'SELECT cost_price, unit_price FROM products WHERE id = ?',
        [productId]
      );

      if (products.length === 0) {
        throw new Error('Không tìm thấy sản phẩm');
      }

      const product = products[0];
      const revenue = parseFloat(unitPrice) * parseInt(quantity);

      // Tính cost
      let costPerUnit = 0;
      if (product.cost_price) {
        costPerUnit = parseFloat(product.cost_price);
      } else {
        costPerUnit = parseFloat(unitPrice) * 0.7; // Mặc định 70%
      }

      const cost = costPerUnit * parseInt(quantity);
      const profit = revenue - cost;

      return await ProductReport.create({
        order_report_id: orderReportId,
        product_id: productId,
        total_sold: parseInt(quantity),
        revenue: revenue,
        cost: cost,
        profit: profit
      });
    } catch (error) {
      throw new Error(`Lỗi khi tạo báo cáo sản phẩm: ${error.message}`);
    }
  }

  // Xóa báo cáo sản phẩm
  async deleteProductReport(id) {
    try {
      const report = await ProductReport.getById(id);
      if (!report) {
        throw new Error('Không tìm thấy báo cáo sản phẩm');
      }

      return await ProductReport.delete(id);
    } catch (error) {
      throw new Error(`Lỗi khi xóa báo cáo sản phẩm: ${error.message}`);
    }
  }
}

module.exports = new ReportService();


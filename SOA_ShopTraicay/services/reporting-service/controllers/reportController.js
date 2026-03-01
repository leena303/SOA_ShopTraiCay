const reportService = require('../services/reportService');

class ReportController {
  // ============================================
  // ORDER REPORTS
  // ============================================

  async getAllOrderReports(req, res) {
    try {
      const filters = {
        order_id: req.query.order_id,
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };

      const reports = await reportService.getAllOrderReports(filters);
      res.json({
        success: true,
        data: reports,
        count: reports.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOrderReportById(req, res) {
    try {
      const report = await reportService.getOrderReportById(req.params.id);
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async createOrderReport(req, res) {
    try {
      const { order_id } = req.body;

      if (!order_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: order_id là bắt buộc'
        });
      }

      const report = await reportService.createOrderReport(order_id);
      res.status(201).json({
        success: true,
        message: 'Tạo báo cáo đơn hàng thành công',
        data: report
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteOrderReport(req, res) {
    try {
      await reportService.deleteOrderReport(req.params.id);
      res.json({
        success: true,
        message: 'Xóa báo cáo đơn hàng thành công'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // ============================================
  // PRODUCT REPORTS
  // ============================================

  async getAllProductReports(req, res) {
    try {
      const filters = {
        product_id: req.query.product_id,
        order_report_id: req.query.order_report_id,
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };

      const reports = await reportService.getAllProductReports(filters);
      res.json({
        success: true,
        data: reports,
        count: reports.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProductReportById(req, res) {
    try {
      const report = await reportService.getProductReportById(req.params.id);
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProductReportSummary(req, res) {
    try {
      const report = await reportService.getProductReportSummary(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy báo cáo sản phẩm'
        });
      }
      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createProductReport(req, res) {
    try {
      const { order_report_id, product_id, quantity, unit_price } = req.body;

      if (!order_report_id || !product_id || !quantity || !unit_price) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: order_report_id, product_id, quantity, unit_price là bắt buộc'
        });
      }

      const report = await reportService.createProductReport(
        order_report_id,
        product_id,
        quantity,
        unit_price
      );
      res.status(201).json({
        success: true,
        message: 'Tạo báo cáo sản phẩm thành công',
        data: report
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteProductReport(req, res) {
    try {
      await reportService.deleteProductReport(req.params.id);
      res.json({
        success: true,
        message: 'Xóa báo cáo sản phẩm thành công'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ReportController();


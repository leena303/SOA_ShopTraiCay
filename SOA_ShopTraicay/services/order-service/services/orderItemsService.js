const Order = require('../models/Order');
const pool = require('../../config/database');

class OrderItemsService {
  // Lấy tất cả order items
  async getAllOrderItems(filters = {}) {
    try {
      let query = `
        SELECT oi.*, 
               p.name as product_name,
               o.order_number,
               o.status as order_status
        FROM order_items oi
        INNER JOIN products p ON oi.product_id = p.id
        INNER JOIN orders o ON oi.order_id = o.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.order_id) {
        query += ' AND oi.order_id = ?';
        params.push(filters.order_id);
      }

      if (filters.product_id) {
        query += ' AND oi.product_id = ?';
        params.push(filters.product_id);
      }

      query += ' ORDER BY oi.created_at DESC';

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách order items: ${error.message}`);
    }
  }

  // Lấy order item theo ID
  async getOrderItemById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT oi.*, 
         p.name as product_name,
         o.order_number,
         o.status as order_status
         FROM order_items oi
         INNER JOIN products p ON oi.product_id = p.id
         INNER JOIN orders o ON oi.order_id = o.id
         WHERE oi.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        throw new Error('Không tìm thấy order item');
      }

      return rows[0];
    } catch (error) {
      throw new Error(`Lỗi khi lấy order item: ${error.message}`);
    }
  }

  // Lấy order items theo order_id
  async getOrderItemsByOrderId(orderId) {
    try {
      return await Order.getOrderItems(orderId);
    } catch (error) {
      throw new Error(`Lỗi khi lấy order items theo order_id: ${error.message}`);
    }
  }

  // Tạo order item mới
  async createOrderItem(itemData) {
    try {
      const { order_id, product_id, quantity, unit_price } = itemData;

      // Validation
      if (!order_id || !product_id || !quantity || !unit_price) {
        throw new Error('Thiếu thông tin: order_id, product_id, quantity, unit_price là bắt buộc');
      }

      // Lấy tên sản phẩm
      const [products] = await pool.execute(
        'SELECT name FROM products WHERE id = ?',
        [product_id]
      );

      if (products.length === 0) {
        throw new Error('Không tìm thấy sản phẩm');
      }

      const product_name = products[0].name;

      // Tính total_price
      const total_price = parseFloat(unit_price) * parseFloat(quantity);

      // Tạo order item
      const [result] = await pool.execute(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [order_id, product_id, product_name, quantity, unit_price, total_price]
      );

      // Cập nhật tổng tiền đơn hàng
      await this.updateOrderTotal(order_id);

      return await this.getOrderItemById(result.insertId);
    } catch (error) {
      throw new Error(`Lỗi khi tạo order item: ${error.message}`);
    }
  }

  // Cập nhật order item
  async updateOrderItem(id, itemData) {
    try {
      const existingItem = await this.getOrderItemById(id);
      if (!existingItem) {
        throw new Error('Không tìm thấy order item');
      }

      const { quantity, unit_price } = itemData;
      const fields = [];
      const values = [];

      if (quantity !== undefined) {
        fields.push('quantity = ?');
        values.push(quantity);
      }

      if (unit_price !== undefined) {
        fields.push('unit_price = ?');
        values.push(unit_price);
      }

      if (fields.length === 0) {
        return existingItem;
      }

      // Tính lại total_price
      const finalQuantity = quantity !== undefined ? quantity : existingItem.quantity;
      const finalUnitPrice = unit_price !== undefined ? unit_price : existingItem.unit_price;
      const total_price = parseFloat(finalUnitPrice) * parseFloat(finalQuantity);

      fields.push('total_price = ?');
      values.push(total_price);
      values.push(id);

      await pool.execute(
        `UPDATE order_items SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      // Cập nhật tổng tiền đơn hàng
      await this.updateOrderTotal(existingItem.order_id);

      return await this.getOrderItemById(id);
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật order item: ${error.message}`);
    }
  }

  // Xóa order item
  async deleteOrderItem(id) {
    try {
      const item = await this.getOrderItemById(id);
      if (!item) {
        throw new Error('Không tìm thấy order item');
      }

      const order_id = item.order_id;

      await Order.removeOrderItem(id);

      // Cập nhật tổng tiền đơn hàng
      await this.updateOrderTotal(order_id);

      return { message: 'Order item đã được xóa' };
    } catch (error) {
      throw new Error(`Lỗi khi xóa order item: ${error.message}`);
    }
  }

  // Cập nhật tổng tiền đơn hàng
  async updateOrderTotal(orderId) {
    try {
      const [rows] = await pool.execute(
        'SELECT SUM(total_price) as total FROM order_items WHERE order_id = ?',
        [orderId]
      );

      const total_amount = rows[0].total || 0;

      await pool.execute(
        'UPDATE orders SET total_amount = ? WHERE id = ?',
        [total_amount, orderId]
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật tổng tiền đơn hàng:', error);
    }
  }
}

module.exports = new OrderItemsService();


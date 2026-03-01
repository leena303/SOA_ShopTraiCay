const Order = require('../models/Order');
const inventoryService = require('../../inventory-service/services/inventoryService');
const Payment = require('../../payment-service/models/Payment');

class OrderService {
  // Lấy tất cả đơn hàng
  async getAllOrders(filters = {}) {
    try {
      return await Order.getAll(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách đơn hàng: ${error.message}`);
    }
  }

  // Lấy đơn hàng theo ID
  async getOrderById(id) {
    try {
      const order = await Order.getById(id);
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      // Lấy chi tiết items
      const items = await Order.getOrderItems(id);
      return { ...order, items };
    } catch (error) {
      throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
    }
  }

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    const pool = require('../../config/database');
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { customer_id, customer_name, customer_email, items, payment_method, notes } = orderData;

      console.log('createOrder - Received orderData:', {
        customer_id,
        customer_name,
        customer_email,
        items_count: items?.length,
        payment_method,
        notes
      });

      if (!items || items.length === 0) {
        throw new Error('Đơn hàng phải có ít nhất một sản phẩm');
      }

      // Validate customer information
      if (!customer_name || !customer_email) {
        throw new Error('Tên khách hàng và email là bắt buộc');
      }
      
      // Đảm bảo customer_id là số hoặc null
      const finalCustomerId = customer_id ? parseInt(customer_id) : null;
      console.log('createOrder - Final customer_id:', finalCustomerId);

      // Kiểm tra tồn kho và tính tổng tiền
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const { product_id, quantity } = item;

        // Kiểm tra tồn kho (có thể bỏ qua nếu inventory service không hoạt động)
        try {
          const stockCheck = await inventoryService.checkStockAvailability(product_id, quantity);
          if (!stockCheck.available) {
            console.warn(`Stock check failed for product ${product_id}:`, stockCheck.message);
            throw new Error(`Sản phẩm ID ${product_id}: ${stockCheck.message}`);
          }
          console.log(`Stock check passed for product ${product_id}:`, stockCheck);
        } catch (inventoryError) {
          // Nếu lỗi là do inventory service không hoạt động, có thể bỏ qua
          // Nhưng nếu là lỗi hết hàng thì vẫn throw
          if (inventoryError.message && inventoryError.message.includes('không đủ')) {
            throw inventoryError;
          }
          console.warn(`Inventory service error (continuing anyway):`, inventoryError.message);
          // Tiếp tục tạo đơn hàng dù không kiểm tra được tồn kho
        }

        // Lấy giá sản phẩm (cần import product service hoặc query trực tiếp)
        const pool = require('../../config/database');
        const [products] = await pool.execute(
          'SELECT unit_price FROM products WHERE id = ?',
          [product_id]
        );

        if (products.length === 0) {
          throw new Error(`Không tìm thấy sản phẩm ID ${product_id}`);
        }

        const unitPrice = products[0].unit_price;
        const subtotal = parseFloat(unitPrice) * parseFloat(quantity);
        totalAmount += subtotal;

        // Lấy tên sản phẩm
        const [productInfo] = await pool.execute(
          'SELECT name FROM products WHERE id = ?',
          [product_id]
        );
        const product_name = productInfo.length > 0 ? productInfo[0].name : null;

        orderItems.push({
          product_id,
          product_name,  // Yêu cầu BTH4
          quantity,
          unit_price: unitPrice,
          subtotal,
          total_price: subtotal  // Yêu cầu BTH4
        });
      }

      // Lấy thông tin khách hàng nếu có customer_id (customer_name và customer_email đã được destructure ở trên)
      if (customer_id && (!customer_name || !customer_email)) {
        const [customers] = await pool.execute(
          'SELECT name, email FROM customers WHERE id = ?',
          [customer_id]
        );
        if (customers.length > 0) {
          customer_name = customer_name || customers[0].name;
          customer_email = customer_email || customers[0].email;
        }
      }

      // Tạo đơn hàng
      const orderNumber = Order.generateOrderNumber();
      const insertParams = [finalCustomerId, customer_name, customer_email, orderNumber, totalAmount, payment_method || 'cash', notes || ''];
      console.log('createOrder - Inserting order with params:', {
        customer_id: finalCustomerId,
        customer_name,
        customer_email,
        order_number: orderNumber,
        total_amount: totalAmount
      });
      
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (customer_id, customer_name, customer_email, order_number, total_amount, status, payment_method, payment_status, notes)
         VALUES (?, ?, ?, ?, ?, 'pending', ?, 'pending', ?)`,
        insertParams
      );
      
      console.log('createOrder - Order created with ID:', orderResult.insertId);

      const orderId = orderResult.insertId;

      // Thêm items vào đơn hàng
      for (const item of orderItems) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.product_name, item.quantity, item.unit_price, item.subtotal, item.total_price]
        );
      }

      // Xuất kho (có thể bỏ qua nếu inventory service không hoạt động)
      for (const item of items) {
        try {
          await inventoryService.stockOut(
            item.product_id,
            item.quantity,
            'order',
            orderId,
            `Xuất kho cho đơn hàng ${orderNumber}`
          );
          console.log(`Stock out successful for product ${item.product_id}`);
        } catch (stockError) {
          // Log warning nhưng vẫn tiếp tục (đơn hàng đã được tạo)
          console.warn(`Cannot stock out for product ${item.product_id}:`, stockError.message);
          // Không throw error để đơn hàng vẫn được tạo thành công
        }
      }

      // Tự động tạo thanh toán tiền mặt nếu payment_method = 'cash'
      if (payment_method === 'cash') {
        await connection.execute(
          `INSERT INTO payments (order_id, amount, status, notes)
           VALUES (?, ?, 'pending', ?)`,
          [orderId, totalAmount, `Thanh toán tiền mặt cho đơn hàng ${orderNumber}`]
        );
      }

      await connection.commit();

      return this.getOrderById(orderId);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Lỗi khi tạo đơn hàng: ${error.message}`);
    } finally {
      connection.release();
    }
  }

  // Cập nhật đơn hàng
  async updateOrder(id, orderData) {
    try {
      const existingOrder = await Order.getById(id);
      if (!existingOrder) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      // Nếu đơn hàng đã completed hoặc cancelled, không cho cập nhật
      if (existingOrder.status === 'completed' || existingOrder.status === 'cancelled') {
        throw new Error('Không thể cập nhật đơn hàng đã hoàn thành hoặc đã hủy');
      }

      return await Order.update(id, orderData);
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
    }
  }

  // Xóa đơn hàng
  async deleteOrder(id) {
    try {
      const orderId = parseInt(id);
      if (isNaN(orderId)) {
        throw new Error('ID đơn hàng không hợp lệ');
      }

      const order = await Order.getById(orderId);
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      // Nếu đơn hàng đã completed, không cho xóa
      if (order.status === 'completed') {
        throw new Error('Không thể xóa đơn hàng đã hoàn thành');
      }

      // Nếu đơn hàng đã xuất kho, cần nhập lại (nhưng không block nếu lỗi)
      if (order.status !== 'cancelled') {
        try {
          const items = await Order.getOrderItems(orderId);
          for (const item of items) {
            try {
              await inventoryService.stockIn(
                item.product_id,
                item.quantity,
                `Hoàn trả từ đơn hàng ${order.order_number || orderId}`
              );
            } catch (stockError) {
              // Log warning nhưng vẫn tiếp tục xóa đơn hàng
              console.warn(`Không thể nhập lại hàng cho sản phẩm ${item.product_id}:`, stockError.message);
            }
          }
        } catch (itemsError) {
          // Log warning nhưng vẫn tiếp tục xóa đơn hàng
          console.warn(`Không thể lấy danh sách sản phẩm để nhập lại:`, itemsError.message);
        }
      }

      return await Order.delete(orderId);
    } catch (error) {
      throw new Error(`Lỗi khi xóa đơn hàng: ${error.message}`);
    }
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id, status) {
    try {
      console.log('updateOrderStatus - Request:', { id, status });
      const order = await Order.getById(id);
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }

      console.log('updateOrderStatus - Current order:', {
        id: order.id,
        current_status: order.status,
        new_status: status
      });

      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Trạng thái không hợp lệ: ${status}. Các trạng thái hợp lệ: ${validStatuses.join(', ')}`);
      }

      // Không cho hủy đơn hàng đã completed
      if (status === 'cancelled' && order.status === 'completed') {
        throw new Error('Không thể hủy đơn hàng đã hoàn thành');
      }

      // Nếu hủy đơn hàng, nhập lại kho và hủy các thanh toán liên quan
      if (status === 'cancelled' && order.status !== 'cancelled') {
        console.log('Cancelling order, attempting to restock items...');
        const items = await Order.getOrderItems(id);
        console.log('Order items to restock:', items.length);
        
        for (const item of items) {
          try {
            await inventoryService.stockIn(
              item.product_id,
              item.quantity,
              `Hoàn trả từ đơn hàng bị hủy ${order.order_number}`
            );
            console.log(`Restocked product ${item.product_id}: ${item.quantity}`);
          } catch (stockError) {
            // Log warning nhưng vẫn tiếp tục hủy đơn hàng
            console.warn(`Cannot restock product ${item.product_id}:`, stockError.message);
            // Không throw error để đơn hàng vẫn được hủy thành công
          }
        }

        // Hủy tất cả các thanh toán liên quan đến đơn hàng này
        try {
          const payments = await Payment.getByOrderId(id);
          console.log(`Found ${payments.length} payment(s) for order ${id}`);
          
          for (const payment of payments) {
            // Chỉ hủy các payment chưa completed hoặc cancelled
            if (payment.status !== 'completed' && payment.status !== 'cancelled') {
              try {
                await Payment.update(payment.id, {
                  status: 'cancelled',
                  notes: `Tự động hủy do đơn hàng ${order.order_number} bị hủy`,
                  changed_by: 'system'
                });
                console.log(`Cancelled payment ${payment.id} for order ${id}`);
              } catch (paymentError) {
                console.warn(`Cannot cancel payment ${payment.id}:`, paymentError.message);
                // Không throw error để đơn hàng vẫn được hủy thành công
              }
            } else {
              console.log(`Skipping payment ${payment.id} with status: ${payment.status}`);
            }
          }
        } catch (paymentError) {
          console.warn('Error cancelling payments for order:', paymentError.message);
          // Không throw error để đơn hàng vẫn được hủy thành công
        }
      }

      const updatedOrder = await Order.update(id, { status });
      console.log('updateOrderStatus - Success:', updatedOrder);
      return updatedOrder;
    } catch (error) {
      console.error('updateOrderStatus - Error:', error);
      throw new Error(`Lỗi khi cập nhật trạng thái đơn hàng: ${error.message}`);
    }
  }

  // Lấy thống kê đơn hàng
  async getOrderStatistics(filters = {}) {
    try {
      return await Order.getStatistics(filters);
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê đơn hàng: ${error.message}`);
    }
  }
}

module.exports = new OrderService();


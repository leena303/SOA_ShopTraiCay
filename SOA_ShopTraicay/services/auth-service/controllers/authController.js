const authService = require('../services/authService');

class AuthController {
  // Đăng nhập
  async login(req, res) {
    try {
      const { userName, password } = req.body;

      // Validate input
      if (!userName || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
        });
      }

      const result = await authService.login(userName, password);
      
      res.json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Đăng nhập thất bại'
      });
    }
  }

  // Xác thực token
  async authenticate(req, res) {
    try {
      // Lấy token từ header hoặc body
      const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token không được cung cấp'
        });
      }

      const result = await authService.authenticateToken(token);
      
      res.json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Token không hợp lệ'
      });
    }
  }

  // Đăng ký
  async register(req, res) {
    try {
      const { userName, password, role } = req.body;

      // Validate input
      if (!userName || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
        });
      }

      const result = await authService.register(userName, password, role);
      
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Đăng ký thất bại'
      });
    }
  }

  // Đăng xuất
  async logout(req, res) {
    try {
      // Lấy token từ header nếu có (không bắt buộc)
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      let userId = null;
      
      // Nếu có token, thử xác thực để lấy userId
      if (token) {
        try {
          const decoded = authService.verifyToken(token);
          if (decoded && decoded.id) {
            userId = decoded.id;
          }
        } catch (error) {
          // Token không hợp lệ hoặc hết hạn - không sao, vẫn cho phép logout
          console.log('Token invalid or expired during logout:', error.message);
        }
      }
      
      // Nếu có userId hợp lệ, gọi service để xóa token trong database
      if (userId) {
        try {
          const result = await authService.logout(userId);
          return res.json(result);
        } catch (error) {
          // Nếu xóa token trong DB lỗi, vẫn trả về success vì logout vẫn thành công
          console.error('Error clearing token in database:', error);
        }
      }
      
      // Trả về success dù không có token hoặc token không hợp lệ
      // (vì frontend đã clear localStorage rồi)
      return res.json({
        success: true,
        message: 'Đăng xuất thành công'
      });
    } catch (error) {
      // Nếu có lỗi khác, vẫn trả về success vì logout vẫn thành công
      console.error('Logout error:', error);
      return res.json({
        success: true,
        message: 'Đăng xuất thành công'
      });
    }
  }
}

module.exports = new AuthController();


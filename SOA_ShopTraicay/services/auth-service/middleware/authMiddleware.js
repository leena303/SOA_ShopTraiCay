const authService = require('../services/authService');
const User = require('../models/User');

// Middleware xác thực JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp. Vui lòng đăng nhập.'
      });
    }

    // Xác thực token
    const decoded = authService.verifyToken(token);

    // Kiểm tra token có trong database
    const user = await User.getByToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không tồn tại trong hệ thống'
      });
    }

    // Lưu thông tin user vào request để sử dụng ở các route tiếp theo
    req.user = {
      id: user.IdUser,
      username: user.UserName
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = {
  authenticateToken
};


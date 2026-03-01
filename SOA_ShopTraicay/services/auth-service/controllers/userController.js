const User = require('../models/User');
const authService = require('../services/authService');

class UserController {
  // Lấy tất cả users (CẦN JWT - Admin)
  async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json({
        success: true,
        data: users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email || user.username,
          role: user.Role,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        })),
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách người dùng'
      });
    }
  }

  // Lấy user theo ID (CẦN JWT - Admin)
  async getUserById(req, res) {
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }
      res.json({
        success: true,
        data: {
          id: user.IdUser,
          username: user.UserName,
          role: user.Role,
          email: user.email || user.UserName,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin người dùng'
      });
    }
  }

  // Cập nhật user (CẦN JWT - Admin)
  async updateUser(req, res) {
    try {
      console.log('Update user request - params:', req.params);
      console.log('Update user request - body:', req.body);
      
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        console.error('Invalid user ID:', req.params.id);
        return res.status(400).json({
          success: false,
          message: 'ID người dùng không hợp lệ'
        });
      }

      const { username, password, email, role } = req.body;
      console.log('Parsed request data:', { username, password: password ? '***' : undefined, email, role });
      
      const userData = {};

      // Cập nhật username nếu có (nếu không có, giữ nguyên username hiện tại)
      if (username && username.trim() !== '') {
        userData.UserName = username.trim();
      } else {
        // Nếu không gửi username, giữ nguyên username hiện tại (không cập nhật)
        // Nhưng vẫn cho phép cập nhật email
      }

      // Cập nhật email riêng nếu có (luôn gửi, kể cả khi rỗng)
      if (email !== undefined) {
        userData.email = email.trim() || null;
      }

      if (role) {
        userData.Role = role;
      }

      // Nếu không có username để cập nhật và không có email để cập nhật, báo lỗi
      if (!userData.UserName && email === undefined) {
        console.error('No username or email provided for update');
        return res.status(400).json({
          success: false,
          message: 'Cần có ít nhất tên đăng nhập hoặc email để cập nhật'
        });
      }

      if (password && password.trim() !== '') {
        // Hash password trước khi lưu
        const hashedPassword = authService.hashPassword(password.trim());
        userData.Password = hashedPassword;
      }

      // Kiểm tra user có tồn tại không
      const existingUser = await User.getById(userId);
      if (!existingUser) {
        console.error('User not found:', userId);
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      console.log('Existing user:', existingUser);

      // Kiểm tra username mới có trùng với user khác không (nếu thay đổi username)
      if (userData.UserName && userData.UserName !== existingUser.UserName) {
        const userWithSameName = await User.getByUsername(userData.UserName);
        if (userWithSameName && userWithSameName.IdUser !== userId) {
          console.error('Username already exists:', userData.UserName);
          return res.status(400).json({
            success: false,
            message: 'Tên đăng nhập đã tồn tại'
          });
        }
      }

      console.log('Updating user with data:', userId, userData);
      const user = await User.update(userId, userData);
      console.log('User updated successfully:', user);
      
      res.json({
        success: true,
        message: 'Cập nhật người dùng thành công',
        data: {
          id: user.IdUser,
          username: user.UserName,
          email: user.email || user.UserName
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật người dùng'
      });
    }
  }

  // Xóa user (CẦN JWT - Admin)
  async deleteUser(req, res) {
    try {
      await User.delete(req.params.id);
      res.json({
        success: true,
        message: 'Xóa người dùng thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xóa người dùng'
      });
    }
  }

  // Lấy tổng số users (CẦN JWT - Admin)
  async getTotalUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json({
        success: true,
        total: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi lấy tổng số người dùng'
      });
    }
  }
}

module.exports = new UserController();


const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  constructor() {
    // Secret key cho JWT (nên lưu trong .env)
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  }

  // Mã hóa password bằng MD5
  hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  // So sánh password
  comparePassword(inputPassword, storedPassword) {
    const hashedInput = this.hashPassword(inputPassword);
    return hashedInput === storedPassword;
  }

  // Tạo JWT token
  generateToken(user) {
    const payload = {
      id: user.IdUser,
      username: user.UserName
    };
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  // Xác thực JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // Đăng nhập
  async login(username, password) {
    // Tìm user theo username
    const user = await User.getByUsername(username);
    
    if (!user) {
      throw new Error('Tên đăng nhập không tồn tại');
    }

    // So sánh password
    // Hỗ trợ 3 trường hợp:
    // 1. Password plain text (ví dụ: "123456")
    // 2. Password đã mã hóa MD5 (32 ký tự hex)
    // 3. Password đã mã hóa base64 (ví dụ: "MTIzNDU2")
    
    let passwordToCompare = password;
    
    // Kiểm tra nếu password là MD5 hash (32 ký tự hex)
    const isMD5Hash = /^[a-f0-9]{32}$/i.test(password);
    
    if (isMD5Hash) {
      // Password đã là MD5 hash, so sánh trực tiếp
      if (password !== user.Password) {
        throw new Error('Mật khẩu không đúng');
      }
    } else {
      // Kiểm tra nếu password là base64
      let isBase64 = false;
      try {
        const decoded = Buffer.from(password, 'base64').toString('utf-8');
        // Kiểm tra xem có phải base64 hợp lệ không (decode khác với input)
        if (decoded && decoded.length > 0 && decoded !== password) {
          // Thử encode lại để verify
          const reEncoded = Buffer.from(decoded, 'utf-8').toString('base64');
          if (reEncoded === password) {
            passwordToCompare = decoded;
            isBase64 = true;
          }
        }
      } catch (e) {
        // Không phải base64, giữ nguyên
      }
      
      // Hash password để so sánh với database
      const hashedPassword = this.hashPassword(passwordToCompare);
      
      if (hashedPassword !== user.Password) {
        throw new Error('Mật khẩu không đúng');
      }
    }

    // Tạo JWT token
    const token = this.generateToken(user);

    // Lưu token vào database
    await User.updateToken(user.IdUser, token);

    // Lấy email từ database nếu có
    const userEmail = user.email || user.UserName;
    
    return {
      success: true,
      message: 'Đăng nhập thành công',
      token: token,
      user: {
        id: user.IdUser,
        username: user.UserName,
        email: userEmail,
        customer_email: userEmail // Để tương thích với order history
      }
    };
  }

  // Đăng ký user mới
  async register(userName, password, role) {
    const User = require('../models/User');
    
    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.getByUsername(userName);
    if (existingUser) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }

    // Hash password
    const hashedPassword = this.hashPassword(password);

    // Tạo user mới
    const user = await User.create({
      UserName: userName,
      Password: hashedPassword,
      Role: role
    });

    return {
      success: true,
      message: 'Đăng ký thành công',
      user: {
        id: user.IdUser,
        username: user.UserName,
        role: user.Role
      }
    };
  }

  // Xác thực token
  async authenticateToken(token) {
    try {
      // Xác thực JWT token
      const decoded = this.verifyToken(token);

      // Kiểm tra token có trong database không
      const user = await User.getByToken(token);
      
      if (!user) {
        throw new Error('Token không tồn tại trong hệ thống');
      }

      return {
        success: true,
        message: 'Token hợp lệ',
        user: {
          id: user.IdUser,
          username: user.UserName
        },
        decoded: decoded
      };
    } catch (error) {
      throw new Error(error.message || 'Token không hợp lệ');
    }
  }

  // Đăng xuất
  async logout(userId) {
    await User.clearToken(userId);
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  }
}

module.exports = new AuthService();


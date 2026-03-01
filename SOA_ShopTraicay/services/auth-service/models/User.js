const pool = require('../../config/database');

class User {
  // Lấy user theo username
  static async getByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT *, COALESCE(email, UserName) as email FROM users WHERE UserName = ?',
      [username]
    );
    return rows[0];
  }

  // Lấy user theo ID
static async getById(id) {
  const [rows] = await pool.execute(
    `SELECT 
      IdUser,
      UserName,
      Role,
      COALESCE(email, UserName) as email,
      created_at,
      updated_at
     FROM users WHERE IdUser = ?`,
    [id]
  );
  return rows[0];
}

  // Tạo user mới
  static async create(userData) {
    const { UserName, Password, Role } = userData;

    const [result] = await pool.execute(
      `INSERT INTO users (UserName, Password, Role, Token)
       VALUES (?, ?, ?, NULL)`,
      [UserName, Password, Role || 'customer']
    );

    return this.getById(result.insertId);
  }

  // Cập nhật token cho user
  static async updateToken(id, token) {
    await pool.execute(
      'UPDATE users SET Token = ? WHERE IdUser = ?',
      [token, id]
    );
    return this.getById(id);
  }

  // Xóa token (logout)
  static async clearToken(id) {
    await pool.execute(
      'UPDATE users SET Token = NULL WHERE IdUser = ?',
      [id]
    );
    return this.getById(id);
  }

  // Lấy user theo token
  static async getByToken(token) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE Token = ?',
      [token]
    );
    return rows[0];
  }

  // Lấy tất cả users (cho admin)
static async getAll() {
  const [rows] = await pool.execute(
    `SELECT 
      IdUser as id,
      UserName as username,
      Role,
      COALESCE(email, UserName) as email,
      created_at,
      updated_at
     FROM users
     ORDER BY created_at DESC`
  );
  return rows;
}

  // Cập nhật user
static async update(id, userData) {
  const { UserName, Password, email, Role } = userData;
  const fields = [];
  const values = [];

  if (UserName) {
    fields.push('UserName = ?');
    values.push(UserName);
  }

  if (email !== undefined) {
    fields.push('email = ?');
    values.push(email);
  }

  if (Password) {
    fields.push('Password = ?');
    values.push(Password);
  }

  if (Role) {
    fields.push('Role = ?');
    values.push(Role);
  }

  if (fields.length === 0) return this.getById(id);

  values.push(id);
  await pool.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE IdUser = ?`,
    values
  );

  return this.getById(id);
}

  // Xóa user
  static async delete(id) {
    await pool.execute(
      'DELETE FROM users WHERE IdUser = ?',
      [id]
    );
    return { message: 'Người dùng đã được xóa' };
  }
}

module.exports = User;


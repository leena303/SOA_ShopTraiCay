const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '300304',
  database: process.env.DB_NAME || 'fruit_store_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Tạo connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Kết nối MySQL thành công!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
  });

module.exports = pool;


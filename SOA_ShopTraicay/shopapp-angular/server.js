const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./shopapp.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create tables
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer'
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            order_date TEXT NOT NULL,
            total_price REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`);
    }
});

// JWT Secret Key
const jwtSecret = 'your_jwt_secret';

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// User Registration
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ message: 'Username already exists' });
                }
                console.error('Error registering user:', err.message);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (error) {
        console.error('Error hashing password:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, role: user.role } });
    });
});

// Get Products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(rows);
    });
});

// Create New Order
app.post('/api/orders', authenticateJWT, (req, res) => {
    const userId = req.user.id;
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0 || totalAmount === undefined) {
        return res.status(400).json({ message: 'Cart items and total amount are required' });
    }

    const orderDate = new Date().toISOString();

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(`INSERT INTO orders (user_id, order_date, total_price) VALUES (?, ?, ?)`,
            [userId, orderDate, totalAmount],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    console.error('Error creating order:', err.message);
                    return res.status(500).json({ message: 'Failed to create order' });
                }

                const orderId = this.lastID;
                const stmt = db.prepare(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`);

                items.forEach(item => {
                    stmt.run(orderId, item.id, item.quantity, item.price, (err) => {
                        if (err) {
                            console.error('Error inserting order item:', err.message);
                        }
                    });
                });

                stmt.finalize((err) => {
                    if (err) {
                        console.error('Error finalizing statement:', err.message);
                        db.run('ROLLBACK');
                        return res.status(500).json({ message: 'Failed to save order items' });
                    }
                    db.run('COMMIT');
                    res.status(201).json({ message: 'Đặt hàng thành công!', orderId: orderId });
                });
            });
    });
});

// Get User's Order History
app.get('/api/orders', authenticateJWT, (req, res) => {
    const userId = req.user.id;

    db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC`, [userId], (err, orders) => {
        if (err) {
            console.error('Error fetching user orders:', err.message);
            return res.status(500).json({ message: 'Failed to fetch orders' });
        }

        if (orders.length === 0) {
            return res.json([]);
        }

        const ordersWithItems = [];
        let ordersProcessed = 0;

        orders.forEach(order => {
            db.all(`SELECT oi.*, p.name AS product_name FROM order_items oi
                    JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?`, [order.id], (err, items) => {
                if (err) {
                    console.error('Error fetching order items:', err.message);
                } else {
                    ordersWithItems.push({ ...order, items });
                }

                ordersProcessed++;
                if (ordersProcessed === orders.length) {
                    ordersWithItems.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
                    res.json(ordersWithItems);
                }
            });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 
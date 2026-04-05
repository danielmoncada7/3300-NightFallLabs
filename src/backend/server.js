const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// connect to database
const db = new sqlite3.Database(path.join(__dirname, "orders.db"), function (err) {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to database");
    }
});

// create orders table
db.run(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_type TEXT NOT NULL,
        address TEXT,
        email TEXT NOT NULL,
        cardholder_name TEXT NOT NULL,
        subtotal REAL NOT NULL,
        tax REAL NOT NULL,
        delivery_fee REAL NOT NULL,
        service_fee REAL NOT NULL,
        tip REAL NOT NULL,
        total REAL NOT NULL,
        items TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// create new order
app.post("/api/orders", function (req, res) {
    const {
        orderType,
        address,
        email,
        cardholderName,
        subtotal,
        tax,
        deliveryFee,
        serviceFee,
        tip,
        total,
        items
    } = req.body;

    if (!orderType || !email || !cardholderName || !items || items.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `
        INSERT INTO orders (
            order_type,
            address,
            email,
            cardholder_name,
            subtotal,
            tax,
            delivery_fee,
            service_fee,
            tip,
            total,
            items
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        orderType,
        address || "",
        email,
        cardholderName,
        subtotal,
        tax,
        deliveryFee,
        serviceFee,
        tip,
        total,
        JSON.stringify(items)
    ];

    db.run(sql, values, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: "Could not save order" });
        }

        res.status(201).json({
            message: "Order saved",
            orderId: this.lastID
        });
    });
});

// get all orders
app.get("/api/orders", function (req, res) {
    const sql = `SELECT * FROM orders ORDER BY created_at DESC`;

    db.all(sql, [], function (err, rows) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: "Could not load orders" });
        }

        res.json(rows);
    });
});

// get one order by id
app.get("/api/orders/:id", function (req, res) {
    const sql = `SELECT * FROM orders WHERE id = ?`;

    db.get(sql, [req.params.id], function (err, row) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: "Could not load order" });
        }

        if (!row) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(row);
    });
});

// start server
app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
});

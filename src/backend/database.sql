CREATE TABLE orders (
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
);

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
);

CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    ingredients TEXT,
    allergens TEXT,
    dietary_tags TEXT,
    in_stock INTEGER DEFAULT 1
);

-- Seed data only if the table is empty to prevent duplication on restart
INSERT INTO menu_items (name, description, price, category, ingredients, allergens, dietary_tags, in_stock) 
SELECT 'Classic Burger', '1/4 lb beef patty with cheese, lettuce, tomato', 8.99, 'Burgers', 'Beef, Cheese, Lettuce, Tomato, Bun', 'Dairy, Gluten', 'None', 1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Classic Burger');

INSERT INTO menu_items (name, description, price, category, ingredients, allergens, dietary_tags, in_stock) 
SELECT 'Vegan Wrap', 'Plant-based patty with fresh veggies in a spinach wrap', 7.99, 'Wraps', 'Vegan Patty, Spinach, Tomatoes', 'Gluten, Soy', 'Vegetarian, Vegan', 1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Vegan Wrap');

INSERT INTO menu_items (name, description, price, category, ingredients, allergens, dietary_tags, in_stock) 
SELECT 'Caesar Salad', 'Crisp romaine, parmesan, croutons, and Caesar dressing', 6.99, 'Salads', 'Romaine, Parmesan, Croutons, Dressing', 'Dairy, Gluten', 'Vegetarian', 1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Caesar Salad');

INSERT INTO menu_items (name, description, price, category, ingredients, allergens, dietary_tags, in_stock) 
SELECT 'Peanut Butter Bacon Burger', 'Beef patty topped with bacon and creamy peanut butter', 10.99, 'Burgers', 'Beef, Bacon, Peanut Butter, Bun', 'Gluten, Nuts', 'None', 1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Peanut Butter Bacon Burger');

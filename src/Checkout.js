const form = document.getElementById("checkoutForm");
const orderType = document.getElementById("orderType");
const address = document.getElementById("deliveryAddress");
const email = document.getElementById("contactEmail");
const name = document.getElementById("cardholderName");
const card = document.getElementById("cardNumber");
const tipInput = document.getElementById("tipAmount");
const message = document.getElementById("checkoutConfirmation");

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function generateId() {
    return "ORD-" + Date.now();
}

function validCard(num) {
    return /^\d{16}$/.test(num);
}

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            message.textContent = "Cart is empty";
            return;
        }

        if (orderType.value === "Delivery" && address.value.trim() === "") {
            message.textContent = "Enter delivery address";
            return;
        }

        if (email.value.trim() === "") {
            message.textContent = "Enter email";
            return;
        }

        if (name.value.trim() === "") {
            message.textContent = "Enter name";
            return;
        }

        if (!validCard(card.value.trim())) {
            message.textContent = "Invalid card number";
            return;
        }

        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.07;
        const delivery = orderType.value === "Delivery" ? 3.99 : 0;
        const service = 1.99;
        const tip = Number(tipInput.value) || 0;

        const total = subtotal + tax + delivery + service + tip;

        const newOrder = {
            id: generateId(),
            date: new Date().toLocaleString(),
            type: orderType.value,
            address: address.value,
            email: email.value,
            total: total,
            items: cart
        };

        const orders = getOrders();
        orders.push(newOrder);
        saveOrders(orders);

        localStorage.setItem("latestOrder", JSON.stringify(newOrder));
        localStorage.removeItem("cart");

        window.location.href = "confirmation.html";
    });
}

const form = document.getElementById("checkoutForm");
const orderType = document.getElementById("orderType");
const address = document.getElementById("deliveryAddress");
const email = document.getElementById("contactEmail");
const name = document.getElementById("cardholderName");
const card = document.getElementById("cardNumber");
const tipInput = document.getElementById("tipAmount");
const message = document.getElementById("checkoutConfirmation");

// gets cart from local storage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// gets saved orders
function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

// saves updated orders
function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// makes simple order id
function generateId() {
    return "ORD-" + Date.now();
}

// checks if card is 16 digits
function validCard(num) {
    return /^\d{16}$/.test(num);
}

// shows or hides address if pickup or delivery changes
function toggleAddress() {
    if (!orderType || !address) {
        return;
    }

    const addressGroup = document.getElementById("deliveryAddressGroup");

    if (!addressGroup) {
        return;
    }

    if (orderType.value === "Delivery") {
        addressGroup.style.display = "block";
        address.required = true;
    } else {
        addressGroup.style.display = "none";
        address.required = false;
        address.value = "";
    }
}

if (orderType) {
    orderType.addEventListener("change", toggleAddress);
    toggleAddress();
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

        cart.forEach(function (item) {
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.07;
        const delivery = orderType.value === "Delivery" ? 3.99 : 0;
        const service = 1.99;
        const tip = Number(tipInput.value) || 0;
        const total = subtotal + tax + delivery + service + tip;

        // makes the new order object
        const newOrder = {
            id: generateId(),
            date: new Date().toLocaleString(),
            type: orderType.value,
            address: address.value.trim(),
            email: email.value.trim(),
            total: total,
            items: cart
        };

        const orders = getOrders();
        orders.push(newOrder);
        saveOrders(orders);

        // saves latest order for confirmation page
        localStorage.setItem("latestOrder", JSON.stringify(newOrder));
        localStorage.removeItem("cart");

        window.location.href = "confirmation.html";
    });
}

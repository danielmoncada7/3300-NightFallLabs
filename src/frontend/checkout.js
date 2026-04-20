// 1) src/frontend/checkout.js
const form = document.getElementById("checkoutForm");
const orderType = document.getElementById("orderType");
const address = document.getElementById("deliveryAddress");
const email = document.getElementById("contactEmail");
const name = document.getElementById("cardholderName");
const card = document.getElementById("cardNumber");
const message = document.getElementById("checkoutConfirmation");

// gets cart from browser storage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// checks if card is 16 digits
function validCard(num) {
    return /^\d{16}$/.test(num);
}

// shows or hides address based on order type
function toggleAddress() {
    const addressGroup = document.getElementById("deliveryAddressGroup");

    if (!orderType || !addressGroup || !address) {
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
    form.addEventListener("submit", async function (e) {
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
        const deliveryFee = orderType.value === "Delivery" ? 3.99 : 0;
        const serviceFee = subtotal * 0.05;
        
        let tip = 0;
        // get the tip from the cart summary if it was populated there
        const summaryStr = localStorage.getItem("cartSummary");
        if (summaryStr) {
            const summary = JSON.parse(summaryStr);
            tip = summary.tip || 0;
        }
        
        const total = subtotal + tax + deliveryFee + serviceFee + tip;

        // sends order to backend
        const orderData = {
            orderType: orderType.value,
            address: address.value.trim(),
            email: email.value.trim(),
            cardholderName: name.value.trim(),
            subtotal: subtotal,
            tax: tax,
            deliveryFee: deliveryFee,
            serviceFee: serviceFee,
            tip: tip,
            total: total,
            items: cart
        };

        try {
            const response = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                message.textContent = data.message || "Order failed";
                return;
            }

            localStorage.removeItem("cart");
            window.location.href = `confirmation.html?orderId=${data.orderId}`;
        } catch (error) {
            message.textContent = "Could not connect to server";
        }
    });
}

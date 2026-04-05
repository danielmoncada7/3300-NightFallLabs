const container = document.getElementById("ordersContainer");

// gets all saved orders
function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

// loads orders onto the page
function loadOrders() {
    if (!container) {
        return;
    }

    const orders = getOrders();
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet</p>";
        return;
    }

    orders.forEach(function (order) {
        const div = document.createElement("div");
        div.className = "order-card";

        div.innerHTML = `
            <h3>Order ID: ${order.id}</h3>
            <p>Date: ${order.date}</p>
            <p>Type: ${order.type}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <p>Items:</p>
            <ul>
                ${order.items.map(function (item) {
                    return `<li>${item.name} x${item.quantity}</li>`;
                }).join("")}
            </ul>
        `;

        container.appendChild(div);
    });
}

loadOrders();

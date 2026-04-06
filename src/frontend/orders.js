const container = document.getElementById("ordersContainer");

// loads orders from backend
async function loadOrders() {
    if (!container) {
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/orders");
        const orders = await response.json();

        container.innerHTML = "";

        if (!response.ok) {
            container.innerHTML = "<p>Could not load orders</p>";
            return;
        }

        if (orders.length === 0) {
            container.innerHTML = "<p>No orders yet</p>";
            return;
        }

        orders.forEach(function (order) {
            const div = document.createElement("div");
            div.className = "order-card";

            div.innerHTML = `
                <h3>Order ID: ${order.id}</h3>
                <p>Date: ${order.created_at}</p>
                <p>Type: ${order.order_type}</p>
                <p>Total: $${Number(order.total).toFixed(2)}</p>
            `;

            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = "<p>Server error loading orders</p>";
    }
}

loadOrders();

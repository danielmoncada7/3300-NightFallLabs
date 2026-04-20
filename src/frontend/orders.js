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
            
            // Try to parse the items JSON
            let itemsHtml = "";
            if (order.items) {
                try {
                    const items = JSON.parse(order.items);
                    if (items.length > 0) {
                        itemsHtml = "<div class='order-items-list'><h4>Items:</h4><ul>";
                        items.forEach(item => {
                            itemsHtml += `<li>${item.quantity}x ${item.name} ($${Number(item.price).toFixed(2)} each)</li>`;
                        });
                        itemsHtml += "</ul></div>";
                    }
                } catch(e) {
                    console.error("Could not parse items for order " + order.id, e);
                }
            }

            // format date
            const orderDate = new Date(order.created_at).toLocaleString();

            div.innerHTML = `
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span class="order-type badge ${order.order_type.toLowerCase()}">${order.order_type}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${orderDate}</p>
                    <p><strong>Total:</strong> <span class="order-total">$${Number(order.total).toFixed(2)}</span></p>
                </div>
                ${itemsHtml}
            `;

            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = "<p>Server error loading orders</p>";
    }
}

loadOrders();

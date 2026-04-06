const message = document.getElementById("orderIdMessage");

// gets order id from the url
function getOrderIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("orderId");
}

// loads confirmation from backend
async function showOrder() {
    if (!message) {
        return;
    }

    const orderId = getOrderIdFromUrl();

    if (!orderId) {
        message.textContent = "No order found";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
        const order = await response.json();

        if (!response.ok) {
            message.textContent = "Order not found";
            return;
        }

        message.textContent = "Order ID: " + order.id;
    } catch (error) {
        message.textContent = "Could not load order";
    }
}

showOrder();

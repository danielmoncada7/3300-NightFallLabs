const message = document.getElementById("orderIdMessage");

// shows the latest order id
function showOrder() {
    if (!message) {
        return;
    }

    const order = JSON.parse(localStorage.getItem("latestOrder"));

    if (!order) {
        message.textContent = "No order found";
        return;
    }

    message.textContent = "Order ID: " + order.id;
}

showOrder();

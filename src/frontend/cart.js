document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cartContainer");
    const subtotalValue = document.getElementById("subtotalValue");
    const taxValue = document.getElementById("taxValue");
    const deliveryFeeValue = document.getElementById("deliveryFeeValue");
    const serviceFeeValue = document.getElementById("serviceFeeValue");
    const tipValue = document.getElementById("tipValue");
    const totalValue = document.getElementById("totalValue");

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        cartContainer.innerHTML = ""; // Clear existing items

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is currently empty.</p>";
            updateTotals(0);
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${Number(item.price).toFixed(2)}</p>
                    <p>
                        Quantity: 
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        ${item.quantity}
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                    <button onclick="removeItem(${index})">Remove</button>
                </div>
                <hr>
            `;
            cartContainer.appendChild(itemDiv);
        });

        updateTotals(subtotal);
    }

    function updateTotals(subtotal) {
        const taxRate = 0.07; // 7% tax
        const serviceRate = 0.05; // 5% service fee
        const deliveryFee = subtotal > 0 ? 3.99 : 0; // example $3.99 delivery fee
        const tip = 0; // standard $0 tip for now

        const tax = subtotal * taxRate;
        const serviceFee = subtotal * serviceRate;
        const finalTotal = subtotal + tax + deliveryFee + serviceFee + tip;

        subtotalValue.textContent = `$${subtotal.toFixed(2)}`;
        taxValue.textContent = `$${tax.toFixed(2)}`;
        deliveryFeeValue.textContent = `$${deliveryFee.toFixed(2)}`;
        serviceFeeValue.textContent = `$${serviceFee.toFixed(2)}`;
        tipValue.textContent = `$${tip.toFixed(2)}`;
        totalValue.textContent = `$${finalTotal.toFixed(2)}`;
        
        // Save the summary to localStorage in case we need it at checkout
        localStorage.setItem("cartSummary", JSON.stringify({
            subtotal, tax, deliveryFee, serviceFee, tip, total: finalTotal
        }));
    }

    // Expose functions globally for the onclick handlers
    window.changeQuantity = function (index, delta) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart[index]) {
            cart[index].quantity += delta;
            
            // Remove item if quantity falls to 0 or below
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart(); // Re-render
        }
    };

    window.removeItem = function (index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart(); // Re-render
    };

    // Initial render
    renderCart();
});

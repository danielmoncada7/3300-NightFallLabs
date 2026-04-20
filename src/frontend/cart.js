document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cartContainer");
    const subtotalValue = document.getElementById("subtotalValue");
    const taxValue = document.getElementById("taxValue");
    const deliveryFeeValue = document.getElementById("deliveryFeeValue");
    const serviceFeeValue = document.getElementById("serviceFeeValue");
    const tipValue = document.getElementById("tipValue");
    const tipAmountInput = document.getElementById("tipAmount");
    const totalValue = document.getElementById("totalValue");
    const tipButtons = document.querySelectorAll(".tip-btn");
    const customTipContainer = document.getElementById("customTipContainer");

    let currentSubtotal = 0;
    let selectedTipPercentage = 15; // default tip
    let isCustomTip = false;

    // Handle tip button clicks
    tipButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Unselect all buttons visually
            tipButtons.forEach(b => {
                b.classList.remove("primary-button");
                b.classList.add("secondary-button");
            });

            // Select this button
            this.classList.remove("secondary-button");
            this.classList.add("primary-button");

            if (this.id === "customTipBtn") {
                isCustomTip = true;
                customTipContainer.style.display = "flex";
            } else {
                isCustomTip = false;
                customTipContainer.style.display = "none";
                selectedTipPercentage = parseFloat(this.getAttribute("data-tip"));
            }

            updateTotals(currentSubtotal);
        });
    });

    if (tipAmountInput) {
        tipAmountInput.addEventListener('input', function() {
            if (isCustomTip) {
                // Prevent negative numbers
                if (parseFloat(tipAmountInput.value) < 0) {
                    tipAmountInput.value = "0";
                }
                updateTotals(currentSubtotal);
            }
        });
    }

    // Set default initial tip button selection visually
    const defaultTipBtn = document.querySelector(".tip-btn[data-tip='15']");
    if (defaultTipBtn) {
        defaultTipBtn.classList.remove("secondary-button");
        defaultTipBtn.classList.add("primary-button");
    }

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
                        <input type="number" min="1" value="${item.quantity}" onchange="setQuantity(${index}, this.value)" style="width: 60px; padding: 4px; border-radius: 4px; border: 1px solid var(--border-color);">
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
        currentSubtotal = subtotal; // store so tip input listener can re-use it
        
        const taxRate = 0.07; // 7% tax
        const serviceRate = 0.05; // 5% service fee
        const deliveryFee = subtotal > 0 ? 3.99 : 0; // example $3.99 delivery fee
        
        let tip = 0;
        if (subtotal > 0) {
            if (isCustomTip && tipAmountInput) {
                tip = parseFloat(tipAmountInput.value) || 0;
            } else {
                tip = subtotal * (selectedTipPercentage / 100);
                if (tipAmountInput) tipAmountInput.value = tip.toFixed(2); // sync custom input field just in case
            }
        }

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
    window.setQuantity = function (index, value) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart[index]) {
            const newQuantity = parseInt(value, 10);
            
            // Remove item if quantity falls to 0 or below, otherwise update
            if (newQuantity <= 0 || isNaN(newQuantity)) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = newQuantity;
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

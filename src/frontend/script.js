// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.getElementById("menuContainer");

    // fetch menu items from backend
    if (menuContainer) {
        fetch("http://localhost:3000/api/menu")
            .then(response => response.json())
            .then(items => {
                menuContainer.innerHTML = ""; // clear container
                
                if (items.length === 0) {
                    menuContainer.innerHTML = "<p>No menu items available right now.</p>";
                    return;
                }

                // dynamically generate HTML for each menu item
                items.forEach(item => {
                    const div = document.createElement("div");
                    div.className = "menu-item-card";
                    
                    div.innerHTML = `
                        <h2>${item.name} - $${Number(item.price).toFixed(2)}</h2>
                        <p><strong>Category:</strong> ${item.category}</p>
                        <p>${item.description}</p>
                        <p><em>Allergens:</em> ${item.allergens}</p>
                        <p><em>Dietary Tags:</em> ${item.dietary_tags}</p>
                        <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})" ${item.in_stock ? '' : 'disabled'}>
                            ${item.in_stock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    `;
                    
                    menuContainer.appendChild(div);
                });
            })
            .catch(err => {
                console.error(err);
                menuContainer.innerHTML = "<p>Server error loading menu</p>";
            });
    }
});

// universal function to add to cart stored in localStorage
function addToCart(id, name, price) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // check if it already exists to update quantity
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
}

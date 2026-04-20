let allMenuItems = [];

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.getElementById("menuContainer");
    const applyFilterButton = document.getElementById("applyFilterButton");
    const resetFiltersButton = document.getElementById("resetFiltersButton");
    const searchBtn = document.getElementById("searchBtn");

    // fetch menu items from backend
    if (menuContainer) {
        fetch("http://localhost:3000/api/menu")
            .then(response => response.json())
            .then(items => {
                allMenuItems = items; // Store the original fetched data
                renderMenu(allMenuItems);
            })
            .catch(err => {
                console.error(err);
                menuContainer.innerHTML = "<p>Server error loading menu</p>";
            });
    }

    // Function to render items dynamically
    function renderMenu(items) {
        if (!menuContainer) return;
        menuContainer.innerHTML = ""; // clear container
        
        if (items.length === 0) {
            menuContainer.innerHTML = "<p>No menu items available matching your criteria.</p>";
            return;
        }

        // dynamically generate HTML for each menu item
        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "menu-item";
            
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
    }

    // Apply Filters logic
    if (applyFilterButton) {
        applyFilterButton.addEventListener("click", () => {
            const categorySelect = document.getElementById("categoryFilter").value;
            const excludeAllergens = Array.from(document.querySelectorAll(".allergenCheckbox:checked")).map(cb => cb.value.toLowerCase());
            const requiredDietary = Array.from(document.querySelectorAll(".dietaryCheckbox:checked")).map(cb => cb.value.toLowerCase());
            const searchQuery = document.getElementById("searchBox") ? document.getElementById("searchBox").value.toLowerCase() : "";

            const filteredItems = allMenuItems.filter(item => {
                // 1. Search Query Box
                if (searchQuery && !item.name.toLowerCase().includes(searchQuery) && !item.description.toLowerCase().includes(searchQuery)) {
                    return false;
                }

                // 2. Category filter
                if (categorySelect !== "All" && item.category !== categorySelect) {
                    return false;
                }

                // 3. Allergen filter (EXCLUDE if item HAS any of the checked allergens)
                let itemAllergens = (item.allergens || "").toLowerCase();
                for (let allergen of excludeAllergens) {
                    if (itemAllergens.includes(allergen)) {
                        return false; // Item has this allergen, exclude it
                    }
                }

                // 4. Dietary filter (INCLUDE only if item HAS ALL of the checked dietary tags)
                let itemDietary = (item.dietary_tags || "").toLowerCase();
                for (let diet of requiredDietary) {
                    if (!itemDietary.includes(diet)) {
                        return false; // Item lacks this required dietary tag, exclude it
                    }
                }

                return true; // Passed all filters!
            });

            renderMenu(filteredItems);
        });
    }

    // Reset Filters logic
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener("click", () => {
            // Reset Dropdown
            const categorySelect = document.getElementById("categoryFilter");
            if (categorySelect) categorySelect.value = "All";

            // Reset Checkboxes
            document.querySelectorAll(".allergenCheckbox, .dietaryCheckbox").forEach(cb => cb.checked = false);

            // Reset Search Box
            const searchBox = document.getElementById("searchBox");
            if (searchBox) searchBox.value = "";

            // Re-render everything
            renderMenu(allMenuItems);
        });
    }

    // Search Button logic (triggers the same filter)
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            if (applyFilterButton) applyFilterButton.click();
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

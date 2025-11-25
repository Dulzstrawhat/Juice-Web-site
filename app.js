// --- 1. MENU DATA DEFINITION ---
const juiceMenu = [
    {
        name: "Berry Blast Orb",
        emoji: "🫐🍓🍌",
        description: "The classic power-up! A vibrant mix of Blueberry, Strawberry, and Banana.",
        price: 8.50,
        id: "juice-berry"
    },
    {
        name: "Sunshine Punch",
        emoji: "🥭🍊🍍",
        description: "Tropical energy surge! Mango, Orange, and Pineapple—pure Vitamin C delight.",
        price: 7.99,
        id: "juice-sunshine"
    },
    {
        name: "Green Power Potion",
        emoji: "🥬🍏🍋",
        description: "The hero's blend! Spinach, Kale, Apple, Cucumber, and a hint of Lemon for detox.",
        price: 9.00,
        id: "juice-green"
    },
    {
        name: "Dragon Fruit Dream",
        emoji: "🐉🌸🍐",
        description: "Exotic and beautiful. Dragon Fruit, Lychee, and Pear create a stunning pink elixir.",
        price: 9.50,
        id: "juice-dragon"
    },
    {
        name: "Beet Root Blitz",
        emoji: "🥕🍎🫚",
        description: "A rush of vitality! Beet, Carrot, Ginger, and Apple for amazing color and energy.",
        price: 8.25,
        id: "juice-beet"
    },
    {
        name: "Watermelon Wave",
        emoji: "🍉🍃",
        description: "The ultimate cool-down spell! Watermelon, Mint, and Lime—perfectly refreshing.",
        price: 7.50,
        id: "juice-melon"
    }
];

const sideMenu = [
    {
        name: "Chibi Choc-Chips",
        emoji: "🍪",
        description: "Soft, buttery, and packed with chocolate chips. Your small reward!",
        price: 3.00,
        id: "side-cookie"
    },
    {
        name: "Melon Pan Delight",
        emoji: "🍈🍞",
        description: "Japanese sweet bread with a crisp, melon-like crust. Ships nationwide!",
        price: 4.50,
        id: "side-melonpan"
    }
];


// --- 2. DYNAMIC RENDERING FUNCTION ---

// Function to create the HTML for a single menu item
function createMenuItemHTML(item) {
    return `
        <div class="menu-item" id="${item.id}">
            <div class="item-header">
                <span class="item-emoji">${item.emoji}</span>
                <h3 class="item-name">${item.name}</h3>
            </div>
            <p class="item-description">${item.description}</p>
            <p class="item-price">$${item.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
        </div>
    `;
}

// Function to inject all menu items into the DOM
function renderMenu() {
    const juiceContainer = document.getElementById('juice-menu');
    const sideContainer = document.getElementById('side-menu');

    // Render Juices (only if container exists on the page)
    if (juiceContainer) {
        juiceContainer.innerHTML = juiceMenu.map(createMenuItemHTML).join('');
    }

    // Render Sides (only if container exists)
    if (sideContainer) {
        sideContainer.innerHTML = sideMenu.map(createMenuItemHTML).join('');
    }
}


// --- 3. INITIALIZATION ---
// Run the function when the page loads
document.addEventListener('DOMContentLoaded', renderMenu);
// --- 4. SHOPPING CART LOGIC ---

// Load/save cart from localStorage
function loadCart() {
    try {
        const raw = localStorage.getItem('cart');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

let cart = loadCart();

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    const total = cart.reduce((s, it) => s + (it.quantity || 1), 0);
    countEl.textContent = total;
}

// Find item details by id from menus
function findItemById(id) {
    return juiceMenu.concat(sideMenu).find(i => i.id === id) || null;
}

// Add item to cart (or increase quantity)
function addToCart(id) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        const item = findItemById(id);
        if (!item) return;
        cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1, emoji: item.emoji });
    }
    saveCart(cart);
    updateCartCount();
}

// Event delegation for Add to Cart buttons
document.addEventListener('click', function(e) {
    const btn = e.target.closest && e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (!id) return;
    addToCart(id);
});

// Render cart page if present
function renderCartPage() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty. <a href="index.html">Return to menu</a></p>';
        document.getElementById('cart-total').textContent = '$0.00';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-row" data-id="${item.id}">
            <div class="cart-emoji">${item.emoji}</div>
            <div class="cart-name">${item.name}</div>
            <div class="cart-qty"><input type="number" min="1" value="${item.quantity}" class="cart-qty-input"></div>
            <div class="cart-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div><button class="remove-from-cart">Remove</button></div>
        </div>
    `).join('');

    const total = cart.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Update quantity and remove handlers on cart page
document.addEventListener('change', function(e) {
    if (!e.target.classList.contains('cart-qty-input')) return;
    const row = e.target.closest('.cart-row');
    const id = row && row.getAttribute('data-id');
    const qty = parseInt(e.target.value, 10) || 1;
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = qty;
        saveCart(cart);
        renderCartPage();
        updateCartCount();
    }
});

document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('remove-from-cart')) return;
    const row = e.target.closest('.cart-row');
    const id = row && row.getAttribute('data-id');
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
    updateCartCount();
});

// Initialize cart-related rendering when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCartPage();

    // Checkout form submission (if present)
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(ev) {
            ev.preventDefault();
            const formData = new FormData(checkoutForm);
            const customer = {
                name: formData.get('name'),
                email: formData.get('email'),
                address: formData.get('address')
            };
            const total = cart.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
            const order = {
                id: 'ORD-' + Date.now(),
                items: cart,
                total: total,
                customer: customer,
                placedAt: new Date().toISOString()
            };
            localStorage.setItem('lastOrder', JSON.stringify(order));
            // clear cart
            cart = [];
            saveCart(cart);
            updateCartCount();
            // redirect to confirmation
            window.location.href = 'confirmation.html';
        });
    }

    // Render order confirmation page if present
    const confirmationContainer = document.getElementById('confirmation-details');
    if (confirmationContainer) {
        const raw = localStorage.getItem('lastOrder');
        if (!raw) {
            confirmationContainer.innerHTML = '<p>No recent order found.</p>';
        } else {
            const order = JSON.parse(raw);
            confirmationContainer.innerHTML = `
                <h3>Thank you, ${order.customer.name}!</h3>
                <p>Your order <strong>${order.id}</strong> was placed on ${new Date(order.placedAt).toLocaleString()}.</p>
                <div class="order-list">
                    ${order.items.map(it => `<div>${it.quantity}x ${it.name} — $${(it.price * it.quantity).toFixed(2)}</div>`).join('')}
                </div>
                <p><strong>Total Paid: $${order.total.toFixed(2)}</strong></p>
            `;
        }
    }
});

// --- 5. HERO IMAGE PRELOAD (apply overlay only when image loads) ---
// If homepage (`body.home`) exists, attempt to preload `hero-bg.jpg` and
// add `hero-image` class to `body` when it successfully loads so CSS overlay
// is applied only when the image is present.
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (!document.body.classList.contains('home')) return;
        const img = new Image();
        img.onload = function() {
            document.body.classList.add('hero-image');
        };
        img.onerror = function() {
            // image failed to load — do nothing (no overlay applied)
        };
        img.src = 'hero-bg.jpg';
    } catch (e) {
        // ignore
    }
});
// Get cart
function getCart() {

    const cart =
        localStorage.getItem("circuitxCart");

    return cart ? JSON.parse(cart) : [];

}


// Save cart
function saveCart(cart) {

    localStorage.setItem(
        "circuitxCart",
        JSON.stringify(cart)
    );

}


// Calculate item count
function calculateItemCount(cart) {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


// Calculate subtotal
function calculateSubtotal(cart) {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

}


// Shipping
function calculateShipping(subtotal) {

    if (subtotal === 0) {
        return 0;
    }

    if (subtotal >= 1000) {
        return 0;
    }

    return 40;

}


// Discount
function calculateDiscount(subtotal) {

    const coupon =
        localStorage.getItem(
            "circuitxCoupon"
        );

    if (coupon === "CIRCUIT10") {

        return subtotal * 0.10;

    }

    return 0;

}


// Increase quantity
function increaseQuantity(id) {

    const cart = getCart();

    const item =
        cart.find(item => item.id == id);

    if (item) {

        item.quantity++;

    }

    saveCart(cart);

    loadCart();

}


// Decrease quantity
function decreaseQuantity(id) {

    const cart = getCart();

    const item =
        cart.find(item => item.id == id);

    if (item && item.quantity > 1) {

        item.quantity--;

    }

    saveCart(cart);

    loadCart();

}


// Remove item
function removeFromCart(id) {

    let cart = getCart();

    cart =
        cart.filter(
            item => item.id != id
        );

    saveCart(cart);

    loadCart();

}


// Apply coupon
function applyCoupon() {

    const input =
        document.getElementById(
            "couponCode"
        );

    const coupon =
        input.value.trim().toUpperCase();


    if (coupon === "CIRCUIT10") {

        localStorage.setItem(
            "circuitxCoupon",
            "CIRCUIT10"
        );

        alert(
            "Coupon applied successfully!"
        );

        loadCart();

    } else {

        alert(
            "Invalid coupon code."
        );

    }

}


// Load cart
function loadCart() {

    const cart = getCart();

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) {
        return;
    }


    // Empty cart
    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some electronic components
                    to continue shopping.
                </p>

                <a href="/browse">
                    Continue Shopping
                </a>

            </div>

        `;

        updateSummary([]);

        return;

    }


    container.innerHTML = "";


    // Display every product
    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;


        container.innerHTML += `

            <div class="cart-item">


                <div class="cart-product">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="product-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            Condition:
                            <span>
                                ${item.condition}
                            </span>
                        </p>

                        <p class="seller">
                            Seller:
                            ${item.seller}
                        </p>

                    </div>

                </div>


                <div class="product-price">

                    ₹${item.price.toFixed(2)}

                </div>


                <div>

                    <div class="quantity-control">

                        <button
                            onclick="decreaseQuantity('${item.id}')"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="increaseQuantity('${item.id}')"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div class="product-subtotal">

                    ₹${subtotal.toFixed(2)}

                </div>


                <div>

                    <button
                        class="delete-btn"
                        onclick="removeFromCart('${item.id}')"
                    >
                        🗑
                    </button>

                </div>


            </div>

        `;

    });


    updateSummary(cart);

}


// Update summary
function updateSummary(cart) {

    const subtotal =
        calculateSubtotal(cart);

    const shipping =
        calculateShipping(subtotal);

    const discount =
        calculateDiscount(subtotal);

    const total =
        subtotal +
        shipping -
        discount;


    document.getElementById(
        "cartItemCount"
    ).innerText =
        calculateItemCount(cart);


    document.getElementById(
        "navCartCount"
    ).innerText =
        calculateItemCount(cart);


    document.getElementById(
        "cartSubtotal"
    ).innerText =
        "₹" + subtotal.toFixed(2);


    document.getElementById(
        "shippingCharges"
    ).innerText =
        shipping === 0
            ? "FREE"
            : "₹" + shipping.toFixed(2);


    document.getElementById(
        "discountAmount"
    ).innerText =
        "- ₹" + discount.toFixed(2);


    document.getElementById(
        "cartTotal"
    ).innerText =
        "₹" + total.toFixed(2);

}


// Continue shopping
function continueShopping() {

    window.location.href =
        "/browse";

}


// Go to checkout
function proceedToCheckout() {

    const cart = getCart();

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }

    window.location.href =
        "/checkout";

}


// Page load
document.addEventListener(
    "DOMContentLoaded",
    loadCart
);
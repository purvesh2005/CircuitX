// Get cart
function getCheckoutCart() {

    const cart =
        localStorage.getItem("circuitxCart");

    return cart ? JSON.parse(cart) : [];

}


// Calculate subtotal
function calculateCheckoutSubtotal(cart) {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

}


// Calculate shipping
function calculateCheckoutShipping(subtotal) {

    if (subtotal === 0) {
        return 0;
    }

    if (subtotal >= 1000) {
        return 0;
    }

    return 40;

}


// Calculate discount
function calculateCheckoutDiscount(subtotal) {

    const coupon =
        localStorage.getItem(
            "circuitxCoupon"
        );

    if (coupon === "CIRCUIT10") {

        return subtotal * 0.10;

    }

    return 0;

}


// Load products
function loadCheckoutProducts() {

    const cart =
        getCheckoutCart();

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (!container) {
        return;
    }


    if (cart.length === 0) {

        container.innerHTML = `

            <div>

                <p>
                    Your cart is empty.
                </p>

                <a href="/browse">
                    Go to Browse
                </a>

            </div>

        `;

        updateCheckoutSummary([]);

        return;

    }


    container.innerHTML = "";


    cart.forEach(item => {

        container.innerHTML += `

            <div class="checkout-product">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >


                <div class="checkout-product-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        Qty: ${item.quantity}
                    </p>

                </div>


                <div class="checkout-product-price">

                    ₹${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}

                </div>

            </div>

        `;

    });


    updateCheckoutSummary(cart);

}


// Update summary
function updateCheckoutSummary(cart) {

    const subtotal =
        calculateCheckoutSubtotal(cart);

    const shipping =
        calculateCheckoutShipping(subtotal);

    const discount =
        calculateCheckoutDiscount(subtotal);

    const total =
        subtotal +
        shipping -
        discount;


    document.getElementById(
        "checkoutSubtotal"
    ).innerText =
        "₹" + subtotal.toFixed(2);


    document.getElementById(
        "checkoutShipping"
    ).innerText =
        shipping === 0
            ? "FREE"
            : "₹" + shipping.toFixed(2);


    document.getElementById(
        "checkoutDiscount"
    ).innerText =
        "- ₹" + discount.toFixed(2);


    document.getElementById(
        "checkoutTotal"
    ).innerText =
        "₹" + total.toFixed(2);

}


// Validate form
function validateCheckoutForm() {

    const fields = [
        {
            id: "fullName",
            message: "Please enter your full name."
        },
        {
            id: "phone",
            message: "Please enter your phone number."
        },
        {
            id: "email",
            message: "Please enter your email."
        },
        {
            id: "address",
            message: "Please enter your address."
        },
        {
            id: "city",
            message: "Please enter your city."
        },
        {
            id: "state",
            message: "Please select your state."
        },
        {
            id: "pincode",
            message: "Please enter your pincode."
        }
    ];


    for (const field of fields) {

        const element =
            document.getElementById(
                field.id
            );


        if (!element.value.trim()) {

            alert(field.message);

            element.focus();

            return false;

        }

    }


    const pincode =
        document.getElementById(
            "pincode"
        );


    if (!/^[0-9]{6}$/.test(pincode.value)) {

        alert(
            "Please enter a valid 6 digit pincode."
        );

        pincode.focus();

        return false;

    }


    return true;

}


// Place order
function placeOrder() {

    const cart =
        getCheckoutCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    if (!validateCheckoutForm()) {

        return;

    }


    const payment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    if (!payment) {

        alert(
            "Please select a payment method."
        );

        return;

    }


    const customer = {

        fullName:
            document.getElementById(
                "fullName"
            ).value,

        phone:
            document.getElementById(
                "phone"
            ).value,

        email:
            document.getElementById(
                "email"
            ).value,

        college:
            document.getElementById(
                "college"
            ).value,

        address:
            document.getElementById(
                "address"
            ).value,

        city:
            document.getElementById(
                "city"
            ).value,

        state:
            document.getElementById(
                "state"
            ).value,

        pincode:
            document.getElementById(
                "pincode"
            ).value

    };


    const subtotal =
        calculateCheckoutSubtotal(
            cart
        );


    const shipping =
        calculateCheckoutShipping(
            subtotal
        );


    const discount =
        calculateCheckoutDiscount(
            subtotal
        );


    const total =
        subtotal +
        shipping -
        discount;


    const order = {

        orderId:
            "CX" + Date.now(),

        customer: customer,

        items: cart,

        paymentMethod:
            payment.value,

        orderNote:
            document.getElementById(
                "orderNote"
            ).value,

        subtotal: subtotal,

        shipping: shipping,

        discount: discount,

        total: total,

        status: "Pending",

        createdAt:
            new Date().toISOString()

    };


    /*
       Temporary frontend testing.

       Later this order will be
       sent to Node.js backend.
    */

    localStorage.setItem(
        "circuitxLastOrder",
        JSON.stringify(order)
    );


    alert(
        "Order placed successfully!\n\n" +
        "Order ID: " +
        order.orderId
    );


    // Clear cart
    localStorage.removeItem(
        "circuitxCart"
    );


    localStorage.removeItem(
        "circuitxCoupon"
    );


    // Temporary redirect
    window.location.href =
        "/dashboard";

}


// Save address
function saveAddress() {

    const address = {

        fullName:
            document.getElementById(
                "fullName"
            ).value,

        phone:
            document.getElementById(
                "phone"
            ).value,

        email:
            document.getElementById(
                "email"
            ).value,

        college:
            document.getElementById(
                "college"
            ).value,

        address:
            document.getElementById(
                "address"
            ).value,

        city:
            document.getElementById(
                "city"
            ).value,

        state:
            document.getElementById(
                "state"
            ).value,

        pincode:
            document.getElementById(
                "pincode"
            ).value

    };


    localStorage.setItem(
        "circuitxAddress",
        JSON.stringify(address)
    );

}


// Load saved address
function loadSavedAddress() {

    const saved =
        localStorage.getItem(
            "circuitxAddress"
        );


    if (!saved) {
        return;
    }


    const address =
        JSON.parse(saved);


    const fields = [
        "fullName",
        "phone",
        "email",
        "college",
        "address",
        "city",
        "state",
        "pincode"
    ];


    fields.forEach(id => {

        const element =
            document.getElementById(id);


        if (element && address[id]) {

            element.value =
                address[id];

        }

    });

}


// Save address checkbox
document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCheckoutProducts();

        loadSavedAddress();


        const checkbox =
            document.getElementById(
                "saveAddress"
            );


        if (checkbox) {

            checkbox.addEventListener(
                "change",
                function () {

                    if (this.checked) {

                        saveAddress();

                    }

                }
            );

        }

    }
);
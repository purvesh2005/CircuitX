require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const db = require("./db/connection");

// Routes
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const sellRoutes = require("./routes/sellRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const browseRoutes = require("./routes/browseRoutes");
const rootRoutes = require("./routes/rootRoutes");
const productDetailRoutes = require("./routes/productDetailRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const editComponentRoutes = require("./routes/editComponentRoutes");
const profileRoutes = require("./routes/profileRoutes");

// API Routes
const apiAuthRoutes = require("./api/authRoutes");
const apiProductRoutes = require("./api/productRoutes");
const apiWishlistRoutes = require("./api/wishlistRoutes");
const apiUserRoutes = require("./api/userRoutes");

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/public")));

// SESSION
app.use(
    session({
        secret: process.env.SESSION_SECRET || "circuitx-secret",
        resave: false,
        saveUninitialized: false
    })
);

// =====================================================
// GLOBAL MIDDLEWARE - Pass logged-in user to all views
// =====================================================
app.use((req, res, next) => {

    res.locals.user = null;

    if (req.session.user_id) {

        const sql = "SELECT * FROM users WHERE user_id = ?";

        db.query(sql, [req.session.user_id], (err, results) => {

            if (!err && results.length > 0) {
                res.locals.user = results[0];
            }

            next();
        });

    } else {
        next();
    }
});

// =====================================================
// API ROUTES
// =====================================================
app.use("/api/auth", apiAuthRoutes);
app.use("/api/products", apiProductRoutes);
app.use("/api/wishlist", apiWishlistRoutes);
app.use("/api/users", apiUserRoutes);

// =====================================================
// EJS ROUTES (kept for backward compatibility)
// =====================================================
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/home", homeRoutes);
app.use("/sell", sellRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/browse", browseRoutes);
app.use("/", rootRoutes);
app.use("/productDetails", productDetailRoutes);
app.use("/categories", categoriesRoutes);
app.use("/editComponent", editComponentRoutes);
app.use("/profile", profileRoutes);

// Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
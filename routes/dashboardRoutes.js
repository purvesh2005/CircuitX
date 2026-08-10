const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {

    console.log("SESSION:", req.session);

    const userId = req.session.user_id;

    console.log("USER ID:", userId);

    const sql = "SELECT * FROM products WHERE seller_id = ?";

    db.query(sql, [userId], (err, products) => {

        if (err) {
            console.log("DB ERROR:", err);
            return res.status(500).send("Database error");
        }

        console.log("PRODUCTS:", products);

        res.render("listings/dashboard.ejs", {
            activePage: "dashboard",
            products: products
        });
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Browse route
router.get("/", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, products) => {

        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("Database error");
        }

        console.log(products);

        res.render("listings/browseComponents.ejs", {
            activePage: "browse",
            products: products
        });
    });

});

module.exports = router;
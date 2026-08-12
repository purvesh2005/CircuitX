const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/:id", (req, res) => {

    const { id } = req.params;

    const productSql = "SELECT * FROM products WHERE product_id = ?";

    db.query(productSql, [id], (err, productResults) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        if (productResults.length === 0) {
            return res.status(404).send("Product not found");
        }

        const product = productResults[0];

        const userSql = "SELECT * FROM users WHERE user_id = ?";

        db.query(userSql, [product.seller_id], (err, userResults) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Database error");
            }

            if (userResults.length === 0) {
                return res.status(404).send("Seller not found");
            }

            const user = userResults[0];

            console.log("PRODUCT:", product);
            console.log("USER:", user);

            return res.render("listings/productDetailsPage.ejs", {
                activePage: "",
                product: product,
                user: user
            });

        });

    });

});

module.exports = router;
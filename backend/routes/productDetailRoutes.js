const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");

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

            const wishsql = `
                SELECT * FROM wishlist
                WHERE product_id = ? AND user_id = ?
            `;

            db.query(wishsql, [id, req.session.user_id], (err, wishResult) => {

                const wishlist = wishResult[0] || null;

                return res.render("listings/productDetailsPage.ejs", {
                    activePage: "",
                    product: product,
                    user: user,
                    wishlist: wishlist
                });
            });
        });
    });
});

// Add to wishlist
router.post("/wishlist", (req, res) => {

    const { product_id } = req.body;
    const user_id = req.session.user_id;
    const created_at = new Date();

    if (!user_id) {
        return res.redirect("/login");
    }

    if (!product_id) {
        return res.status(400).send("Product ID is required");
    }

    // Don't add if it already exists
    const checkSql = `
        SELECT * FROM wishlist
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(checkSql, [user_id, product_id], (err, existing) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        if (existing.length > 0) {
            return res.redirect(`/productDetails/${product_id}`);
        }

        const wishlist_id = crypto.randomUUID();

        const sql = `
            INSERT INTO wishlist
            (wishlist_id, user_id, product_id, created_at)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [wishlist_id, user_id, product_id, created_at],
            (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).send(err.sqlMessage);
                }

                res.redirect(`/productDetails/${product_id}`);
            }
        );
    });
});

// Remove from wishlist
router.post("/wishlist/remove", (req, res) => {

    const { product_id } = req.body;
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.redirect("/login");
    }

    if (!product_id) {
        return res.status(400).send("Product ID is required");
    }

    const sql = `
        DELETE FROM wishlist
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [user_id, product_id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        res.redirect(`/productDetails/${product_id}`);
    });
});

module.exports = router;
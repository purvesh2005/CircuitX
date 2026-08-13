const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");

// wishlist page
router.get("/", (req, res) => {

    const userId = req.session.user_id;

    if (!userId) {
        return res.redirect("/login");
    }

    const sql = `
        SELECT products.*
        FROM wishlist
        JOIN products
        ON wishlist.product_id = products.product_id
        WHERE wishlist.user_id = ?
        ORDER BY wishlist.created_at DESC
    `;

    db.query(sql, [userId], (err, products) => {

        if (err) {
            console.log(err);
            return res.status(500).send(err.sqlMessage);
        }

        res.render("listings/wishlist.ejs", {
            activePage: "wishlist",
            products: products
        });

    });
});


// Add product to wishlist
router.post("/add", (req, res) => {

    const { product_id } = req.body;
    const user_id = req.session.user_id;
    const created_at = new Date();

    if (!user_id) {
        return res.redirect("/login");
    }

    if (!product_id) {
        return res.status(400).send("Product ID is required");
    }

    const backUrl = req.get("Referer") || "/wishlist";

    // Don't add if it already exists in wishlist
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
            return res.redirect(backUrl);
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

                res.redirect(backUrl);
            }
        );
    });
});


// Remove one item from wishlist
router.post("/delete/:productId", (req, res) => {

    const { productId } = req.params;
    const userId = req.session.user_id;

    if (!userId) {
        return res.redirect("/login");
    }

    const sql = `
        DELETE FROM wishlist
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [userId, productId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        res.redirect("/wishlist");
    });
});


// Remove all items from wishlist
router.post("/delete-all", (req, res) => {

    const userId = req.session.user_id;

    if (!userId) {
        return res.redirect("/login");
    }

    const sql = `
        DELETE FROM wishlist
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        res.redirect("/wishlist");
    });
});


module.exports = router;
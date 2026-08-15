const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");

// ================= GET WISHLIST =================
router.get("/", (req, res) => {
    const userId = req.session.user_id;

    if (!userId) {
        return res.status(401).json({ error: "Please login first" });
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
            return res.status(500).json({ error: err.sqlMessage });
        }

        res.json({ products });
    });
});

// ================= ADD TO WISHLIST =================
router.post("/add", (req, res) => {
    const { product_id } = req.body;
    const user_id = req.session.user_id;
    const created_at = new Date();

    if (!user_id) {
        return res.status(401).json({ error: "Please login first" });
    }

    if (!product_id) {
        return res.status(400).json({ error: "Product ID is required" });
    }

    const checkSql = `
        SELECT * FROM wishlist
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(checkSql, [user_id, product_id], (err, existing) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (existing.length > 0) {
            return res.json({ message: "Already in wishlist" });
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
                    return res.status(500).json({ error: err.sqlMessage });
                }

                res.status(201).json({ message: "Added to wishlist" });
            }
        );
    });
});

// ================= REMOVE ALL FROM WISHLIST =================
router.delete("/", (req, res) => {
    const userId = req.session.user_id;

    if (!userId) {
        return res.status(401).json({ error: "Please login first" });
    }

    const sql = `
        DELETE FROM wishlist
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Wishlist cleared" });
    });
});

// ================= REMOVE FROM WISHLIST =================
router.delete("/:productId", (req, res) => {
    const { productId } = req.params;
    const userId = req.session.user_id;

    if (!userId) {
        return res.status(401).json({ error: "Please login first" });
    }

    const sql = `
        DELETE FROM wishlist
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [userId, productId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Removed from wishlist" });
    });
});

module.exports = router;


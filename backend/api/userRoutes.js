const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// ================= GET PROFILE =================
router.get("/profile", (req, res) => {
    const userId = req.session.user_id;

    if (!userId) {
        return res.status(401).json({ error: "Please login first" });
    }

    const sql = "SELECT user_id, name, email, college, phone, profile_image, created_at FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log("DATABASE ERROR:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];

        // Get user's listing count
        const listingSql = "SELECT COUNT(*) AS total FROM products WHERE seller_id = ?";

        db.query(listingSql, [userId], (err, listingResult) => {
            const stats = {
                total_listings: listingResult[0]?.total || 0,
                total_views: 0
            };

            res.json({ user, stats });
        });
    });
});

// ================= UPDATE PROFILE =================
router.put("/profile", (req, res) => {
    const userId = req.session.user_id;

    if (!userId) {
        return res.status(401).json({ error: "Please login first" });
    }

    const { name, email, phone, college } = req.body;

    if (!name || !email || !phone || !college) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `
        UPDATE users
        SET name = ?, email = ?, phone = ?, college = ?
        WHERE user_id = ?
    `;

    db.query(sql, [name, email, phone, college, userId], (err, result) => {
        if (err) {
            console.log("PROFILE UPDATE ERROR:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Profile updated successfully" });
    });
});

module.exports = router;
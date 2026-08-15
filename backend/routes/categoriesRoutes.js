const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Dashboard route with real category counts from DB
router.get("/", (req, res) => {

    const sql = `
        SELECT category, COUNT(*) AS item_count
        FROM products
        GROUP BY category
        ORDER BY item_count DESC
    `;

    db.query(sql, (err, categoryCounts) => {

        if (err) {
            console.log("Category count error:", err);
            return res.status(500).send("Database error");
        }

        // Pass counts as an object: { "Microcontrollers": 5, "Sensors": 3, ... }
        const counts = {};
        categoryCounts.forEach(row => {
            counts[row.category] = row.item_count;
        });

        res.render("listings/categories.ejs", {
            activePage: "categories",
            counts: counts
        });
    });
});

module.exports = router;
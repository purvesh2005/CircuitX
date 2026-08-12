const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {

    const { category, condition } = req.query;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM products";
    let values = [];

    let filters = [];

    if (category) {
        filters.push("category = ?");
        values.push(category);
    }

    if (condition) {
        filters.push("`condition` = ?");
        values.push(condition);
    }

    if (filters.length > 0) {
        sql += " WHERE " + filters.join(" AND ");
    }

    // Newest first
    sql += " ORDER BY created_at DESC";

    // Pagination
    sql += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    db.query(sql, values, (err, products) => {

        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("Database error");
        }

        // Count total products
        let countSql = "SELECT COUNT(*) AS total FROM products";
        let countValues = [];

        if (filters.length > 0) {
            countSql += " WHERE " + filters.join(" AND ");
            countValues = values.slice(0, -2);
        }

        db.query(countSql, countValues, (err, result) => {

            if (err) {
                console.log("Count error:", err);
                return res.status(500).send("Database error");
            }

            const totalProducts = result[0].total;
            const totalPages = Math.ceil(totalProducts / limit);

            res.render("listings/browseComponents.ejs", {
                activePage: "browse",
                products: products,
                category: category,
                condition: condition,

                currentPage: page,
                totalPages: totalPages
            });
        });
    });
});

module.exports = router;
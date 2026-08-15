const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {

    const { category, condition, search, location, maxPrice, sort } = req.query;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM products";
    let countSql = "SELECT COUNT(*) AS total FROM products";
    let values = [];
    let countValues = [];
    const filters = [];
    const countFilters = [];

    if (category) {
        filters.push("category = ?");
        countFilters.push("category = ?");
        values.push(category);
        countValues.push(category);
    }

    if (condition) {
        filters.push("`condition` = ?");
        countFilters.push("`condition` = ?");
        values.push(condition);
        countValues.push(condition);
    }

    if (search) {
        filters.push("product_name LIKE ?");
        countFilters.push("product_name LIKE ?");
        values.push(`%${search}%`);
        countValues.push(`%${search}%`);
    }

    if (location) {
        filters.push("city = ?");
        countFilters.push("city = ?");
        values.push(location);
        countValues.push(location);
    }

    if (maxPrice && maxPrice > 0) {
        filters.push("Price <= ?");
        countFilters.push("Price <= ?");
        values.push(Number(maxPrice));
        countValues.push(Number(maxPrice));
    }

    if (filters.length > 0) {
        const whereClause = " WHERE " + filters.join(" AND ");
        sql += whereClause;
        countSql += " WHERE " + countFilters.join(" AND ");
    }

    // Sorting
    let orderBy = " ORDER BY created_at DESC";
    if (sort === "price-low") {
        orderBy = " ORDER BY Price ASC";
    } else if (sort === "price-high") {
        orderBy = " ORDER BY Price DESC";
    }

    sql += orderBy;

    // Pagination
    sql += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    db.query(sql, values, (err, products) => {

        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("Database error");
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
                search: search,
                location: location,
                maxPrice: maxPrice,
                sort: sort,
                currentPage: page,
                totalPages: totalPages
            });
        });
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// wishlist route
router.get("/", (req, res) => {

    const sql = `
        SELECT products.*
        FROM wishlist
        JOIN products
        ON wishlist.product_id = products.product_id
        WHERE wishlist.user_id = ?
    `;

    db.query(sql, [req.session.user_id], (err, products) => {

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

module.exports = router;

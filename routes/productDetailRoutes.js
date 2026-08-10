const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//sell route
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM products WHERE product_id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) {
            return res.status(404).send("Product not found");
        }

        const product = results[0];

        res.render("listings/productDetailsPage.ejs", {
            activePage: "",
            product: product
        });

    });

});


module.exports = router;
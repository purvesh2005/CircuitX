const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");

//sell route
router.get("/",(req,res)=>{
    res.render("listings/addNewComponent.ejs",{activePage: ""});
});

//user listing product
router.post("/", (req, res) => {

    const created_at = new Date();
    const seller_id = "10eefbd3-ceac-4fec-a5fb-e3139f6b65f7" ;
    const product_id = crypto.randomUUID();

    const {
        title,
        category,
        condition,
        price,
        originalPrice,
        quantity,
        description,
        city,
        state,
        date
    } = req.body;

    const sql = `
        INSERT INTO products
        (
        product_id,
        seller_id,
            product_name,
            category,
            Product_condition,
            Price,
            original_price,
            quantity,
            description,
            city,
            state,
            purchase_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

    const values = [
        product_id,
        seller_id,
        title,
        category,
        condition,
        price,
        originalPrice || null,
        quantity,
        description,
        city,
        state,
        date || null
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("Failed to add product");
        }

        console.log("Product added successfully");
        console.log("Product ID:", result.insertId);

        res.send("Product added successfully");

    });

});
module.exports = router;
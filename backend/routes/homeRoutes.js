const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//home route
router.get("/",async(req,res)=>{
   const checkSql = ` SELECT *
    FROM products
    ORDER BY created_at DESC
    LIMIT 5`;
db.query(checkSql, (err, products) => {
    if (err) {
        console.error(err);
        return res.status(500).send("Database error");
    }

    res.render("listings/homePage", {
        products: products,
        activePage: "home"
    });
});
});

module.exports = router;
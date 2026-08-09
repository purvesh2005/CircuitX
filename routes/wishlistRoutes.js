const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// wishlist route
router.get("/",(req,res)=>{
    res.render("listings/wishlist.ejs",{activePage: "wishlist"});
});

module.exports = router;

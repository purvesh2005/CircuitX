const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//dashboard route
router.get("/",(req,res)=>{
    res.render("listings/categories.ejs",{activePage: "categories"});
});

module.exports = router;
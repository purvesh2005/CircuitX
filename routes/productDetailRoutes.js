const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//sell route
router.get("/",(req,res)=>{
    res.render("listings/productDetailsPage.ejs",{activePage: ""});
});

module.exports = router;
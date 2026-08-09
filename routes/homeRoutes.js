const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//home route
router.get("/",(req,res)=>{
    res.render("listings/homePage.ejs",{activePage: "home"});
});

module.exports = router;
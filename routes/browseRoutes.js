const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//browse route
router.get("/",(req,res)=>{
    res.render("listings/browseComponents.ejs",{activePage: "browse"});
});

module.exports = router;
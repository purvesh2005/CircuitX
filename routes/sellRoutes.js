const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//sell route
router.get("/",(req,res)=>{
    res.render("listings/addNewComponent.ejs",{activePage: ""});
});

module.exports = router;
const express = require("express");
const router = express.Router();

//root route
router.get("/",(req,res)=>{
    res.send("root");
});

module.exports = router;
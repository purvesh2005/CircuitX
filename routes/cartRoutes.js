const express = require("express");

const router = express.Router();


// Cart page
router.get("/", (req, res) => {

    res.render("cart");

});


module.exports = router;
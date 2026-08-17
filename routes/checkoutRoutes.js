const express = require("express");

const router = express.Router();


router.get("/checkout", (req, res) => {

    res.render("checkout");

});


module.exports = router;
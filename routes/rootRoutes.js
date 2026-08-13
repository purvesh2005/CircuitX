const express = require("express");
const router = express.Router();

//root route - redirect to home
router.get("/",(req,res)=>{
    res.redirect("/home");
});

//logout route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
        }
        res.redirect("/login");
    });
});

module.exports = router;

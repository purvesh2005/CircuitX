const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//login route
router.get("/",(req,res)=>{
    res.render("listings/loginPage.ejs");
});

/*user is loging in here if user existed then redirect to home page 
else redirect to registration page*/
router.post("/", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        // User not registered
        if (result.length === 0) {
            return res.render("listings/loginPage.ejs", {
                error: "User is not registered"
            });
        }

        const user = result[0];

        // Wrong password
        if (user.password !== password) {
            return res.render("listings/loginPage.ejs", {
                error: "Wrong password"
            });
        }

        // Login successful
        res.redirect("/home");
    });
});

module.exports = router;
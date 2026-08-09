const express = require("express");
const router = express.Router();
const db = require("../db/connection");

//user registration route
router.get("/",(req,res)=>{
    res.render("listings/registerPage.ejs");
});

//user creating account for first time and listing in database
router.post("/", (req, res) => {
    const { username, email, password, college } = req.body;

    // 1. Check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, results) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.render("listings/registerPage.ejs", {
                error: "something went wrong"
            });
        }

        // 2. User already exists
        if (results.length > 0) {
           return res.render("listings/loginPage.ejs", {
                error: "User already exists"
            });
        }

        // 3. User doesn't exist → create account
        const insertSql = `
            INSERT INTO users (username, email, password , collegeName)
            VALUES (?, ?, ? ,?)
        `;

        db.query(
            insertSql,
            [username, email, password , college],
            (err, result) => {

                if (err) {
                    console.log("MYSQL ERROR:", err);
                    return res.render("listings/registerPage.ejs", {
                error: err
            });
                }

                console.log("User created:", result.insertId);

                res.render("listings/loginPage.ejs");
            }
        );
    });
});

module.exports = router;
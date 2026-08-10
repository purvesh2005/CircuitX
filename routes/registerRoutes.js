const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");

// User registration page
router.get("/", (req, res) => {
    res.render("listings/registerPage.ejs");
});

// User creating account
router.post("/", (req, res) => {

    const { username, email, password, college, phone} = req.body;

    // Check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, results) => {

        if (err) {
            console.log("MYSQL ERROR:", err);

            return res.render("listings/registerPage.ejs", {
                error: "Something went wrong"
            });
        }

        // User already exists
        if (results.length > 0) {

            return res.render("listings/loginPage.ejs", {
                error: "User already exists"
            });
        }

        // Generate UUID
        const userId = crypto.randomUUID();
        const created_at = new Date();

        // User doesn't exist → create account
        const insertSql = `
            INSERT INTO users 
            (user_id, name, email, password, college,phone,created_at)
            VALUES (?, ?, ?, ?, ?,?,?)
        `;

        db.query(
            insertSql,
            [userId, username, email, password, college,phone,created_at],
            (err, result) => {

                if (err) {
                    console.log("MYSQL ERROR:", err);

                    return res.render("listings/registerPage.ejs", {
                        error: "Something went wrong"
                    });
                }

                console.log("User created:", userId);

                res.render("listings/loginPage.ejs");
            }
        );
    });
});

module.exports = router;
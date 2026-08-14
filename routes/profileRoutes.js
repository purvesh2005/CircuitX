const express = require("express");
const router = express.Router();
const db = require("../db/connection");


// ================= PROFILE PAGE =================

router.get("/", (req, res) => {

    const userId = req.session.user_id;

    console.log("USER ID:", userId);

    // User not logged in
    if (!userId) {
        return res.redirect("/login");
    }

    const sql = "SELECT * FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.log("================================");
            console.log("DATABASE ERROR:");
            console.log(err);
            console.log("MESSAGE:", err.message);
            console.log("SQL MESSAGE:", err.sqlMessage);
            console.log("================================");

            return res.status(500).send("Database error");
        }


        console.log("RESULTS:", results);


        // User not found
        if (results.length === 0) {
            return res.redirect("/login");
        }


        const user = results[0];


        // Temporary stats
        const stats = {
            total_listings: 0,
            total_views: 0
        };


        res.render("listings/profilePage.ejs", {

            activePage: "profile",

            user: user,

            stats: stats

        });

    });

});


// ================= UPDATE PROFILE =================

router.post("/", (req, res) => {

    const userId = req.session.user_id;

    if (!userId) {
        return res.redirect("/login");
    }


    const {
        name,
        email,
        phone,
        college
    } = req.body;


    const sql = `
        UPDATE users
        SET
            name = ?,
            email = ?,
            phone = ?,
            college = ?
        WHERE user_id = ?
    `;


    db.query(
        sql,
        [
            name,
            email,
            phone,
            college,
            userId
        ],
        (err, result) => {

            if (err) {

                console.log("PROFILE UPDATE ERROR:", err);

                return res.status(500).send("Database error");
            }


            res.redirect("/profile");

        }
    );

});


module.exports = router;
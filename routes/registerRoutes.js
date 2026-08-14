const express = require("express");
const router = express.Router();

const db = require("../db/connection");
const crypto = require("crypto");

const imagekit = require("../config/imagekit.js");
const { toFile } = require("@imagekit/nodejs");

const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }

    }
});


// ================= REGISTER PAGE =================

router.get("/", (req, res) => {

    res.render("listings/registerPage.ejs");

});


// ================= CREATE ACCOUNT =================

router.post("/", upload.single("profile_image"), async(req, res) => {

    const {
        username,
        email,
        password,
        college,
        phone
    } = req.body;


    const checkSql = `
        SELECT user_id
        FROM users
        WHERE email = ?
    `;


    db.query(checkSql, [email], async(err, results) => {

        if (err) {

            console.log(err);

            return res.render(
                "listings/registerPage.ejs",
                {
                    error: "Something went wrong"
                }
            );

        }


        // User already exists
        if (results.length > 0) {

            return res.render(
                "listings/registerPage.ejs",
                {
                    error: "User already exists"
                }
            );

        }


        const userId = crypto.randomUUID();

        const created_at = new Date();

        const fileName =
    `profile_${userId}_${Date.now()}.jpg`;

const uploadResponse =
    await imagekit.files.upload({

        file: await toFile(
            req.file.buffer,
            fileName
        ),

        fileName: fileName,

        folder: "/CircuitX/profile"

    });

    const profileImageUrl = uploadResponse.url;


        const insertSql = `
            INSERT INTO users
            (
                user_id,
                name,
                email,
                password,
                college,
                phone,
                created_at,
                profile_image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `;


        db.query(
            insertSql,
            [
                userId,
                username,
                email,
                password,
                college,
                phone,
                created_at,
                profileImageUrl
            ],
            (err) => {

                if (err) {

                    console.log(err);

                    return res.render(
                        "listings/registerPage.ejs",
                        {
                            error: "Something went wrong"
                        }
                    );

                }


                res.render("listings/loginPage.ejs");

            }
        );

    });

});


module.exports = router;
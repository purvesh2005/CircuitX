const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");
const multer = require("multer");
const imagekit = require("../config/imagekit");
const { toFile } = require("@imagekit/nodejs");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

// ================= GET CURRENT USER =================
router.get("/me", (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const sql = "SELECT user_id, name, email, college, phone, profile_image, created_at FROM users WHERE user_id = ?";

    db.query(sql, [req.session.user_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user: results[0] });
    });
});

// ================= LOGIN =================
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: "User is not registered" });
        }

        const user = result[0];

        if (user.password !== password) {
            return res.status(401).json({ error: "Wrong password" });
        }

        req.session.user_id = user.user_id;

        console.log("Logged in User ID:", req.session.user_id);

        res.json({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                college: user.college,
                phone: user.phone,
                profile_image: user.profile_image
            }
        });
    });
});

// ================= REGISTER =================
router.post("/register", upload.single("profile_image"), async (req, res) => {
    const { username, email, password, college, phone } = req.body;

    if (!username || !email || !password || !college || !phone) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
        return res.status(400).json({ error: "Profile image is required" });
    }

    const checkSql = "SELECT user_id FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Something went wrong" });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        try {
            const userId = crypto.randomUUID();
            const created_at = new Date();
            const fileName = `profile_${userId}_${Date.now()}.jpg`;

            const uploadResponse = await imagekit.files.upload({
                file: await toFile(req.file.buffer, fileName),
                fileName: fileName,
                folder: "/CircuitX/profile"
            });

            const profileImageUrl = uploadResponse.url;

            const insertSql = `
                INSERT INTO users
                (user_id, name, email, password, college, phone, created_at, profile_image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [userId, username, email, password, college, phone, created_at, profileImageUrl],
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Something went wrong" });
                    }

                    res.status(201).json({
                        message: "Registration successful",
                        user: {
                            user_id: userId,
                            name: username,
                            email: email,
                            college: college,
                            phone: phone,
                            profile_image: profileImageUrl
                        }
                    });
                }
            );
        } catch (error) {
            console.error("ImageKit upload error:", error);
            return res.status(500).json({ error: "Failed to upload profile image" });
        }
    });
});

// ================= LOGOUT =================
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ message: "Logout successful" });
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");
const multer = require("multer");
const imagekit = require("../config/imagekit");
const { toFile } = require("@imagekit/nodejs");
const sharp = require("sharp");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, JPEG and PNG images are allowed"));
        }
    }
});

// Show edit form for a product
router.get("/:id", (req, res) => {

    const { id } = req.params;

    // User must be logged in
    if (!req.session.user_id) {
        return res.redirect("/login");
    }

    const sql = "SELECT * FROM products WHERE product_id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) {
            return res.status(404).send("Product not found");
        }

        const products = results[0];

        // Only the owner can edit
        if (products.seller_id !== req.session.user_id) {
            return res.status(403).send("You can only edit your own components");
        }

        res.render("listings/editComponent.ejs", {
            activePage: "",
            products: products
        });

    });
});

// Update product
router.post("/:id", upload.single("image"), async (req, res) => {

    const { id } = req.params;

    // User must be logged in
    if (!req.session.user_id) {
        return res.redirect("/login");
    }

    try {

        // Verify ownership before updating
        const checkSql = "SELECT seller_id FROM products WHERE product_id = ?";

        db.query(checkSql, [id], (err, results) => {

            if (err) {
                console.log("Ownership check error:", err);
                return res.status(500).send("Database error");
            }

            if (results.length === 0) {
                return res.status(404).send("Product not found");
            }

            if (results[0].seller_id !== req.session.user_id) {
                return res.status(403).send("You can only edit your own components");
            }

            // Proceed with update
            updateProduct(req, res, id);
        });

    } catch (error) {
        console.error("Update product error:", error);
        return res.status(500).send("Failed to update component");
    }
});

// Helper function to perform the actual update
async function updateProduct(req, res, id) {

    try {

        const {
            title,
            category,
            condition,
            price,
            originalPrice,
            quantity,
            description,
            city,
            state,
            date
        } = req.body;

        // If a new image is uploaded, compress + upload to ImageKit and update image_url/file_id
        let newImageUrl = null;
        let newImageFileId = null;

        if (req.file) {

            const MAX_SIZE = 2 * 1024 * 1024;
            let quality = 80;
            let width = 1200;
            let compressedImage;

            while (true) {
                compressedImage = await sharp(req.file.buffer)
                    .resize({
                        width: width,
                        height: width,
                        fit: "inside",
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: quality })
                    .toBuffer();

                if (compressedImage.length <= MAX_SIZE) break;

                if (quality > 40) {
                    quality -= 10;
                } else {
                    width -= 200;
                }

                if (width < 400) {
                    return res.status(400).send("Unable to compress image below 2 MB");
                }
            }

            const uploadResponse = await imagekit.files.upload({
                file: await toFile(compressedImage, `${id}.jpg`),
                fileName: `${id}.jpg`,
                folder: "/CircuitX/components"
            });

            newImageUrl = uploadResponse.url;
            newImageFileId = uploadResponse.fileId;
        }

        // Recalculate discount
        let num = 0;
        if (price && originalPrice && originalPrice > 0) {
            num = 100 - ((price / originalPrice) * 100);
        }
        const discount = Number(num.toFixed(2));

        // Build dynamic SQL for update
        let sql = `
            UPDATE products SET
                product_name = ?,
                category = ?,
                Product_condition = ?,
                Price = ?,
                original_price = ?,
                quantity = ?,
                description = ?,
                city = ?,
                state = ?,
                purchase_date = ?,
                discount = ?
        `;

        const values = [
            title,
            category,
            condition,
            price,
            originalPrice || null,
            quantity,
            description,
            city,
            state,
            date || null,
            discount
        ];

        if (newImageUrl && newImageFileId) {
            sql += `, image_url = ? , image_file_id = ?`;
            values.push(newImageUrl, newImageFileId);
        }

        sql += ` WHERE product_id = ?`;
        values.push(id);

        db.query(sql, values, (err, result) => {

            if (err) {
                console.log("Update error:", err);
                return res.status(500).send("Failed to update product");
            }

            console.log("Product updated successfully:", id);
            res.redirect("/dashboard");
        });

    } catch (error) {
        console.error("Update product error:", error);
        return res.status(500).send("Failed to update component");
    }
}

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");
const multer = require("multer");
const imagekit = require("../config/imagekit");
const { toFile } = require("@imagekit/nodejs");
const sharp = require("sharp");

// Store uploaded image temporarily in RAM
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, JPEG and PNG images are allowed"));
        }
    }
});


// Sell route
router.get("/", (req, res) => {

    // User must be logged in to sell
    if (!req.session.user_id) {
        return res.redirect("/login");
    }

    res.render(
        "listings/addNewComponent.ejs",
        {
            activePage: ""
        }
    );

});


// User listing product
router.post(
    "/",
    upload.single("image"),
    async (req, res) => {

        try {

            const seller_id = req.session.user_id;
            const product_id = crypto.randomUUID();


            // Check if image exists
            if (!req.file) {

                return res
                    .status(400)
                    .send("Component image is required");

            }

// Compress image before uploading to ImageKit

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

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
        .jpeg({
            quality: quality
        })
        .toBuffer();

    console.log(
        `Quality: ${quality}, Width: ${width}, Size: ${(compressedImage.length / 1024 / 1024).toFixed(2)} MB`
    );

    // Stop when image is below 2 MB
    if (compressedImage.length <= MAX_SIZE) {
        break;
    }

    // First reduce quality
    if (quality > 40) {
        quality -= 10;
    }

    // Then reduce dimensions
    else {
        width -= 200;
    }

    // Safety condition
    if (width < 400) {
        return res
            .status(400)
            .send("Unable to compress image below 2 MB");
    }
}


// Upload compressed image to ImageKit

console.log("Starting ImageKit upload...");

const uploadResponse = await imagekit.files.upload({
    file: await toFile(
        compressedImage,
        `${product_id}.jpg`
    ),
    fileName: `${product_id}.jpg`,
    folder: "/CircuitX/components"
});

console.log("ImageKit upload successful!");
//geting img url and id
const image_url = uploadResponse.url;
const image_file_id = uploadResponse.fileId;

console.log("Image URL:", image_url);


           


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

            const num = 100-((price/originalPrice)*100);

            const discount = Number(num.toFixed(2));



            // Insert product into MySQL
            const sql = `
                INSERT INTO products
                (
                    product_id,
                    seller_id,
                    product_name,
                    category,
                    Product_condition,
                    Price,
                    original_price,
                    quantity,
                    description,
                    city,
                    state,
                    purchase_date,
                    image_url,
                    image_file_id,
                    discount
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;


            const values = [
                product_id,
                seller_id,
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
                image_url,
                image_file_id,
                discount
            ];


            db.query(
                sql,
                values,
                (err, result) => {

                    if (err) {

                        console.log(
                            "Database error:",
                            err
                        );

                        return res
                            .status(500)
                            .send(
                                "Failed to add product"
                            );

                    }


                    console.log(
                        "Product added successfully"
                    );

                    console.log(
                        "Product ID:",
                        product_id
                    );

                    console.log(
                        "Image URL:",
                        image_url
                    );


                    res.redirect("/dashboard");

                }
            );

        } catch (error) {

            console.error(
                "ImageKit/Product error:",
                error
            );

            return res
                .status(500)
                .send(
                    "Failed to add component"
                );

        }

    }
);


module.exports = router;
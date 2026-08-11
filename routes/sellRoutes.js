const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const crypto = require("crypto");
const multer = require("multer");
const imagekit = require("../config/imagekit");
const { toFile } = require("@imagekit/nodejs");

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


            // Upload image to ImageKit
            console.log("Starting ImageKit upload...");

                const uploadResponse = await imagekit.files.upload({
                    file: await toFile(
                     req.file.buffer,
                     req.file.originalname
                           ),
                    fileName: req.file.originalname,
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
                    image_file_id
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                image_file_id
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
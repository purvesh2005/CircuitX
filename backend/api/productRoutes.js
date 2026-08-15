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

// ================= GET ALL PRODUCTS (with filters) =================
router.get("/", (req, res) => {
    const { category, condition, search, location, maxPrice, sort } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM products";
    let countSql = "SELECT COUNT(*) AS total FROM products";
    let values = [];
    let countValues = [];
    const filters = [];
    const countFilters = [];

    if (category) {
        filters.push("category = ?");
        countFilters.push("category = ?");
        values.push(category);
        countValues.push(category);
    }

    if (condition) {
        filters.push("Product_condition = ?");
        countFilters.push("Product_condition = ?");
        values.push(condition);
        countValues.push(condition);
    }

    if (search) {
        filters.push("product_name LIKE ?");
        countFilters.push("product_name LIKE ?");
        values.push(`%${search}%`);
        countValues.push(`%${search}%`);
    }

    if (location) {
        filters.push("city = ?");
        countFilters.push("city = ?");
        values.push(location);
        countValues.push(location);
    }

    if (maxPrice && maxPrice > 0) {
        filters.push("Price <= ?");
        countFilters.push("Price <= ?");
        values.push(Number(maxPrice));
        countValues.push(Number(maxPrice));
    }

    if (filters.length > 0) {
        const whereClause = " WHERE " + filters.join(" AND ");
        sql += whereClause;
        countSql += " WHERE " + countFilters.join(" AND ");
    }

    let orderBy = " ORDER BY created_at DESC";
    if (sort === "price-low") {
        orderBy = " ORDER BY Price ASC";
    } else if (sort === "price-high") {
        orderBy = " ORDER BY Price DESC";
    }

    sql += orderBy;
    sql += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    db.query(sql, values, (err, products) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        db.query(countSql, countValues, (err, result) => {
            if (err) {
                console.log("Count error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const totalProducts = result[0].total;
            const totalPages = Math.ceil(totalProducts / limit);

            res.json({
                products,
                totalProducts,
                totalPages,
                currentPage: page
            });
        });
    });
});

// ================= GET LATEST PRODUCTS (home page) =================
router.get("/latest", (req, res) => {
    const sql = "SELECT * FROM products ORDER BY created_at DESC LIMIT 5";

    db.query(sql, (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ products });
    });
});

// ================= GET CATEGORIES =================
router.get("/categories/list", (req, res) => {
    const sql = `
        SELECT category, COUNT(*) AS item_count
        FROM products
        GROUP BY category
        ORDER BY item_count DESC
    `;

    db.query(sql, (err, categoryCounts) => {
        if (err) {
            console.log("Category count error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const counts = {};
        categoryCounts.forEach(row => {
            counts[row.category] = row.item_count;
        });

        res.json({ counts });
    });
});

// ================= GET PRODUCTS BY SELLER (dashboard) =================
router.get("/seller/:sellerId", (req, res) => {
    const { sellerId } = req.params;

    if (!req.session.user_id || req.session.user_id !== sellerId) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const sql = "SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC";

    db.query(sql, [sellerId], (err, products) => {
        if (err) {
            console.log("DB ERROR:", err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ products });
    });
});

// ================= GET PRODUCT BY ID =================
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const productSql = "SELECT * FROM products WHERE product_id = ?";

    db.query(productSql, [id], (err, productResults) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (productResults.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const product = productResults[0];

        const userSql = "SELECT user_id, name, email, college, phone, profile_image FROM users WHERE user_id = ?";

        db.query(userSql, [product.seller_id], (err, sellerResults) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database error" });
            }

            if (sellerResults.length === 0) {
                return res.status(404).json({ error: "Seller not found" });
            }

            const seller = sellerResults[0];

            // Check if product is in user's wishlist
            const wishsql = `
                SELECT * FROM wishlist
                WHERE product_id = ? AND user_id = ?
            `;

            db.query(wishsql, [id, req.session.user_id], (err, wishResult) => {
                const wishlist = wishResult[0] || null;

                res.json({
                    product,
                    seller,
                    wishlist
                });
            });
        });
    });
});

// ================= CREATE PRODUCT =================
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.status(401).json({ error: "Please login first" });
        }

        const seller_id = req.session.user_id;
        const product_id = crypto.randomUUID();

        if (!req.file) {
            return res.status(400).json({ error: "Component image is required" });
        }

        // Compress image before uploading to ImageKit
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
                return res.status(400).json({ error: "Unable to compress image below 2 MB" });
            }
        }

        const uploadResponse = await imagekit.files.upload({
            file: await toFile(compressedImage, `${product_id}.jpg`),
            fileName: `${product_id}.jpg`,
            folder: "/CircuitX/components"
        });

        const image_url = uploadResponse.url;
        const image_file_id = uploadResponse.fileId;

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

        const num = 100 - ((price / originalPrice) * 100);
        const discount = Number(num.toFixed(2));

        const sql = `
            INSERT INTO products
            (
                product_id, seller_id, product_name, category,
                Product_condition, Price, original_price, quantity,
                description, city, state, purchase_date,
                image_url, image_file_id, discount
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

        db.query(sql, values, (err, result) => {
            if (err) {
                console.log("Database error:", err);
                return res.status(500).json({ error: "Failed to add product" });
            }

            res.status(201).json({
                message: "Product added successfully",
                product_id
            });
        });

    } catch (error) {
        console.error("ImageKit/Product error:", error);
        return res.status(500).json({ error: "Failed to add component" });
    }
});

// ================= UPDATE PRODUCT =================
router.put("/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;

    if (!req.session.user_id) {
        return res.status(401).json({ error: "Please login first" });
    }

    try {
        // Verify ownership
        const checkSql = "SELECT seller_id FROM products WHERE product_id = ?";

        db.query(checkSql, [id], async (err, results) => {
            if (err) {
                console.log("Ownership check error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Product not found" });
            }

            if (results[0].seller_id !== req.session.user_id) {
                return res.status(403).json({ error: "You can only edit your own components" });
            }

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
                            return res.status(400).json({ error: "Unable to compress image below 2 MB" });
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

                let num = 0;
                if (price && originalPrice && originalPrice > 0) {
                    num = 100 - ((price / originalPrice) * 100);
                }
                const discount = Number(num.toFixed(2));

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
                        return res.status(500).json({ error: "Failed to update product" });
                    }

                    res.json({ message: "Product updated successfully" });
                });

            } catch (error) {
                console.error("Update product error:", error);
                return res.status(500).json({ error: "Failed to update component" });
            }
        });

    } catch (error) {
        console.error("Update product error:", error);
        return res.status(500).json({ error: "Failed to update component" });
    }
});

// ================= DELETE PRODUCT =================
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!req.session.user_id) {
        return res.status(401).json({ error: "Please login first" });
    }

    try {
        const selectSql = "SELECT image_file_id FROM products WHERE product_id = ?";

        db.query(selectSql, [id], async (err, products) => {
            if (err) {
                console.error("FETCH ERROR:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (products.length === 0) {
                return res.status(404).json({ error: "Product not found" });
            }

            const image_file_id = products[0].image_file_id;

            if (image_file_id) {
                try {
                    await imagekit.files.delete(image_file_id);
                    console.log("Image deleted from ImageKit:", image_file_id);
                } catch (imageError) {
                    console.error("ImageKit delete error:", imageError);
                    return res.status(500).json({ error: "Failed to delete component image" });
                }
            }

            const deleteSql = "DELETE FROM products WHERE product_id = ?";

            db.query(deleteSql, [id], (err, result) => {
                if (err) {
                    console.error("DELETE ERROR:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Product not found" });
                }

                res.json({ message: "Product deleted successfully" });
            });
        });

    } catch (error) {
        console.error("DELETE COMPONENT ERROR:", error);
        res.status(500).json({ error: "Failed to delete component" });
    }
});

module.exports = router;


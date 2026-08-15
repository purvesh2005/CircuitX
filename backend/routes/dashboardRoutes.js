const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});


// =====================================================
// DASHBOARD
// Show logged-in user's products
// Newest products first
// =====================================================

router.get("/", (req, res) => {

    console.log("SESSION:", req.session);

    const userId = req.session.user_id;

    console.log("USER ID:", userId);

    // User must be logged in
    if (!userId) {
        return res.redirect("/login");
    }

    const sql = `
        SELECT *
        FROM products
        WHERE seller_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, products) => {

        if (err) {
            console.log("DB ERROR:", err);
            return res.status(500).send("Database error");
        }

        console.log("PRODUCTS:", products);

        res.render("listings/dashboard.ejs", {
            activePage: "dashboard",
            products: products
        });

    });

});


// =====================================================
// DELETE COMPONENT
// =====================================================

router.post("/delete/:id", async (req, res) => {

    const { id } = req.params;

    console.log("Deleting product ID:", id);

    try {

        // =================================================
        // 1. Get image_file_id
        // =================================================

        const selectSql = `
            SELECT image_file_id
            FROM products
            WHERE product_id = ?
        `;

        db.query(selectSql, [id], async (err, products) => {

            if (err) {

                console.error(
                    "FETCH ERROR:",
                    err
                );

                return res
                    .status(500)
                    .send("Database error");
            }


            // Product doesn't exist
            if (products.length === 0) {

                return res
                    .status(404)
                    .send("Product not found");
            }


            const image_file_id = products[0].image_file_id;


            // =================================================
            // 2. Delete image from ImageKit
            // =================================================

            if (image_file_id) {

                try {

                    await imagekit.files.delete(
                        image_file_id
                    );

                    console.log(
                        "Image deleted from ImageKit:",
                        image_file_id
                    );

                } catch (imageError) {

                    console.error(
                        "ImageKit delete error:",
                        imageError
                    );

                    // Don't delete database record
                    // if ImageKit deletion fails

                    return res
                        .status(500)
                        .send(
                            "Failed to delete component image"
                        );
                }
            }


            // =================================================
            // 3. Delete product from MySQL
            // =================================================

            const deleteSql = `
                DELETE FROM products
                WHERE product_id = ?
            `;

            db.query(
                deleteSql,
                [id],
                (err, result) => {

                    if (err) {

                        console.error(
                            "DELETE ERROR:",
                            err
                        );

                        return res
                            .status(500)
                            .send("Database error");
                    }


                    console.log(
                        "Delete result:",
                        result
                    );


                    // Product doesn't exist
                    if (result.affectedRows === 0) {

                        return res
                            .status(404)
                            .send("Product not found");
                    }


                    console.log(
                        "Product and image deleted successfully"
                    );


                    // Back to dashboard
                    res.redirect("/dashboard");

                }
            );

        });

    } catch (error) {

        console.error(
            "DELETE COMPONENT ERROR:",
            error
        );

        res
            .status(500)
            .send("Failed to delete component");
    }

});



module.exports = router;
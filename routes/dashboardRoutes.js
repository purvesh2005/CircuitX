const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

router.get("/", (req, res) => {

    console.log("SESSION:", req.session);

    const userId = req.session.user_id;

    console.log("USER ID:", userId);

    const sql = "SELECT * FROM products WHERE seller_id = ?";

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

//delete component
// Delete component
router.post("/delete/:id", async (req, res) => {

    const { id } = req.params;

    console.log("Deleting product ID:", id);

    try {

        // 1. Get image_file_id first
        const selectSql = `
            SELECT image_file_id
            FROM products
            WHERE product_id = ?
        `;

        db.query(selectSql, [id], async (err, products) => {

            if (err) {
                console.error("FETCH ERROR:", err);
                return res.status(500).send("Database error");
            }

            if (products.length === 0) {
                return res.status(404).send("Product not found");
            }

            const image_file_id = products[0].image_file_id;


            // 2. Delete image from ImageKit
            if (image_file_id) {

                try {

                    await imagekit.files.delete(image_file_id);

                    console.log(
                        "Image deleted from ImageKit:",
                        image_file_id
                    );

                } catch (imageError) {

                    console.error(
                        "ImageKit delete error:",
                        imageError
                    );

                    // Stop here so we don't delete the
                    // product while leaving its image behind
                    return res
                        .status(500)
                        .send("Failed to delete component image");

                }
            }


            // 3. Delete product from MySQL
            const deleteSql = `
                DELETE FROM products
                WHERE product_id = ?
            `;

            db.query(deleteSql, [id], (err, result) => {

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

                if (result.affectedRows === 0) {

                    return res
                        .status(404)
                        .send("Product not found");

                }

                console.log(
                    "Product and image deleted successfully"
                );

                res.redirect("/dashboard");

            });

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
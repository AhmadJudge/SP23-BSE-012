const express = require("express");
let webPages = express.Router();
const Product = require("../models/product.model");

// Route to handle /collections/:category
webPages.get("/gender/:gender", async (req, res) => {
    try {
        const { gender } = req.params;

        // Fetch products by category from the database
        const products = await Product.find({ gender });
        // Render the EJS page with fetched products
        res.render("gender", { product: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Server error while fetching products");
    }
});

module.exports = webPages;
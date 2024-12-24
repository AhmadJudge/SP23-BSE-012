
const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
  title: String,
  gender: String,
  description: String,
  price: Number,
  picture: String,
  isFeatured: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, 
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;

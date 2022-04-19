const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true, default: "No image" },
    categories: { type: Array, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: String, required: true },
    countInStock: { type: Number, required: true },
  },
  { collection: "products" }
);

const model = mongoose.model("ProductData", Product);

module.exports = model;

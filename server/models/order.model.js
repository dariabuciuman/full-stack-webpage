const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    products: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    totalPrice: { type: String, required: true },
    number: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    county: { type: String, required: true },
    country: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  { collection: "orderdata" },
  { timestamps: true }
);

const model = mongoose.model("OrderData", Order);

module.exports = model;

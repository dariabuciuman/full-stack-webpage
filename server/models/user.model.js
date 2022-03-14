const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, sparse: true },
    quote: { type: String },
    role: { type: String, required: true, default: "user" },
  },
  { collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;

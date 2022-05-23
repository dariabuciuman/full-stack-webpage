const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
//const upload = multer({ dest: "./images" });

require("dotenv").config();
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());

mongoose.connect(process.env.DB_URI);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },

  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.post(
  "/api/admin/uploadImage",
  upload.single("image"),
  async (req, res) => {
    const token = req.headers["admin-access-token"];

    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      const email = decoded.email;
      const user = await User.findOne({ email: email });
      if (user.role === "admin") {
        if (!req.file) {
          console.log("No file received");
          return res.status(400).send({ error: error.message });
        } else {
          const host = req.hostname;
          console.log("host name: " + host);
          const filePath =
            req.protocol + "://" + host + ":5000/" + req.file.path;
          console.log("file received, filepath " + filePath);

          return res.send(req.file);
        }
      }
    } catch (error) {
      return res.json({ status: "error", error: "Unauthorized" });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.post("/api/admin/addProduct", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        await Product.create({
          id: req.body.id,
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          image: req.body.image,
          categories: req.body.categories,
          size: req.body.size,
          color: req.body.color,
          price: req.body.price,
          countInStock: req.body.countInStock,
        });
        return res.json({ status: "ok", state: "updated" });
      } catch (error) {
        console.log(error);
      }
    } else return res.json({ status: "Unauthorized" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't add product" });
  }
});

app.delete("/api/admin/deleteProduct", async (req, res) => {
  const token = req.headers["admin-access-token"];
  console.log(req.headers.product_id);
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        const deleted = await Product.deleteOne({ id: req.headers.product_id });
        return res.json({ status: "ok", state: deleted });
      } catch (error) {
        console.log(error);
      }
    } else return res.json({ status: "error" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't delete product" });
  }
});

app.put("/api/admin/editProduct", async (req, res) => {
  const token = req.headers["admin-access-token"];
  console.log("In editProduct");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        const updated = await Product.updateOne(
          {
            id: req.headers.product_id,
          },
          {
            $set: {
              name: req.headers.new_name,
              manufacturer: req.headers.new_manufacturer,
              description: req.headers.new_description,
              categories: req.headers.new_categories,
              size: req.headers.new_size,
              color: req.headers.new_color,
              price: req.headers.new_price,
              countInStock: req.headers.new_stock,
            },
          }
        );
        return res.json({ status: "ok", state: "updated" });
      } catch (error) {
        console.log(error);
      }
    } else return res.json({ status: "error" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't update product" });
  }
});

app.get("/api/admin/getProduct", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        const product = await Product.findOne(
          { id: req.headers.product_id },
          { _id: 0, __v: 0 }
        );
        return res.json({ status: "ok", product: product });
      } catch (error) {
        res.send({ status: "error", error: error });
      }
    } else return res.json({ status: "Unauthorized" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't get product" });
  }
});

app.get("/api/getProducts", async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0, __v: 0 });
    return res.json({ status: "ok", products: products });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

app.get("/api/getImages", async (req, res) => {
  try {
    const images = await Product.find(
      {},
      {
        _id: 0,
        __v: 0,
        id: 0,
        name: 0,
        description: 0,
        manufacturer: 0,
        categories: 0,
        size: 0,
        color: 0,
        price: 0,
        countInStock: 0,
      }
    );
    return res.json({ status: "ok", images: images });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

app.get("/api/fetchImage/:file(*)", async (req, res) => {
  const imageName = req.headers["image_name"];
  let file = req.params.file;
  console.log("file: " + file);
  let fileLocation = path.join("./images/", file);
  console.log("fileLocation: " + fileLocation);
  res.sendFile(`${fileLocation}`, { root: __dirname }, (error) => {
    if (error) console.log("Can't send file, error: " + error);
    else console.log("File sent");
  });
});

app.post("/api/register", async (req, res) => {
  console.log(req.body);

  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      role: req.body.role,
    });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return { status: "error", error: "Invalid login" };
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_PRIVATE_KEY
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/phoneNumber", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", phoneNumber: user.phoneNumber });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/phoneNumber", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    await User.updateOne(
      { email: email },
      { $set: { phoneNumber: req.body.phoneNumber } }
    );

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/admin", async (req, res) => {
  const token = req.headers["admin-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      return res.json({ status: "ok", authorized: "true" });
    }
  } catch (error) {
    return res.json({ status: "error", error: "Unauthorized" });
  }
});

app.get("/api/admin/getUsers", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      const users = await User.find(
        {},
        { _id: 0, password: 0, __v: 0, quote: 0, phoneNumber: 0 }
      );
      return res.json({ status: "ok", users: users });
    }
  } catch (error) {
    return res.json({ status: "error", error: "Unauthorized" });
  }
});

app.delete("/api/admin/deleteUser", async (req, res) => {
  const token = req.headers["admin-access-token"];
  console.log(req.headers.user_email);
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        const deleted = await User.deleteOne({ email: req.headers.user_email });
        return res.json({ status: "ok", state: deleted });
      } catch (error) {
        console.log(error);
      }
    } else return res.json({ status: "error" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't delete user" });
  }
});

app.put("/api/admin/changeUser", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      if (user.email === req.headers.user_email) {
        return res.json({
          status: "error",
          error: "Can't change role for the current user",
        });
      } else
        try {
          const updated = await User.updateOne(
            {
              email: req.headers.user_email,
            },
            {
              $set: { role: req.headers.new_role },
            }
          );
          return res.json({ status: "ok", state: "updated" });
        } catch (error) {
          console.log(error);
        }
    } else return res.json({ status: "error" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't update user role" });
  }
});

app.get("/api/getProductID", async (req, res) => {
  try {
    const product = await Product.findOne(
      { id: req.headers.product_id },
      {
        name: 0,
        id: 0,
        manufacturer: 0,
        description: 0,
        image: 0,
        categories: 0,
        size: 0,
        color: 0,
        price: 0,
        countInStock: 0,
        __v: 0,
      }
    );
    return res.json({ status: "ok", productID: product });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

app.post("/api/addOrder", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    console.log("email: " + email);
    const user = await User.findOne({ email: email });
    if (user) {
      try {
        await Order.create({
          products: req.body.products,
          userID: user._id,
          totalPrice: req.body.totalPrice,
          number: req.body.number,
          street: req.body.street,
          city: req.body.city,
          county: req.body.county,
          country: req.body.country,
          zipcode: req.body.zipcode,
        });
        return res.json({ status: "ok", state: "created" });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Couldn't place order" });
  }
});

app.get("/api/admin/getProductByID", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        const product = await Product.findOne(
          { _id: req.headers._id },
          { __v: 0 }
        );
        return res.json({ status: "ok", product: product });
      } catch (error) {
        res.send({ status: "error", error: error });
      }
    } else return res.json({ status: "Unauthorized" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't get product" });
  }
});

app.get("/api/admin/getOrders", async (req, res) => {
  const token = req.headers["admin-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        const orders = await Order.find({}, { __v: 0 });
        var users = [];
        for (i = 0; i < orders.length; i++) {
          var u = await User.findOne(
            { _id: orders[i].userID },
            { __v: 0, password: 0 }
          );
          users.push(u);
        }
        var products = [];
        for (i = 0; i < orders.length; i++) {
          var prods = [];
          for (j = 0; j < orders[i].products.length; j++) {
            var p = await Product.findOne(
              { _id: orders[i].products[j].productID },
              { __v: 0, password: 0 }
            );
            prods.push(p);
          }
          products.push(prods);
        }
        console.log(products);
        return res.json({
          status: "ok",
          orders: orders,
          users: users,
          products: products,
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Couldn't get orders" });
  }
});

app.get("/api/admin/getUserByID", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user.role === "admin") {
      try {
        const user = await User.findOne(
          { _id: req.headers._id },
          { __v: 0, password: 0 }
        );
        return res.json({ status: "ok", user: user });
      } catch (error) {
        res.send({ status: "error", error: error });
      }
    } else return res.json({ status: "Unauthorized" });
  } catch (error) {
    return res.json({ status: "error", error: "Couldn't get user" });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

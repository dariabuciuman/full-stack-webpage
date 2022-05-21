import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Product.css";
import Header from "../utils/Header";

const Product = (props) => {
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  let cart = [];

  async function getImage(imageName) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/fetchImage/${imageName}`,
        {
          method: "GET",
          headers: {
            image_name: imageName,
            "Content-Type": "image/jpeg",
          },
        }
      );
      const blob = await res.blob();
      var imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error(`get: error occurred ${error}`);
      return [null, error];
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      console.log(user);
      if (!user) {
        console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        getImage(state.product.image);
        console.log(state);
        console.log(state.product.name);
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  function addToCart(product) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    var quantity = 1;
    var added = false;
    cart.map((item, index) => {
      if (item.product.id === product.id) {
        quantity = item.quantity + 1;
        cart.at(index).quantity = quantity;
        added = true;
      }
    });
    if (added === false) cart.push({ product: product, quantity: quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
  }

  return (
    <div className="product-page">
      <Header />
      <div className="product-dash">
        <div className="product-img-area">
          <img
            src={image}
            className="product-img"
            alt={state.product.name}
          ></img>
        </div>
        <div className="product-text">
          <h1>{state.product.manufacturer}</h1>
          <h2> {state.product.name} </h2>
          <div className="product-price">
            <p>{"PRICE: "}</p>
            <h2> {" " + state.product.price} RON </h2>
          </div>
          <p>{state.product.description}</p>
          <div className="product-buttons">
            <button
              className="add-to-cart"
              onClick={() => {
                console.log("clicked " + state.product.id);
                addToCart(state.product);
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

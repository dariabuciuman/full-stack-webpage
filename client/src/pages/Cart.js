import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Cart.css";
import Header from "../utils/Header";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Button } from "react-bootstrap";

const Cart = (props) => {
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [cartTotal, setCartTotal] = useState(0);

  let cart = [];
  let total = 0;

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
      return imageUrl;
    } catch (error) {
      console.error(`get: error occurred ${error}`);
      return [null, error];
    }
  }

  async function populateItems() {
    const data = JSON.parse(localStorage.getItem("cart"));
    if (data) {
      setItems(data);
      console.log(data);
      const res = await Promise.all(
        data.map((item, index) =>
          getImage(item.product.image).then((imageUrl) => {
            return imageUrl;
          })
        )
      );
      const idk = data.map((item, index) => {
        total += item.product.price * item.quantity;
        return total;
      });
      console.log(res);
      setImages(res);
      console.log(items);
      setCartTotal(total);
    } else {
      console.log("No items");
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
        // const items = JSON.parse(localStorage.getItem("cart"));
        // if (items) {
        //   setItems(items);
        // }
        // cart = JSON.parse(localStorage.getItem("cart"));
        populateItems();
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  function addToCart(product) {
    //localStorage.setItem("cart", "");
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

  function removeFromCart(product) {
    //localStorage.setItem("cart", "");
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    var quantity;
    cart.map((item, index) => {
      if (item.product.id === product.id) {
        quantity = item.quantity - 1;
        cart.at(index).quantity = quantity;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-dash">
        <div className="cart-items">
          {items.map((item, index) => (
            <div key={index} className="item-list">
              <div className="item-picture">
                <img height="120" width="120" src={images.at(index)}></img>
              </div>
              <div className="item-text">
                <p>Product: {item.product.name}</p>
                <p>Price: {item.product.price * item.quantity} RON</p>
                <div className="item-quantity">
                  <Button
                    variant="text"
                    onClick={() => {
                      addToCart(item.product);
                      window.location.reload();
                    }}
                  >
                    <AddIcon></AddIcon>
                  </Button>
                  <p className="quantity">{item.quantity}</p>
                  <Button
                    variant="text"
                    onClick={() => {
                      removeFromCart(item.product);
                      window.location.reload();
                    }}
                  >
                    <RemoveIcon></RemoveIcon>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="subtotal">
          <h1>Order Summary</h1>
          <p>{cartTotal}</p>
          <button>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

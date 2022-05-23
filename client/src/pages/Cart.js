import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Cart.css";
import Header from "../utils/Header";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Cart = (props) => {
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [cartTotal, setCartTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [products, setProducts] = useState([]);
  const [indexes, setIndexes] = useState([]);

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

  async function getProductID(id) {
    const req = await fetch("http://localhost:5000/api/getProductID", {
      method: "GET",
      headers: {
        product_id: id,
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      console.log(data.productID);
      return data.productID;
    } else alert("Couldn't get product id");
  }

  async function populateItems() {
    var data = [];
    if (localStorage.getItem("cart")) {
      data = JSON.parse(localStorage.getItem("cart"));
    }
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
      const ids = await Promise.all(
        data.map((item, index) =>
          getProductID(item.product.id).then((id) => {
            return id;
          })
        )
      );
      console.log(ids);
      const product = data.map((item, index) => {
        var jsonProduct = {
          productID: ids.at(index),
          quantity: item.quantity,
        };
        products.push(jsonProduct);
        return jsonProduct;
      });
      console.log(res);
      setImages(res);
      console.log(items);
      setCartTotal(total);
      console.log("Products: ");
      console.log(products);
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

  const addNumber = (e) => {
    setNumber(e.target.value);
  };
  const addStreet = (e) => {
    setStreet(e.target.value);
  };

  const addCity = (e) => {
    setCity(e.target.value);
  };

  const addCounty = (e) => {
    setCounty(e.target.value);
  };

  const addCountry = (e) => {
    setCountry(e.target.value);
  };

  const addZipcode = (e) => {
    setZipcode(e.target.value);
  };

  async function addOrder() {
    const req = await fetch("http://localhost:5000/api/addOrder", {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: products,
        totalPrice: cartTotal,
        number: number,
        street: street,
        city: city,
        county: county,
        country: country,
        zipcode: zipcode,
      }),
    });
    const data = await req.json();
    if (data.status === "ok") {
      alert("Order added");
    } else alert(data.error);
  }

  function emptyCart() {
    localStorage.setItem("cart", "");
  }

  function handleAdd() {
    console.log(localStorage.getItem("token"));
    console.log("Order: ");
    console.log(items);
    console.log(cartTotal);
    console.log(number);
    console.log(street);
    console.log(city);
    console.log(county);
    console.log(country);
    console.log(zipcode);
    addOrder();
    emptyCart();
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-dash">
        <div className="cart-items">
          {items &&
            items.map((item, index) => (
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
          <h3>Order Summary</h3>
          {items && <p>Total: {cartTotal} RON</p>}
          {items && (
            <button
              className="checkout"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Checkout
            </button>
          )}
        </div>
        <div>
          <Dialog
            open={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <DialogTitle>Checkout</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <div>
                  {items.map((item, index) => (
                    <div key={index}>
                      <p>
                        {item.product.name},{" "}
                        {item.product.price * item.quantity} RON
                      </p>
                    </div>
                  ))}
                </div>
                <p>Total: {cartTotal} RON</p>
              </DialogContentText>
              <DialogContentText>Address:</DialogContentText>
              <TextField
                required
                margin="dense"
                id="id"
                label="Street"
                type="text"
                fullWidth
                variant="standard"
                onChange={addStreet}
              />
              <TextField
                required
                margin="dense"
                id="id"
                label="Number"
                type="text"
                fullWidth
                variant="standard"
                onChange={addNumber}
              />
              <TextField
                required
                margin="dense"
                id="id"
                label="City"
                type="text"
                fullWidth
                variant="standard"
                onChange={addCity}
              />
              <TextField
                required
                margin="dense"
                id="id"
                label="County"
                type="text"
                fullWidth
                variant="standard"
                onChange={addCounty}
              />
              <TextField
                required
                margin="dense"
                id="id"
                label="Zipcode"
                type="text"
                fullWidth
                variant="standard"
                onChange={addZipcode}
              />
              <TextField
                required
                margin="dense"
                id="id"
                label="Country"
                type="text"
                fullWidth
                variant="standard"
                onChange={addCountry}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleAdd}>
                Add
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "./Shop.css";
import Header from "../utils/Header";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import ShoppingCartOutlined from "@material-ui/icons/ShoppingCartOutlined";

const Shop = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  let cart = [];
  // const useStyles = makeStyles({
  //   root: {
  //     backgroundColor: "red",
  //   },
  // });

  // const classes = useStyles();

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

  async function populateProducts() {
    const req = await fetch("http://localhost:5000/api/getProducts", {
      headers: {
        "x-acces-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setProducts(data.products);
      console.log(data.products);
      const res = await Promise.all(
        data.products.map((item, index) =>
          getImage(item.image).then((imageUrl) => {
            return imageUrl;
          })
        )
      );
      console.log(res);
      setImages(res);
    } else {
      alert(data.error);
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
        populateProducts();
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  function addToCart(product) {
    localStorage.setItem("cart", "");
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
    <div className="everything1">
      <Header />
      <div className="shop">
        <div className="products">
          {products.map((product, index) => (
            <div key={index}>
              <Card
                sx={{
                  width: 250,
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textDecoration: "none",
                }}
                className="{classes.root}"
              >
                <Link
                  style={{ textDecoration: "none" }}
                  to={{
                    pathname: `/shop/${product.id}`,
                  }}
                  state={{ product: product }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="230"
                      src={images[index]}
                      alt={product.name}
                      sx={{ objectFit: "contain" }}
                    />
                    <CardContent
                      sx={{
                        margin: -1,
                        color: "#000",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "16px" }}
                        gutterBottom
                        variant="h6"
                        component="div"
                      >
                        {product.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "0.5rem",
                  }}
                >
                  <Typography
                    sx={{ alignContent: "center" }}
                    variant="h5"
                    color="#000"
                  >
                    {product.price + " RON"}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#2B8AD7" }}
                    onClick={() => {
                      alert(product.id);
                      addToCart(product);
                    }}
                  >
                    <ShoppingCartOutlined />
                  </Button>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;

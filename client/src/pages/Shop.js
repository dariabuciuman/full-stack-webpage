import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Shop.css";
import Header from "../utils/Header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [tempQuote, setTempQuote] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");

  async function getImage(imageName) {
    try {
      const res = await fetch("http://localhost:5000/api/getImage", {
        method: "GET",
        headers: {
          image_name: imageName,
          "Content-Type": "image/jpeg",
        },
      });
      const blob = await res.blob();
      return [URL.createObjectURL(blob), null];
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
      console.log(products);
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
        //console.log(products.match("image: "));
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  async function updatePhoneNumber(event) {
    event.preventDefault();
    const req = await fetch("http://localhost:5000/api/phoneNumber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-acces-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        phoneNumber: tempPhoneNumber,
      }),
    });
    const data = await req.json();
    if (data.status === "ok") {
      setPhoneNumber(tempPhoneNumber);
      setTempPhoneNumber("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="everything1">
      <Header />
      <div className="shop">
        <h1>Shop page</h1>
        <div className="products">
          {products.map((product, index) => (
            <div key={index}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={getImage(product.image)}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.image}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
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
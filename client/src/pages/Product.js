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

  return (
    <div className="product-page">
      <Header />
      <div className="product-dash">
        <img src={image} className="product-img"></img>
        <h1> {state.product.name} </h1>
        <h1>Your role: {"No role founfd"}</h1>
      </div>
    </div>
  );
};

export default Product;

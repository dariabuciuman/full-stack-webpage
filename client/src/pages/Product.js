import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Product.css";
import Header from "../utils/Header";

const Product = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

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
        console.log();
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="everything">
      <Header />
      <div className="dashboard">
        <h1> Product [age] </h1>
        <h1>Your role: {"No role founfd"}</h1>
      </div>
    </div>
  );
};

export default Product;

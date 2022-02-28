import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  console.log(localStorage.getItem("token"));
  return (
    <div className="welcome">
      <div className="header">
        <div className="logo">
          <p></p>
        </div>
        <p className="logo-text">LOGO</p>
        <div className="menu">
          <div className="labels">
            <p>Home</p>
            <p>About</p>
            <p>Shop</p>
            <p>Support</p>
          </div>
          <div className="buttons">
            <button
              className="button-login"
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="button-register"
              type="button"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
      <div className="dashboard">
        <div className="image">
          <h1>Welcome to our shop!</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;

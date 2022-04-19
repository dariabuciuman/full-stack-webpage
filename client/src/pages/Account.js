import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Account.css";
import Header from "../utils/Header";

const Account = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");

  async function populatePhoneNumber() {
    const req = await fetch("http://localhost:5000/api/phoneNumber", {
      headers: {
        "x-acces-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setPhoneNumber(data.phoneNumber);
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
        populatePhoneNumber();
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
    <div className="everything">
      <Header />
      <div className="dashboard">
        <h1> Your phone number: {phoneNumber || "No phone number found"} </h1>
        <form onSubmit={updatePhoneNumber}>
          <input
            type="text"
            placeholder="Phone Number"
            value={tempPhoneNumber}
            onChange={(e) => setTempPhoneNumber(e.target.value)}
          />
          <br />
          <input type="submit" value="Update phone number" />
        </form>
        <h1>Your role: {"No role founfd"}</h1>
      </div>
    </div>
  );
};

export default Account;

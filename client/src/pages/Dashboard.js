import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Dashboard.css";
import LoggedInHeader from "../utils/LoggedInHeader";
import AdminHeader from "../utils/AdminHeader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [admin, setAdmin] = useState("");

  async function verifyAdmin() {
    const req = await fetch("http://localhost:5000/api/admin", {
      headers: {
        "admin-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok" && data.authorized === "true") {
      setAdmin(true);
    } else setAdmin(false);
  }

  async function populateQuote() {
    const req = await fetch("http://localhost:5000/api/quote", {
      headers: {
        "x-acces-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }
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
        populateQuote();
        populatePhoneNumber();
        verifyAdmin();
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  async function updateQuote(event) {
    event.preventDefault();
    const req = await fetch("http://localhost:5000/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-acces-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });
    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

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
      {admin ? <AdminHeader></AdminHeader> : <LoggedInHeader></LoggedInHeader>}
      <div className="dashboard">
        <h1> Your quote: {quote || "No Quote found"} </h1>
        <form onSubmit={updateQuote}>
          <input
            type="text"
            placeholder="Quote"
            value={tempQuote}
            onChange={(e) => setTempQuote(e.target.value)}
          />
          <br />
          <input type="submit" value="Update quote" />
        </form>
        <br />
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

export default Dashboard;

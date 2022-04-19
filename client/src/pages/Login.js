import React from "react";
import { useState } from "react";
import Header from "../utils/Header";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.user) {
      localStorage.setItem("token", data.user);
      alert("Login successful");
      window.location.href = "/dashboard";
    } else {
      console.log("does not exist");
      alert("Please check your username and password");
    }
  }

  return (
    <div className="login-page">
      <Header />
      <div className="loginForm">
        <h1>Login</h1>
        <h3>Welcome back, it's grape to see you.</h3>
        <form className="form" onSubmit={loginUser}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <br />
          <input type="submit" value="Login"></input>
        </form>
      </div>
    </div>
  );
}

export default Login;

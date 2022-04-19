import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./Header.css";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState("");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      setLoggedIn(true);
      if (!user) {
        console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        setLoggedIn(false);
      } else {
        verifyAdmin();
      }
    } else {
      setLoggedIn(false);
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <Navbar className="navbar" expand="lg" fixed="top" bg="dark" variant="dark">
      <div className="container">
        <Navbar.Brand className="navbar-text" href="/">
          PC Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="navbar-text" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="navbar-text" href="/dashboard">
              Shop
            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item className="navbar-text" href="/login">
                Login
              </NavDropdown.Item>
              <NavDropdown.Item className="navbar-text" href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item className="navbar-text" href="#action/3.3">
                Something
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            {!loggedIn && (
              <Nav.Link className="navbar-text" href="/login">
                Login
              </Nav.Link>
            )}
            {!loggedIn && (
              <Nav.Link className="navbar-text" href="/register">
                Sign Up
              </Nav.Link>
            )}
            {loggedIn && (
              <Nav.Link
                className="navbar-text"
                href="/"
                onClick={() => {
                  localStorage.removeItem("token");
                }}
              >
                Logout
              </Nav.Link>
            )}
            {admin && (
              <Nav.Link className="navbar-text" href="/admin">
                Admin
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;

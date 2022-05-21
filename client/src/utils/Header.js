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
            <Nav.Link className="navbar-text" href="/shop">
              Shop
            </Nav.Link>
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
              <NavDropdown
                title="My Account"
                id="basic-nav-dropdown"
                menuVariant="dark"
              >
                <NavDropdown.Item className="navbar-text" href="/account">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  className="navbar-text"
                  href="/"
                  onClick={() => {
                    localStorage.removeItem("token");
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link className="navbar-text" href="/cart">
              Cart
            </Nav.Link>
            {admin && (
              <NavDropdown
                title="Admin"
                id="basic-nav-dropdown"
                menuVariant="dark"
              >
                <NavDropdown.Item className="navbar-text" href="/users">
                  Users
                </NavDropdown.Item>
                <NavDropdown.Item className="navbar-text" href="/products">
                  Products
                </NavDropdown.Item>
                <NavDropdown.Item className="navbar-text" href="/orders">
                  Orders
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;

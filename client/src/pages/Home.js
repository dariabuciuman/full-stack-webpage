import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

function Home() {
  const navigate = useNavigate();
  console.log(localStorage.getItem("token"));
  return (
    <div className="home">
      <Navbar className="navbar" expand="lg" fixed="top">
        <div className="container">
          <Navbar.Brand href="/">PC Shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <div className="dashboard">
        <div className="hello">
          <div className="typewriter1">
            <h1>Hello.</h1>
          </div>
          <div className="typewriter2">
            <h1>
              Welcome to the place where you can get your best PC components.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

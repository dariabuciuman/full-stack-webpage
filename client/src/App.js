import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import Users from "./pages/Users";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from "./ProtectedRoutes";
import Product from "./pages/Product";
import Products from "./pages/Products";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/shop" exact element={<Shop />} />
          <Route path="/shop/:id" exact element={<Product />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/account" exact element={<Account />} />
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/users" exact element={<Users />} />
            <Route path="/products" exact element={<Products />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

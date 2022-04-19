import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from "./ProtectedRoutes";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/shop" exact element={<Shop />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/account" exact element={<Account />} />
            <Route path="/admin" exact element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

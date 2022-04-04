import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from "./ProtectedRoutes";
import ProtectedAdminRoutes from "./ProtectedAdminRoutes";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route path="/admin" exact element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

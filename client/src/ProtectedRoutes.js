import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  let isLoggedIn = false;
  if (localStorage.getItem("token") != null) {
    isLoggedIn = true;
  }
  const user = { loggedIn: isLoggedIn };
  return user && user.loggedIn;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;

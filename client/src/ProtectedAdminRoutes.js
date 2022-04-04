import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// async function verifyPermissions() {
//   const req = await fetch("http://localhost:5000/api/admin", {
//     headers: {
//       "admin-access-token": localStorage.getItem("token"),
//     },
//   });
//   const data = await req.json();
//   if (data.status === "ok" && data.authorized === "true") return true;
//   return false;
// }

// async function useAdmin() {
//   let isAdmin = false;
//   const data = await verifyPermissions().then((a) => {
//     isAdmin = a;
//   });
//   return isAdmin;
// }

// const ProtectedAdminRoutes = () => {
//   let isAdmin = false;
//   const data = useAdmin().then((a) => {
//     isAdmin = a;
//     console.log("isA = a " + isAdmin);
//   });
//   console.log(data);
//   alert("isAdmin: " + isAdmin);
//   // console.log("status: " + data.status);
//   // console.log("auth: " + data.authorized);
//   // if (data.status === "ok" && data.authorized === "true") {
//   //   isAdmin = true;
//   // }
//   //const user = { admin: isAdmin };
//   console.log("is admin from route: " + isAdmin);
//   return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
// };

const useAuth = () => {
  let isAdmin = false;
  if (localStorage.getItem("admin") === "true") {
    isAdmin = true;
  }
  const user = { admin: isAdmin };
  return user && user.admin;
};

const ProtectedAdminRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default ProtectedAdminRoutes;

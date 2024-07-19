import React from "react";
import { Navigate } from "react-router-dom";

const SuperAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.role === "SuperAdmin") {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default SuperAdminRoute;

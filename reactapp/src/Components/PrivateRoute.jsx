import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (role && currentRole !== role) {
    return <Navigate to="/error" replace />;
  }
  return children;
}
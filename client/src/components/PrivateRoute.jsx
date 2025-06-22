import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();

  // If not logged in, redirect to login
  if (!isLoggedIn) {
      return isLoggedIn ? children : <Navigate to="/login" />;
    
  }

  return children;
}

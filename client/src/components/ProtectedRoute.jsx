// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { role } = useAuth();
  if (role !== "admin") return <Navigate to="/login" />;
  return children;
}

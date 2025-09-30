import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Login from "./Login";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user && !loading) return <Login />;
  if (requiredRole && role !== requiredRole) {
    return <p className="text-red-500 text-center mt-10">Not an admin</p>;
  }

  return children;
}

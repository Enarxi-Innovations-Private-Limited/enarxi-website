import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Login from "./routers/admin/Login";
import BrandedLoader from "@components/shared/BrandedLoader";

export default function ProtectedRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <BrandedLoader />;

  if (user && !role) return <BrandedLoader />


  if (!user || role == 'employee' || role == "intern") return <Login />;
  if (role !== 'admin') {
    // User is logged in but does not have a staff role
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
        <p className="mt-1 text-sm text-gray-500">Please log in with a staff account.</p>
      </div>
    );
  }
  return children;
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import BrandedLoader from '@components/shared/BrandedLoader';

export default function StaffProtectedRoute({ children }) {
  const { user, role, loading,firebaseUser } = useAuth();

  if (loading || (user && !firebaseUser)) {
    // Wait for auth to initialize and user data to be fetched
    return <div className="flex justify-center items-center h-screen"> <BrandedLoader />   </div>;
  }

  if (!user || firebaseUser?.status !== "active") {
    // User not logged in or inactive, redirect to staff login page
    return <Navigate to="/stafflogin" replace />;
  }

  if (role !== 'employee' && role !== 'intern') {
    // User is logged in but does not have a staff role
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
        <p className="mt-1 text-sm text-gray-500">Please log in with a staff account.</p>
      </div>
    );
  }

  // User is authenticated and has a valid staff role
  return children;
}

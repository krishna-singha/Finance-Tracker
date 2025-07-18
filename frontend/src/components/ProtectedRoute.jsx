import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) return <div className="text-white p-6">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;

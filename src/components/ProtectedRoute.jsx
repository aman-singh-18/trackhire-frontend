import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If the AuthContext is still checking for an existing cookie, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If no user profile exists in state, block access and redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a valid user session exists, let them pass through to the page
  return children;
};

export default ProtectedRoute;
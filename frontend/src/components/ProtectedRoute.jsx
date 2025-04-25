import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const location = useLocation();
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if captain is trying to access captain routes
  if (location.pathname.startsWith("/captain/") && userType !== "captain") {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user is trying to access captain routes
  if (location.pathname.startsWith("/dashboard") && userType === "captain") {
    return <Navigate to="/captain/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

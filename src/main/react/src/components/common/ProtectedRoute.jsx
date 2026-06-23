import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { member, isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && member?.role !== "ROLE_ADMIN") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;

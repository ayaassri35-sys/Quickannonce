import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { jwtUtils } from "../utils/jwtUtils";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated || !jwtUtils.isTokenValid()) {
    return <Navigate to="/connexion" replace />;
  }

  // Vérifier si un rôle spécifique est requis
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

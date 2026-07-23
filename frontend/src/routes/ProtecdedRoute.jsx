import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/authServices";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // replace : n'ajoute pas la page dans l'historique,
    // le bouton Retour ne ramène pas sur une page interdite
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
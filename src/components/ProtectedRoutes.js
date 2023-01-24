import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth.context";

const ProtectedRoutes = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" replace />;
};
export default ProtectedRoutes;

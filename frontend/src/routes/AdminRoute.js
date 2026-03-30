import { Navigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";

//children = la página que se quiere proteger.
const AdminRoute = ({ children }) => {
  const {user} = useAuth();

  //mientras carga
  if (user === null) return null;

  //no logeado
  if (!user) {
    resturn <Navigate to="/admin/login" />
  }

  //no es admin
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  //es admin
  return children;
};

export default AdminRoute;

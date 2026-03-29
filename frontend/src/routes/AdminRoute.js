import { Navigate } from "react-router-dom";

//children = la página que se quiere proteger.
const AdminRoute = ({ children }) => {
  //Busca en el navegador si existe el token guardado. Recordar que el login guarda esto:
  //localStorage.setItem('token', response.data.access_token);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;

import { Navigate } from "react-router-dom";
import { toast } from "sonner";

////children = la página que se quiere proteger.
const PrivateRoute = ({ children }) => {
    //Busca en el navegador si existe el token guardado cuando el usuario hace login.
    //Recordar que el login guarda esto:
    //localStorage.setItem('admin_token', response.data.access_token);
    const token = localStorage.getItem('token');
     
    //if (token no existe) significa que el usuario no está autenticado. muestra error
    //y redirige automaticamente a /admin/login
    if (!token) {
     toast.error("Debes iniciar sesión para agregar productos al carrito");
     //Navigate("/admin/login")
     return <Navigate to="/admin/login" />;
    }
    
    //si hay token, se renderiza la página protegida
    return children;
};

export default PrivateRoute;

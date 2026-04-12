import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //función para validar expiración del token
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  //cargar sesión al iniciar app (recupero el usuario guardado al momento de hacer login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");

    // ❌ si falta algo → logout
    if (!storedUser || !token || !refreshToken) {
      logout();
      return;
    }

    // ❌ si token expiró → NO logout inmediato
    // dejamos que el interceptor lo renueve
    if (isTokenExpired(token)) {
      try {
       setUser(JSON.parse(storedUser));
      } catch (error) {
       console.error("Error parsing user", error);
       logout();
      }
      return;
    }
  }, []);

  // login
  const login = (userData, token, refreshToken) => {
    // Guardar token, sirve tanto para admin como cliente.
    localStorage.setItem("token", token);
    //Guardo refresh
    localStorage.setItem("refresh_token", refreshToken)
    //guarda usuario completo para mostrar "hola juan"    
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // logout
  const logout = () => {
    localStorage.clear();
    setUser(null);

    // detectar si estaba en admin o no
    if (window.location.pathname.startsWith("/admin")) {
     window.location.href = "/admin/login";
    } else {
     window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

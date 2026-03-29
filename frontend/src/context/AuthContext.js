import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // cargar usuario guardado (recupero el usuario guardado al momento de hacer login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    //evita que pase esto cuando no hay usuario guardado: JSONparse(undefined O null)
    if (storedUser && storedUser !== "undefined") {
      //try/catch protege si el JSON está corrupto
      try{
        setUser(JSON.parse(storedUser));
      } catch (error){
        console.error("Error parsing user", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // login
  const login = (userData, token) => {
    // Guardar token, sirve tanto para admin como cliente.
    localStorage.setItem("token", token);
    //guarda usuario completo para mostrar "hola juan"    
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
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
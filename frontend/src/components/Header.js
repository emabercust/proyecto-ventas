import { Link } from 'react-router-dom'; //Permite navegar entre páginas sin recargar la app Es como un <a>, pero para SPA (Single Page App).
import { ShoppingCart, User, LogOut } from 'lucide-react'; //Iconos SVG: ShoppingCart → carrito; User → login/admin; No es lógica, es solo UI.
//Hook personalizado:
//accede al estado global del carrito; evita pasar props por todos lados
//Desde acá podés:
//abrir el carrito; saber cuántos productos hay
import { useCart } from '../context/CartContext'; //porque en context y no en compenents????

//hook personalizado para el login
import {useAuth} from "../context/AuthContext";

import { motion } from 'framer-motion'; //Permite animar componentes React. Usado solo para la entrada del Header.

import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

const Header = () => { //Componente funcional de React. Siempre con mayúscula, porque React lo reconoce como componente.

  const {user, logout} = useAuth(); //recupero y guardo el usuario en user, y manejar logout
  const {openCart, getItemCount} = useCart(); //Desestructura funciones del contexto:
                                            //openCart() → abre el drawer/modal del carrito
                                            // getItemCount() → devuelve cuántos productos hay en el carrito
                                            // Esto viene de un contexto global, no del HomePage.

const itemCount = getItemCount(); //Guarda el número de productos para usarlo en el render.


return (
  <motion.header //Es un <header> normal, pero con animaciones
  initial={{ y: -20, opacity: 0 }} //Estado inicial: empieza un poco más arriba, invisible
  animate={{ y: 0, opacity: 1 }} //estado final: baja a su lugar, se hace visible
  transition={{ duration: 0.8 }} //Duración de la animación (0.8 segundos)
  className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/10 h-20"
  >     
    <div className='h-full px-6 md:px-12 flex items-center justify-between'>
     
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2" data-testid = "logo-link" >
        <h1 className='text-2xl tracking-tight font-normal'> 
          BerCust
        </h1>
      </Link>
     
     {/* LADO DERECHO */}
     <div className="flex items-center gap-6">
      
      {/* USUARIO */}
        {user ? (
          console.log("que hay",user),
          <div className="flex items-center gap-4">

            {/* saludo */}
            <span className="text-sm md:text-base">
              Hola <strong>{user.username}</strong>
            </span>
             
            {/* logout */}
            <button 
              onClick={logout}
              title="Cerrar sesión"
              className="flex items-center gap-1 text-sm hover:text-red-500 transition"
              > 
                <LogOut strokeWidth={1.5} size={18} />
            </button>
          </div>
          ) : (
            <Link
              to="/admin/login" //Navega al login del admin
              className="flex items-center gap-2 hover:text-accent transition"
              title="Iniciar sesión"
              data-testind="admin-link"
            >
               <User strokeWidth={1.5} size={20} />           
              
            </Link>
          )}
     
      {/* CART */}
      <button 
      onClick={openCart} //ejecuta openCart(). Abre el carrito
      className="relative hover:text-accent transition"
      data-testid="cart-button"
      >
        <ShoppingCart strokeWidth={1.5} size={22}/> {/**Ícono visual del carrito */}
         {/**Contador de productos */}
        {itemCount > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            data-testid="cart-count"
            >
              {itemCount} {/**Número total de productos en el carrito */}
            </span>
        )}

      </button>
     </div>
   </div>  
 </motion.header>
);
};
   
export default Header; //Permite usarlo en cualquier página:


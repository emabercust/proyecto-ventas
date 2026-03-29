import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(); //Crea un contenedor global vacío.
                                     //Todavía no tiene datos, solo define. “Acá va a vivir el estado del carrito”
export const useCart = () => { //Define un hook propio para usar el carrito fácilmente.
  const context = useContext(CartContext);
  //Si alguien usa useCart pero NO está envuelto por CartProvider
  //se lanza un error claro. Evita bugs difíciles de detectar.
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => { //Componente que envuelve la app y provee el carrito a todos los hijos.
                                                //children = todo lo que esté dentro de <CartProvider>.
  const [cart, setCart] = useState([]);     //Guarda los productos del carrito.
  const [isOpen, setIsOpen] = useState(false); //Controla si el carrito (drawer/modal) está abierto o cerrado.

  //Cargar carrito al iniciar
  //Se ejecuta una sola vez al montar el provider.
  //Busca carrito guardado. Lo convierte de string → objeto
  //Lo carga al estado
  // Sin esto, el carrito se perdería al recargar la página.
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  //Guardar carrito cada vez que cambia
  //Cada vez que cart cambia: lo guarda en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  //Función para agregar productos al carrito.
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => { //Usa el estado anterior (muy importante para evitar errores).
      const existingItem = prevCart.find(item => item.id === product.id); //Busca si el producto ya está en el carrito
      if (existingItem) { //si ya existe No duplica el producto, solo suma cantidad
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      //Si no existe. Agrega un nuevo item al carrito.
      return [...prevCart, { ...product, quantity }];
    });
  };

  //ELIMINAR PRODUCTO
  const removeFromCart = (productId) => { //Quita el producto por ID
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  //ACTUALIZAR CANTIDAD
  const updateQuantity = (productId, quantity) => {//Cambia la cantidad de un producto
    //Si la cantidad es 0 o menor: elimina el producto
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => //Actualiza solo ese producto.
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  //VACIAR CARRITO: borra todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  //Total a pagar
  const getTotal = () => {
    //Suma: precio × cantidad, de todos los productos
    return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
  };

  //Cantidad total de items
  const getItemCount = () => {
    //Devuelve cuántos productos hay en total (no distintos).
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  //CONTROL DEL DRAWER/modal
  //Abre y cierra el carrito desde cualquier componente.
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
    //Todo lo que se ponga acá: estará disponible en useCart()
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isOpen,
        openCart,
        closeCart
      }}
    >
    {/**Renderiza toda la app con acceso al carrito. */}
      {children} 
    </CartContext.Provider>
  );
};
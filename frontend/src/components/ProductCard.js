import { motion } from 'framer-motion'; //Permite animaciones (fade + slide al aparecer).
import { Link } from 'react-router-dom'; //Permite navegar sin recargar la página (SPA).
import { useCart } from '../context/CartContext'; //Conecta este componente con el carrito global.
import { toast } from 'sonner'; //sonner:Es una librería de toasts/notificaciones (los mensajitos que aparecen arriba tipo “Producto agregado al carrito”
                                 //Muestra notificaciones.

//Recibe el producto desde HomePage.
const ProductCard = ({ product }) => {
  const { addToCart, openCart } = useCart(); //Conexión con el carrito. CartContext
  //addToCart → función global para agregar productos
  //openCart → función global para abrir el panel del carrito
  //ProductCard NO tiene carrito propio, se conecta al carrito global mediante Context.


  //Cuando se hace click en “Agregar”
  const handleAddToCart = () => {
    addToCart(product); //Envía el producto al carrito global. Y esto viaja al CartContext
    toast.success(`${product.nombre} agregado al carrito`);
    setTimeout(() => openCart(), 300); //Abre el CartDrawer
                                       //isCartOpen = true, Y eso hace que el componente CartDrawer se abra automáticamente
                                       // al agregar un producto.
  };

  return ( 
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative"
      data-testid="product-card"
    >
      <Link to={`/product/${product.id}`}> {/*Esto es la responsable de abrir la página de detalle del producto/*/}
        <div className="relative overflow-hidden aspect-[3/4] bg-secondary mb-4">
          {product.imagen ? (
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-normal hover:text-accent transition-colors" data-testid="product-name">
            {product.nombre}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.descripcion}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-medium" data-testid="product-price">${Number(product.precio).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-primary-foreground h-10 px-6 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all"
            data-testid="add-to-cart-button"
          >
            Agregar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
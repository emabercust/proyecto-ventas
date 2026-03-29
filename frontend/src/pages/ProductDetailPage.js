import { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart(); //Igual que en ProductCard. Esta página también puede agregar al carrito
  const [product, setProduct] = useState(null); //product, guarda el producto traído del backend
  const [quantity, setQuantity] = useState(1); // quantity, cantidad elegida por el usuario
  const [loading, setLoading] = useState(true); // loading, muestra "Cargando..." mientras pide datos

  //useEffect → pedir el producto al backend
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  
  //fetchProduct → llamada a Django
  const fetchProduct = useCallback( async () => {
    try {
      setLoading(true);
      const response = await api.get(`/productos/${id}/`); //trae datos del producto
      setProduct(response.data); //guarda el producto:
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar el producto');
      navigate('/');
    } finally {
      setLoading(false); //apaga el loading:
    }
  }, [id, navigate]);

  //Agregar al carrito. Esto es igual que ProductCard PERO ahora con cantidad.
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.nombre} agregado al carrito`);
    setTimeout(() => openCart(), 300);
  };

  //Pantalla de carga mientras espera al backend
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center" data-testid="loading">Cargando...</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <div className="pt-20">
        <button
          onClick={() => navigate('/')}
          className="fixed top-28 left-6 md:left-12 z-40 flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-0 h-screen bg-secondary flex items-center justify-center"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.nombre}
                className="max-w-full max-h-full object-contain p-12"
              />
            ) : (
              <div className="text-muted-foreground">Sin imagen</div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-6 md:p-12 lg:p-24 flex flex-col justify-center"
          >
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-6" data-testid="product-title">
                {product.nombre}
              </h1>

              <p className="text-3xl font-medium mb-8" data-testid="product-price">
                ${Number(product.precio).toFixed(2)}
              </p>

              <div className="space-y-6 mb-12">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Descripción
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground" data-testid="product-description">
                    {product.descripcion}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Cantidad
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} //selector de cantidad. Evita que baje de 1.
                    className="w-10 h-10 flex items-center justify-center border border-border hover:bg-secondary transition-colors"
                    data-testid="decrease-quantity"
                  >
                    <Minus size={16} strokeWidth={1.5} />
                  </button>
                  <span className="w-12 text-center font-medium" data-testid="quantity">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-border hover:bg-secondary transition-colors"
                    data-testid="increase-quantity"
                  >
                    <Plus size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-14 uppercase tracking-widest text-xs font-bold"
                data-testid="add-to-cart-button"
              >
                Agregar al Carrito
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
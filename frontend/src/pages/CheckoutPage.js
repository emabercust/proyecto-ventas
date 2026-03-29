import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    card_number: '',
    card_expiry: '',
    card_cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setLoading(true);
    try {
      const pedidoData = {
        cliente_nombre: formData.customer_name,
        cliente_email: formData.customer_email,
        cliente_direccion: formData.customer_address,
        items: cart.map(item => ({
          producto: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.quantity
        })),
        total: getTotal(),
        payment_info: {
          card_number: `****${formData.card_number.slice(-4)}`,
          card_expiry: formData.card_expiry
        }
      };

      await api.post('/pedidos/', pedidoData);
      console.log("Toast ejecutado, pedido realizado");

      toast.success('¡Pedido realizado con éxito!');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Tu carrito está vacío</h2>
          <Button onClick={() => navigate('/')} data-testid="back-to-shop">
            Volver a la tienda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6 md:px-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors mb-12"
        data-testid="back-button"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Volver
      </button>

      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-normal tracking-tight mb-12"
        >
          Finalizar Compra
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-normal mb-6">Información del Cliente</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="customer_name">Nombre Completo</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                      data-testid="customer-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      required
                      data-testid="customer-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_address">Dirección de Envío</Label>
                    <Input
                      id="customer_address"
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleChange}
                      required
                      data-testid="customer-address"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="text-xl font-normal mb-6">Información de Pago (Simulado)</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="card_number">Número de Tarjeta</Label>
                    <Input
                      id="card_number"
                      name="card_number"
                      placeholder="1234 5678 9012 3456"
                      value={formData.card_number}
                      onChange={handleChange}
                      required
                      data-testid="card-number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card_expiry">Vencimiento</Label>
                      <Input
                        id="card_expiry"
                        name="card_expiry"
                        placeholder="MM/AA"
                        value={formData.card_expiry}
                        onChange={handleChange}
                        required
                        data-testid="card-expiry"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card_cvv">CVV</Label>
                      <Input
                        id="card_cvv"
                        name="card_cvv"
                        placeholder="123"
                        value={formData.card_cvv}
                        onChange={handleChange}
                        required
                        data-testid="card-cvv"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 uppercase tracking-widest text-xs font-bold"
                data-testid="submit-order"
              >
                {loading ? 'Procesando...' : 'Realizar Pedido'}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-muted p-8"
          >
            <h2 className="text-xl font-normal mb-6">Resumen del Pedido</h2>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm" data-testid="order-item">
                  <span>
                    {item.nombre} x {item.quantity}
                  </span>
                  <span>${(item.precio * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border/30 pt-4">
              <div className="flex justify-between text-lg font-medium">
                <span className="uppercase tracking-widest text-xs">Total</span>
                <span data-testid="order-total">${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
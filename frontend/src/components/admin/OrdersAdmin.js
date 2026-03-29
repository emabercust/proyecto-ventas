import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pedidos/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-normal tracking-tight">Pedidos</h1>
      </div>

      {loading ? (
        <div className="text-center py-12" data-testid="loading">Cargando...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border/50 shadow-sm p-12 text-center" data-testid="no-orders">
          <Package className="mx-auto mb-4 text-muted-foreground" size={48} strokeWidth={1.5} />
          <p className="text-muted-foreground">No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="space-y-6" data-testid="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-border/50 shadow-sm p-6"
              data-testid="order-card"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg mb-1">{order.cliente_nombre}</h3>
                  <p className="text-sm text-muted-foreground">{order.cliente_email}</p>
                  <p className="text-sm text-muted-foreground">{order.cliente_direccion}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Total
                  </p>
                  <p className="text-2xl font-medium">${Number(order.total).toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-border/30 pt-4 mb-4">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Productos
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.nombre} x {item.cantidad}
                      </span>
                      <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/30 pt-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Fecha: {formatDate(order.creado)}</span>
                  <span>{/**Pago: {orde.payment_info.card_number}*/}</span> 

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;


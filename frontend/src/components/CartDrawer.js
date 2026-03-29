import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';

const CartDrawer = () => {
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout'); 
  };
 
  return (
    <Sheet open={isOpen} onOpenChange={closeCart}> 
      <SheetContent className="w-full sm:max-w-lg" data-testid="cart-drawer">
        <SheetHeader>
          <SheetTitle className="text-2xl font-normal">Carrito</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4" data-testid="empty-cart">
              <ShoppingBag size={48} strokeWidth={1.5} className="text-muted-foreground" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
             
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-border/30 pb-4" data-testid="cart-item">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.nombre}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.nombre}</h4>
                      <p className="text-sm text-muted-foreground">${Number(item.precio).toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-border hover:bg-secondary"
                          data-testid="decrease-quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-8 text-center" data-testid="item-quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-border hover:bg-secondary"
                          data-testid="increase-quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-foreground"
                      data-testid="remove-item"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/30 pt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="uppercase tracking-widest text-xs font-semibold">Total</span>
                  <span className="font-medium" data-testid="cart-total">${getTotal().toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 uppercase tracking-widest text-xs font-bold"
                  data-testid="checkout-button"
                >
                  Proceder al Pago
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
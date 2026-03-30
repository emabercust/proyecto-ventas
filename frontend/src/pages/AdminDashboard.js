import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Grid3x3, LogOut, ShoppingBag } from 'lucide-react';
import ProductsAdmin from '../components/admin/ProductsAdmin';
import CategoriesAdmin from '../components/admin/CategoriesAdmin';
import OrdersAdmin from '../components/admin/OrdersAdmin';

import {useAuth} from "../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const {user, logout} = useAuth()

  useEffect(() => {
    //verifica si hay usuario
    if (!user){
      navigate ("/admin/login");
      return;
    }

    //verifica si es admin
    if (user.role != "admin"){
      navigate ("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout(); //limpia token + user
    navigate('/admin/login/');
  };

  //evita render mientras valida
  if (!user || user.role !== "admin") {
    return null;
  }

  const menuItems = [
    { path: '/admin/products', label: 'Productosfff', icon: Package },
    { path: '/admin/categories', label: 'Categorías', icon: Grid3x3 },
   { path: '/admin/orders', label: 'Pedidos', icon: ShoppingBag }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-primary text-primary-foreground p-6 flex flex-col" data-testid="admin-sidebar">
        <div className="mb-12">
          <h1 className="text-2xl font-normal tracking-tight">BERCUST</h1>
          <p className="text-xs uppercase tracking-widest opacity-70 mt-1">Admin</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-primary-foreground/10 text-primary-foreground'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="text-sm uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4">
          <Link
            to="/"
            className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            data-testid="view-store"
          >
            Ver Tienda
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            data-testid="logout-button"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-secondary/30 min-h-screen">
        <Routes>
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} /> 
          <Route path="*" element={<ProductsAdmin />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;

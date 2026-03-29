import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react'; //Importa íconos SVG (carrito y usuario) desde la librería lucide-react.
import { motion } from 'framer-motion'; //Importa motion, que permite animaciones en componentes React.
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
//import { toast } from 'sonner';
//import { getProductos, eliminarProducto } from "../services/productosService";

const HomePage = () => {
  
  const [products, setProducts] = useState([]); // ESTE estado será el único listado de productos
  const [categories, setCategories] = useState([]); //Categorías (opcional – podés eliminar si no las usás aún)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

// 🔹 Carga inicial
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []); 

  // 🔹 Se ejecuta cuando cambia búsqueda o categoría
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

   // Categorías
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categorias/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.warn('Categorías aún no implementadas');
    }
  };

  
  const fetchProducts = async () => {
    try {
      setLoading(true);//activa el estado de carga
      // Parámetros opcionales (Django los puede ignorar por ahora)
      const params = {}; //se crea un objeto donde se guardarán los filtros que se envia a Django
      if (selectedCategory) params.categoria_id = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/productos/', { params });
     // Guarda productos de PostgreSQL
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
     // toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6">
            Colección<br />Mix
          </h1>
          <p className="text-lg md:text-xl leading-relaxed font-light text-muted-foreground max-w-2xl">
            Descubre todos los productos seleccionados para ti.
          </p>
        </motion.div>
      </section>

      {/* Search & Filter - buscador */}
      <section className="py-8 px-6 md:px-12 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-transparent border-b border-input pl-8 pr-4 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                data-testid="search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter size={20} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                  selectedCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent border border-border hover:bg-secondary'
                }`}
                data-testid="category-all"
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent border border-border hover:bg-secondary'
                  }`}
                  data-testid={`category-${category.id}`}
                >
                  {category.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-muted-foreground" data-testid="loading">Cargando...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground" data-testid="no-products">
              No se encontraron productos
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12" data-testid="products-grid">
              {products.map((producto) => (
              <ProductCard key={producto.id} product={producto} />

      
              ))}
            </div>
          )} 
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            © 2026 BerCust. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from 'context/AuthContext';

const AdminLoginPage = () => {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Decide si es login o registro
      const endpoint = isLogin ? '/auth/login/' : '/auth/register/';
      const response = await api.post(endpoint, formData);
      //response contiene el "access_token" y "user":{"username","email","role"} 
      console.log("contenido de user", response.data);
      
      if (response.data.access_token) {
          //guarda usuario completo para mostrar "hola juan"
          // Guardar token, sirve tanto para admin como cliente.
           
          login(response.data.user, response.data.access_token, response.data.refresh_token);
           
          if (response.data.user.role ==="admin") {
            navigate('/admin/*'); // AdminDashboard
          } else {
            navigate('/'); // tienda
          }
      }
      toast.success(isLogin ? 'Inicio de sesión exitoso' : 'Registro exitoso');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        'Error de autenticación'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal tracking-tight mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona tu tienda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              data-testid="email-input"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              data-testid="password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 uppercase tracking-widest text-xs font-bold"
            data-testid="submit-button"
          >
            {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="toggle-auth-mode"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="back-to-store"
          >
            Volver a la tienda
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;


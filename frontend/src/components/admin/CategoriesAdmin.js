import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categorias/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar categorías');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await api.put(`/categorias/${editingCategory.id}/`, formData);
        toast.success('Categoría actualizada');
      } else {
        await api.post('/categorias/', formData);
        toast.success('Categoría creada');
      }

      fetchCategories();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Error al guardar categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await api.delete(`/categorias/${id}/`);
      toast.success('Categoría eliminada');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar categoría');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '' });
    setEditingCategory(null);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-normal tracking-tight">Categorías</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button data-testid="create-category-button">
              <Plus size={16} className="mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="category-dialog">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  data-testid="category-name-input"
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  data-testid="category-description-input"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" data-testid="save-category-button">
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  data-testid="cancel-button"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-border/50 shadow-sm p-6"
            data-testid="category-card"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{category.nombre}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 hover:bg-secondary transition-colors"
                  data-testid="edit-category-button"
                >
                  <Edit size={16} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 hover:bg-secondary transition-colors text-red-600"
                  data-testid="delete-category-button"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            {category.descripcion && (
              <p className="text-sm text-muted-foreground">{category.descripcion}</p>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-white border border-border/50" data-testid="no-categories">
          No hay categorías registradas
        </div>
      )}
    </div>
  );
};

export default CategoriesAdmin;
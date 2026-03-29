import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import api, { BACKEND_URL } from '../../utils/api';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useDropzone } from 'react-dropzone';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '' //mejor es poner: categoria_id? asi entiendo mejor?
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/productos/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categorias/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      submitData.append('nombre', formData.nombre);
      submitData.append('descripcion', formData.descripcion);
      submitData.append('precio', formData.precio);
      if (formData.categoria) {
        submitData.append('categoria', formData.categoria);
      }
      if (imageFile) {
        submitData.append('imagen', imageFile);
      }

      if (editingProduct) {
        await api.put(`/productos/${editingProduct.id}/`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Producto actualizado');
      } else {
        await api.post('/productos/', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Producto creado');
      }

      fetchProducts();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error al guardar producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      categoria: product.categoria || ''
    });
    if (product.imagen) {
      setImagePreview(product.imagen);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await api.delete(`/productos/${id}/`);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', categoria: '' });
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-normal tracking-tight">Productos</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button data-testid="create-product-button">
              <Plus size={16} className="mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="product-dialog">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label>Imagen del Producto</Label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-none p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-secondary' : 'border-border hover:border-primary'
                  }`}
                  data-testid="image-dropzone"
                >
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto mb-4" />
                  ) : (
                    <Upload className="mx-auto mb-4 text-muted-foreground" size={48} strokeWidth={1.5} />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  data-testid="product-name-input"
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  data-testid="product-description-input"
                />
              </div>

              <div>
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  data-testid="product-price-input"
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full h-10 border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  data-testid="product-category-select"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" data-testid="save-product-button">
                  {editingProduct ? 'Actualizar' : 'Crear'}
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

      {/* Products Table */}
      <div className="bg-white border border-border/50 shadow-sm overflow-hidden">
        <table className="w-full" data-testid="products-table">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-widest font-semibold">Imagen</th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-widest font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-widest font-semibold">Precio</th>
              <th className="px-6 py-4 text-left text-xs uppercase tracking-widest font-semibold">Categoría</th>
              <th className="px-6 py-4 text-right text-xs uppercase tracking-widest font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border/30" data-testid="product-row">
                <td className="px-6 py-4">
                  {product.imagen ? (
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{product.nombre}</td>
                <td className="px-6 py-4">${Number(product.precio).toFixed(2)}</td>
                <td className="px-6 py-4">
                  {categories.find(c => c.id === product.categoria)?.nombre || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 hover:bg-secondary transition-colors"
                      data-testid="edit-product-button"
                    >
                      <Edit size={16} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-secondary transition-colors text-red-600"
                      data-testid="delete-product-button"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground" data-testid="no-products">
            No hay productos registrados
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsAdmin;
from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField

# Create your models here.
# model solo define la tabla.

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True) #URL amigable
    descripcion = models.TextField(blank=True)
    creada = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['nombre']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

#Crea la tabla producto en la base de datos
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    ##stock = models.IntegerField()
    creado = models.DateTimeField(auto_now_add=True)
    categoria = models.ForeignKey(Categoria,
    on_delete=models.SET_NULL,null=True,blank=True)
    #blank=True: Permite que el formulario lo deje vacío.
    #null=True: Permite que la base de datos acepte NULL.
    #upload_to: Define la carpeta donde se guardan: media/productos/ 
    #Ejemplo real: media/productos/laptop.jpg
    imagen = CloudinaryField('image')
    def __str__(self):
        return self.nombre


class Pedido(models.Model):
    cliente_nombre = models.CharField(max_length=100)
    cliente_email = models.EmailField()
    cliente_direccion = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.cliente_nombre}"        

#guarda los productos dentro del pedido:
class PedidoItem(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL,null=True,blank=True) #Si borras el producto: Pedido sigue existiendo
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField() 
 
class Ejemplo(models.Model):
    nombre = models.CharField(max_length=199)
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL,null=True,blank=True )

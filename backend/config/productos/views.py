# Create your views here.
from rest_framework import viewsets
from .models import Producto, Categoria, Pedido, Ejemplo
from .serializers import ProductoSerializer, CategoriaSerializer, PedidoSerializer, EjemploSerializer
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = (MultiPartParser, FormParser)  # 🔥 IMPORTANTE
    permission_classes = [IsAdminUser]
    def get_permissions(self):
        #GET productos -> publico
        if self.request.method == "GET":
            print("FILES de cloudinary:", self.request.FILES)
           return [AllowAny()]

        ##POST, PUT, DELETE producto -> admin
        return [IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        categoria = self.request.query_params.get("categoria_id")
        search = self.request.query_params.get("search")  
    
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        if search:
            queryset = queryset.filter(nombre__icontains=search)
    
        return queryset
    

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
   # permission_classes = [IsAuthenticatedOrReadOnly]
 
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    ##permission_classes = [IsAuthenticatedOrReadOnly]


class EjemploViewSet(viewsets.ModelViewSet):
    queryset = Ejemplo.objects.all()
    serializer_class = EjemploSerializer
    ##permission_classes = [IsAuthenticatedOrReadOnly]

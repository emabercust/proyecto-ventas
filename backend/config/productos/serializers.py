from rest_framework import serializers
from .models import Producto, Categoria, Pedido, PedidoItem, Ejemplo
from rest_framework import serializers
import cloudinary.utils

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
    def get_imagen(self, obj):
        
    if obj.imagen:
        url, _ = cloudinary.utils.cloudinary_url(
            obj.imagen.public_id,
            width=400,
            height=400,
            crop="fill",
            quality="auto"
        )
        return url
    return None
    
class CategoriaSerializer(serializers.ModelSerializer):
    
    #Cuenta cuantos productos hay en la categoría.
    #ejm: {"id":1,"nombre":"Electrónica","slug":"electronica","productos_count":8}
    productos_count = serializers.IntegerField( 
        source="productos.count",
        read_only=True
    )

    class Meta:
        model = Categoria
        fields = ["id", "nombre", "slug", "descripcion", "productos_count", "creada"]
        read_only_fields = ["slug", "creada"]

class PedidoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidoItem
        fields = ['producto', 'nombre', 'precio', 'cantidad']

class PedidoSerializer(serializers.ModelSerializer):
    items = PedidoItemSerializer(many=True)

    class Meta:
        model = Pedido
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        pedido = Pedido.objects.create(**validated_data)

        for item_data in items_data:
            PedidoItem.objects.create(pedido=pedido, **item_data)

        return pedido


class EjemploSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejemplo
        fields = '__all__'

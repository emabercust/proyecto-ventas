from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado")

        if not user.check_password(data['password']):
            raise serializers.ValidationError("Contraseña incorrecta")

        if not user.is_staff:
            raise serializers.ValidationError("No autorizado")

        refresh = RefreshToken.for_user(user)

        return {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }

        #¿Qué hace este método?
        #Busca usuario por email
        #Verifica contraseña
        #Verifica que sea admin (is_staff)
        #Genera JWT
        #Devuelve token

#Registro SOLO para clientes. Esto crea usuarios normales
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password'] #solo incluye estos campos del formulario
        
        #evita que el password se devuelva en la respuesta JSON.
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        
        #evitar usuarios duplicados
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("El email ya está registrado")

        # se usa el email como username, Si el email es: admin@gmail.com genera:admin como username.
        username = email.split('@')[0]

        #User.objects.create_user, hace:
        #guarda el usuario, encripta el password
        #usa el sistema de auth de Django
        #Nunca se debe usar User.objects.create() para contraseñas.
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password)
        user.is_staff = True #Esto permite que el usuario sea administrador del panel
        user.save()
        return user


class CustomerRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_staff = False
        user.save()
        return user

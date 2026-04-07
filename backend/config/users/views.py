from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .serializers import LoginSerializer, RegisterSerializer


#class LoginView(APIView):
#    def post(self, request):
#        serializer = LoginSerializer(data=request.data)
#        serializer.is_valid(raise_exception=True)
#        return Response(serializer.validated_data)


#class RegisterView(APIView):
#    def post(self, request):
#        serializer = RegisterSerializer(data=request.data)
#        serializer.is_valid(raise_exception=True)
#        serializer.save()
#        return Response({"message": "Usuario creado"}, status=status.HTTP_201_CREATED)


#Crea la vista del registro
#Esto devuelve:
#access_token
#is_admin
@api_view(["POST"])
def register(request):

    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "usuario creado correctamente"})

    return Response(serializer.errors, status=400)        


@api_view(["POST"])
def login(request):

     email = request.data.get("email")
     password = request.data.get("password")
     
     #se busca primero el usuario por email y luego autenticarlo con su username.
     try:
        user_obj = User.objects.get(email=email)
     except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=400)


     user = authenticate(username=user_obj.username, password=password)

     if user is None:
         return Response({"error": "Credenciales inválidas"}, status=400)

     refresh = RefreshToken.for_user(user)

     #backend debe enviar el token, usuario y rol en el login.
     return Response({
        "access_token": str(refresh.access_token),
         "refresh_token": str(refresh),
        "user":{
            "username": user.username,
            "email": user.email,
            "role": "admin" if user.is_staff else "customer"
        }
         
     })        

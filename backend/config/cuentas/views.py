from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, RegisterSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Usuario creado"}, status=status.HTTP_201_CREATED)


#Login único para todos
#Esto devuelve:
#access_token
#is_admin
@api_view(["POST"])
def login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({"error": "Credenciales inválidas"}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response({
        "access_token": str(refresh.access_token),
        "is_admin": user.is_staff
    })        
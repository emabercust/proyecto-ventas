#!/usr/bin/env bash

echo "📁 Entrando a backend/config..."
cd config || exit

echo "📦 Instalando dependencias..."
pip install -r ../requirements.txt

echo "🧱 Migrando base de datos..."
python manage.py migrate --noinput

echo "Creando superusuario (si no existe)..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()

username = "admin"
email = "admin@gmail.com"
password = "admin123"

if not User.objects.filter(username=username).exists():
    print("Creando superusuario...")
    User.objects.create_superuser(username, email, password)
else:
    print("El superusuario ya existe")
END

echo "📁 Collect static..."
python manage.py collectstatic --noinput

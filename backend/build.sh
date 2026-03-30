#!/usr/bin/env bash

echo "📁 Entrando a backend/config..."
cd config || exit

echo "📦 Instalando dependencias..."
pip install -r ../requirements.txt

echo "🧱 Migrando base de datos..."
python manage.py migrate --noinput

echo "Creando superusuario..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser("admin", "admin@gmail.com", "admin123")
END

echo "📁 Collect static..."
python manage.py collectstatic --noinput

echo "👤 Creando superusuario..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@gmail.com', 'admin123')" | python manage.py shell

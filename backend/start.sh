#!/bin/sh
set -e

echo "Menunggu PostgreSQL siap..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" 2>/dev/null; do
    sleep 1
done
echo "PostgreSQL siap!"

echo "Menjalankan migrasi database..."
php artisan migrate --force
echo "Migrasi selesai!"

echo "Memulai Supervisor..."
exec supervisord -c /etc/supervisor.conf

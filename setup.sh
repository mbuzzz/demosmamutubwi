#!/bin/bash
set -e

# Setup colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== SIT APP - SETUP SCRIPT ===${NC}"

# 1. Jalankan PostgreSQL dan Redis
echo -e "${BLUE}Menjalankan container PostgreSQL & Redis via Docker Compose...${NC}"
docker compose up -d

# Tunggu sampai Postgres menerima koneksi
echo -e "${YELLOW}Menunggu PostgreSQL siap menerima koneksi...${NC}"
until docker compose exec -T postgres pg_isready -U sit_user -d sit_db &>/dev/null; do
    sleep 1
done
echo -e "${GREEN}PostgreSQL siap!${NC}"

# 2. Setup Backend Laravel
echo -e "${BLUE}Mengonfigurasi Laravel Backend...${NC}"
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
fi

# Ubah konfigurasi database ke PostgreSQL & cache ke Redis
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=pgsql/' .env
sed -i 's/# DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/DB_HOST=.*/DB_HOST=127.0.0.1/' .env
sed -i 's/# DB_PORT=.*/DB_PORT=2024/' .env
sed -i 's/DB_PORT=.*/DB_PORT=2024/' .env
sed -i 's/# DB_DATABASE=.*/DB_DATABASE=sit_db/' .env
sed -i 's/DB_DATABASE=.*/DB_DATABASE=sit_db/' .env
sed -i 's/# DB_USERNAME=.*/DB_USERNAME=sit_user/' .env
sed -i 's/DB_USERNAME=.*/DB_USERNAME=sit_user/' .env
sed -i 's/# DB_PASSWORD=.*/DB_PASSWORD=sit_password/' .env
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=sit_password/' .env

sed -i 's/SESSION_DRIVER=.*/SESSION_DRIVER=redis/' .env
sed -i 's/CACHE_STORE=.*/CACHE_STORE=redis/' .env
sed -i 's/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=redis/' .env

# Install package composer & generate APP_KEY
composer install
php artisan key:generate

# Jalankan migrasi tabel & seed data awal
echo -e "${BLUE}Menjalankan database migration & seeding...${NC}"
php artisan migrate:fresh --seed

# 3. Setup Frontend React
echo -e "${BLUE}Mengonfigurasi React Frontend...${NC}"
cd ../frontend

if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:8000/api" > .env
fi

npm install --legacy-peer-deps

echo -e "${GREEN}=== Setup Selesai dengan Sukses! ===${NC}"
echo -e "Jalankan Backend: ${YELLOW}php artisan serve${NC} di dalam direktori ${BLUE}backend/${NC}"
echo -e "Jalankan Frontend: ${YELLOW}npm run dev${NC} di dalam direktori ${BLUE}frontend/${NC}"

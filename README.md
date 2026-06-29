# Sistem Informasi Terpadu (SIT) - SMAS Muhammadiyah 1 Banyuwangi

Repositori ini berisi source code untuk aplikasi Sistem Informasi Terpadu (SIT) yang terdiri dari Backend (Laravel 11) dan Frontend (React + Vite).

Aplikasi ini mencakup modul krusial seperti:
- **Akademik & Penugasan**
- **Keuangan & Pembayaran** (Support RFID Tap)
- **Computer Based Test (CBT)**
- **Learning Management System (LMS)**
- **CMS Profil Sekolah (Web Publik)**

---

## 🚀 Panduan Deployment ke Production (Server)

Berikut adalah langkah-langkah spesifik untuk men-deploy aplikasi ini ke lingkungan server produksi (VPS/Dedicated Server) menggunakan **Ubuntu, Nginx, PHP 8.2+, dan Node.js**.

### 1. Persyaratan Sistem (Prerequisites)
Pastikan server Anda sudah terinstal:
- PHP >= 8.5 (dengan ekstensi pgsql/mysql, bcmath, ctype, fileinfo, mbstring, openssl, pdo, tokenizer, xml)
- Composer 2.x
- Node.js >= 18.x dan npm
- PostgreSQL (disarankan) atau MySQL/MariaDB
- Nginx / Apache
- Git

### 2. Setup Backend (Laravel API)

```bash
# 1. Masuk ke folder backend
cd sit-app/backend

# 2. Install dependensi PHP (tanpa package dev untuk production)
composer install --optimize-autoloader --no-dev

# 3. Salin file environment
cp .env.example .env

# 4. Generate Application Key
php artisan key:generate
```

**Konfigurasi File `.env` Backend:**
Edit file `.env` dan pastikan variabel krusial berikut diatur dengan benar agar **Sistem Session dan Autentikasi SPA (Sanctum)** tidak bermasalah (terutama masalah CORS & CSRF 419 yang sering terjadi di Laravel SPA):

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sit.smasmuh1bwi.sch.id

# Konfigurasi Database (Ganti sesuai kredensial server Anda)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nama_database
DB_USERNAME=user_database
DB_PASSWORD=password_database

# Konfigurasi Session & Sanctum (SANGAT PENTING UNTUK LOGIN SPA)
SESSION_DRIVER=database # atau 'file'
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true # WAJIB 'true' jika server menggunakan HTTPS
SESSION_SAME_SITE=lax

# Jika frontend dan backend berjalan di domain yang sama (SANGAT DIREKOMENDASIKAN)
# HAPUS ATAU KOSONGKAN SESSION_DOMAIN agar browser membatasi ke domain saat ini secara otomatis
SESSION_DOMAIN=

# Domain asal Frontend (Pisahkan dengan koma jika ada lebih dari satu)
SANCTUM_STATEFUL_DOMAINS=sit.smasmuh1bwi.sch.id
FRONTEND_URL=https://sit.smasmuh1bwi.sch.id
```

**Lanjutkan Eksekusi Backend:**
```bash
# 5. Jalankan Migrasi Database
php artisan migrate --force

# 6. Buat tautan direktori storage (untuk upload foto, materi, dll)
php artisan storage:link

# 7. Optimasi performa Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Atur hak akses folder (Wajib di OS Linux)
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3. Setup Frontend (React SPA)

```bash
# 1. Masuk ke folder frontend
cd ../frontend

# 2. Install dependensi NPM
npm install

# 3. Konfigurasi Environment Frontend
```
Buat/Edit file `sit-app/frontend/.env`:
```env
# Gunakan relative path '/api' jika Anda menggunakan Nginx Reverse Proxy (Direkomendasikan agar bebas masalah CORS)
VITE_API_URL=/api
```

```bash
# 4. Build aplikasi untuk Production
npm run build
```
Setelah proses build selesai, hasil kompilasi akan berada di dalam folder `sit-app/frontend/dist`. Folder `dist` inilah yang akan disajikan (served) oleh Nginx.

---

### 4. Konfigurasi Nginx (Satu Domain untuk Frontend & Backend)

Metode terbaik untuk SPA Laravel Sanctum di production adalah menggunakan **1 Domain Tunggal**. Nginx akan menyajikan file statis React untuk _root_ (`/`), dan mem-proxy semua _request_ yang berawalan `/api` atau `/sanctum` ke Laravel. Ini menghapus semua masalah CORS.

Buat file konfigurasi Nginx (contoh: `/etc/nginx/sites-available/sit_app`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sit.smasmuh1bwi.sch.id; # Ganti dengan domain asli
    
    # Redirect HTTP ke HTTPS (Opsional jika sudah ada SSL)
    # return 301 https://$host$request_uri;

    # 1. Serve Frontend (React)
    root /path/ke/sit-app/frontend/dist; # Arahkan ke folder 'dist' hasil build React
    index index.html;

    location / {
        try_files $uri $uri/ /index.html; # History API fallback untuk React Router
    }

    # 2. Serve Backend API (Laravel)
    location ~ ^/(api|sanctum|storage) {
        alias /path/ke/sit-app/backend/public; # Arahkan ke folder 'public' Laravel
        try_files $uri $uri/ @laravel;
    }

    location @laravel {
        rewrite /(.+)$ /index.php?url=$1 last;
    }

    location ~ \.php$ {
        root /path/ke/sit-app/backend/public;
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.5-fpm.sock; # Sesuaikan versi PHP
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Blokir akses ke file tersembunyi
    location ~ /\.ht {
        deny all;
    }
}
```

Aktifkan konfigurasi dan _restart_ Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/sit_app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 5. Tambahan Production (Opsional namun disarankan)

**A. Cron Job (Untuk Proses Terjadwal Laravel)**
Tambahkan konfigurasi berikut ke Crontab VPS (`crontab -e`):
```text
* * * * * cd /path/ke/sit-app/backend && php artisan schedule:run >> /dev/null 2>&1
```

**B. Mode Ujian (CBT)**
Pastikan kapabilitas server (CPU dan RAM) memadai ketika sesi Ujian Online (CBT) serentak berlangsung, mengingat setiap kali siswa memilih jawaban akan ada *request auto-save* (`/api/cbt/simpan-jawaban`) yang dikirim ke server. Disarankan menaikkan limit _max connections_ di Nginx dan PHP-FPM.

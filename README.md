# Sistem Informasi Terpadu (SIT) - SMAS Muhammadiyah 1 Banyuwangi

Sistem Informasi Terpadu (SIT) adalah platform manajemen sekolah modern *Single Page Application* (SPA) yang dirancang secara khusus untuk SMAS Muhammadiyah 1 Banyuwangi. Sistem ini menggabungkan portal informasi publik (CMS) dan panel administratif internal (LMS, Akademik, Keuangan, dan Ujian Online).

Aplikasi ini dibangun menggunakan arsitektur **Headless**:
- **Backend:** Laravel 11.x (PHP 8.5)
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS 3.4
- **Database:** PostgreSQL / MySQL / SQLite (Development)

---

## 🌟 Fitur Utama (Modul)

1. **👨‍🏫 Manajemen Akademik & Penugasan**
   - Manajemen Data Master (Siswa, Guru, Staf, Kelas, Mata Pelajaran, Ekstrakurikuler).
   - Penugasan Guru (Mengajar & Tugas Struktural seperti Kepsek/Kurikulum).
   - Penjadwalan Pelajaran secara Dinamis (Mendukung hari custom).
   - Pencatatan Absensi KBM (Jurnal Mengajar).
   - E-Rapor Otomatis berdasarkan perhitungan Nilai Tujuan Pembelajaran (TP).

2. **💳 Keuangan & Pembayaran (Integrasi RFID)**
   - Sistem tagihan dinamis dan riwayat pembayaran cicilan.
   - Manajemen Beasiswa & Potongan Biaya Pendidikan.
   - **Fitur Tap Pembayaran RFID**: Mendukung mesin *scanner* RFID untuk absensi kedatangan dan pengecekan serta pembayaran otomatis menggunakan kartu siswa.

3. **💻 Computer Based Test (CBT) / Ujian Online**
   - Bank Soal Guru (Mendukung Pilihan Ganda dengan koreksi otomatis & Essay).
   - Manajemen Sesi Ujian dengan fitur Token & Waktu Mundur (*Countdown Timer*).
   - Antarmuka ujian siswa dengan *auto-save* untuk mencegah kehilangan data jika koneksi terputus.
   - Pemantau Ujian (*Live Monitor*) untuk pengawas kelas.

4. **📚 Learning Management System (LMS)**
   - Distribusi materi pembelajaran digital (PDF, Video, Teks, Tautan).
   - Fitur Tanya Jawab / Ruang Diskusi Terbuka pada setiap materi.
   - Distribusi Tugas / Pekerjaan Rumah.
   - Unggah Jawaban oleh Siswa dan Sistem *Grading* (Beri Nilai & Feedback) oleh Guru.

5. **🌐 CMS Profil Sekolah & Web Publik**
   - *Landing Page* dinamis yang dikendalikan penuh dari Dasbor Superadmin.
   - Profil Sekolah (Sejarah, Visi-Misi, Sambutan Kepala Sekolah).
   - Manajemen Berita/Blog dan Kategori Artikel (WYSIWYG Editor).
   - Galeri Foto Sekolah.
   - Testimoni dan FAQ (Pertanyaan yang sering diajukan).

---

## 🛠 Panduan Instalasi Lokal (Local Development)

Untuk menjalankan dan mengembangkan aplikasi ini di komputer lokal Anda:

### 1. Kebutuhan Sistem Lokal
- PHP >= 8.5
- Node.js >= 18.x
- Composer
- Git

### 2. Konfigurasi Backend (Laravel)
```bash
git clone git@github.com:mbuzzz/smamutubwi.git sit-app
cd sit-app/backend

# Install dependensi
composer install

# Siapkan env
cp .env.example .env
php artisan key:generate

# Edit file .env:
# Pastikan DB_CONNECTION=sqlite (untuk kemudahan lokal)
# Atau sesuaikan kredensial jika memakai MySQL/PostgreSQL
# Pastikan session mengarah ke file
# SESSION_DRIVER=file

# Jalankan migrasi dan isi data bawaan (Seeder)
touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan storage:link
```

### 3. Konfigurasi Frontend (React)
```bash
cd ../frontend

# Install dependensi
npm install

# Buat file env
echo "VITE_API_URL=/api" > .env
```

### 4. Menjalankan Aplikasi
Buka 2 tab terminal:

**Terminal 1 (Backend):**
```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Aplikasi bisa diakses melalui browser pada `http://localhost:5173`.
*(Catatan: Semua komunikasi API ke backend diatur otomatis melalui Vite Proxy untuk mencegah isu CORS)*.

---

## 🔑 Akun Default (Hasil Seeder)
Saat Anda menjalankan `php artisan migrate:fresh --seed`, sistem akan membuat beberapa akun *dummy* untuk memudahkan pengujian semua hak akses (Role):

| Role | Nama Pengguna | Username | Password |
|---|---|---|---|
| **Superadmin** | Admin SMAS Muh 1 | `admin` | `1234` |
| **Guru** | Rina Fitriani, S.Pd | `rina` | `1234` |
| **Wali Kelas** | Ahmad Fauzi, S.Pd | `ahmad` | `1234` |
| **Kepala Sekolah** | Drs. H. Sugeng, M.Pd | `sugeng` | `1234` |
| **Kurikulum** | Dewi Sartika, S.Pd | `dewi` | `1234` |
| **Bendahara** | Siti Nurhaliza, S.E | `siti` | `1234` |
| **Siswa** | Agus Setiawan | `agus` | `1234` |
| **Siswa** | Budi Santoso | `budi` | `1234` |

---

## 🚀 Panduan Deployment ke Production (Server)

Berikut adalah panduan _deployment_ ke lingkungan VPS (Ubuntu + Nginx).

### 1. Persiapan Server
- PHP >= 8.5
- Node.js >= 18.x
- PostgreSQL / MySQL

### 2. Deploy Backend
```bash
cd /var/www/sit-app/backend
composer install --optimize-autoloader --no-dev
cp .env.example .env
php artisan key:generate
```

**Edit `.env` Backend:** Sangat krusial agar **Sanctum SPA Authentication** bekerja tanpa *error* 419 / CORS.
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.sch.id

DB_CONNECTION=pgsql
# Sesuaikan parameter DB lainnya...

SESSION_DRIVER=database # atau file
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true # WAJIB 'true' jika domain Anda HTTPS
SESSION_SAME_SITE=lax

# KOSONGKAN nilai SESSION_DOMAIN agar browser membatasi ke domain saat ini otomatis
SESSION_DOMAIN=

SANCTUM_STATEFUL_DOMAINS=domain-anda.sch.id
FRONTEND_URL=https://domain-anda.sch.id
```

```bash
# Migrasi dan optimasi
php artisan migrate --force
php artisan storage:link
php artisan optimize
php artisan config:cache
php artisan route:cache

# Hak akses folder
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3. Build Frontend
```bash
cd /var/www/sit-app/frontend
npm install
echo "VITE_API_URL=/api" > .env
npm run build
```

### 4. Konfigurasi Nginx (Satu Domain untuk Keduanya)
Demi menghindari masalah *Cross-Origin Resource Sharing* (CORS) yang rumit pada Cookie Sanctum, cara paling *bulletproof* adalah me-reverse-proxy API Laravel di bawah domain Frontend yang sama.

Contoh konfigurasi Nginx (`/etc/nginx/sites-available/sit_app`):
```nginx
server {
    listen 80;
    server_name domain-anda.sch.id;
    
    # 1. Frontend (React Build)
    root /var/www/sit-app/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Backend (Laravel API & Storage)
    location ~ ^/(api|sanctum|storage) {
        alias /var/www/sit-app/backend/public;
        try_files $uri $uri/ @laravel;
    }

    location @laravel {
        rewrite /(.+)$ /index.php?url=$1 last;
    }

    location ~ \.php$ {
        root /var/www/sit-app/backend/public;
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.5-fpm.sock; # Sesuaikan versi PHP
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 5. Konfigurasi Cron Job
Buka *crontab* (`crontab -e`) dan tambahkan:
```text
* * * * * cd /var/www/sit-app/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔧 Panduan Pemecahan Masalah (Troubleshooting)

**1. Gagal Login / Tiba-tiba ter-Logout otomatis (Error 419 CSRF Token Mismatch)**
- *Penyebab*: Ini terjadi jika sistem mencoba melakukan sinkronisasi *Cookie* di lingkungan dengan domain atau *port* yang berbeda, atau `SESSION_DOMAIN` Anda tidak tepat.
- *Solusi Lokal*: Pastikan mengakses aplikasi HANYA melalui `http://localhost:5173`. Jangan mengakses melalui IP `127.0.0.1`.
- *Solusi Server*: Pastikan `SESSION_SECURE_COOKIE=true` sudah menyala jika menggunakan HTTPS, dan `SANCTUM_STATEFUL_DOMAINS` sama persis dengan domain yang tertulis di bilah URL browser Anda (tanpa `http://` atau `https://`).

**2. Gambar / Lampiran Ujian Tidak Muncul**
- *Penyebab*: Folder *symlink* tidak dibuat, atau Nginx belum mengekspos folder `/storage/`.
- *Solusi*: Pastikan Anda telah menjalankan `php artisan storage:link` di server Backend.

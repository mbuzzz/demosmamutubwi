# PRODUCT REQUIREMENTS & FEATURE DIRECTORY (SIT SMAM1 BWI)
## Integrated Information System — SMAS Muhammadiyah 1 Banyuwangi

This document serves as the official Product Specifications, Role-Based Access Control (RBAC) matrix, and User Flow testing guide. It is designed to configure and execute automated tests using **Testsprite**.

---

## 1. ACCESS PORTALS & DIRECT LOGIN LINKS

The application's frontend is accessible on port **`1945`**. Test sessions must initiate from the respective portal URLs based on the target role:

| Target Role | Access URL | Allowed Roles | Description |
|-------------|------------|---------------|-------------|
| **Unified Portal Selector** | [http://localhost:1945/login](http://localhost:1945/login) | *All Roles* | A hub page to select and navigate to specific portals. |
| **Student Portal** | [http://localhost:1945/login/siswa](http://localhost:1945/login/siswa) | `siswa` | Access to homework, KBM materials, schedules, CBT, and report cards. |
| **Parent Portal** | [http://localhost:1945/login/orang-tua](http://localhost:1945/login/orang-tua) | `orang_tua` | Read-only access to view child's grades, attendance, and unpaid school bills. |
| **Teacher & Staff Portal** | [http://localhost:1945/login/guru](http://localhost:1945/login/guru) | `guru`, `walikelas`, `kepala_sekolah`, `kurikulum` | Shared portal for grading, scheduling, and attendance logging. |
| **Finance Portal** | [http://localhost:1945/bendahara](http://localhost:1945/bendahara) | `bendahara` | Invoicing panel, transaction entry, and financial statistics. |
| **Administrator Portal** | [http://localhost:1945/adminlogin](http://localhost:1945/adminlogin) | `superadmin`, `admin` | Configuration settings, dynamic RBAC, user creation, and audit trails. |
| **RFID Tap Attendance Terminal** | [http://localhost:1945/tap/absensi](http://localhost:1945/tap/absensi) | *Public Terminal* | Unlocks with PIN: **`123456`**. Used for student attendance taps. |
| **RFID Tap Payment Terminal** | [http://localhost:1945/tap/pembayaran](http://localhost:1945/tap/pembayaran) | *Public Terminal* | Unlocks with PIN: **`123456`**. Used for instant school fee tap payments. |

---

## 2. DEMO USER CREDENTIALS MATRIX

All demo accounts share the same default password: **`1234`**

| No | Full Name | Username | Email | Role (Role Code) | NIP / NISN | Rombel / Association |
|----|-----------|----------|-------|------------------|------------|----------------------|
| 1  | Admin SMAS Muh 1 | `admin` | `admin@sit.sch.id` | `superadmin` | `197501012000031001` | Super administrator (all portals) |
| 2  | Rina Fitriani, S.Pd | `rina` | `rina.guru@sit.sch.id` | `guru` | `198205122008012004` | Mathematics Teacher |
| 3  | Ahmad Fauzi, S.Pd | `ahmad` | `ahmad.wali@sit.sch.id` | `walikelas` | `198001012005011002` | Advisor for Class **X-1** |
| 4  | Drs. H. Sugeng, M.Pd | `sugeng` | `sugeng.kepsek@sit.sch.id` | `kepala_sekolah` | `196504121990031001` | School Principal |
| 5  | Dewi Sartika, S.Pd | `dewi` | `dewi.kuri@sit.sch.id` | `kurikulum` | `198512102010012003` | Vice Principal of Curriculum |
| 6  | Siti Nurhaliza, S.E | `siti` | `siti.bendahara@sit.sch.id` | `bendahara` | `199009092015082001` | School Treasurer |
| 7  | Agus Setiawan | `agus` | `agus.siswa@sit.sch.id` | `siswa` | `0081234501` | Class X-1, RFID UID: `RF:AB:12:CD:34` |
| 8  | Budi Santoso | `budi` | `budi.siswa@sit.sch.id` | `siswa` | `0081234502` | Class X-1, RFID UID: `RF:EF:56:GH:78` |
| 9  | Bapak Joko Setiawan | `joko` | `joko.ortu@sit.sch.id` | `orang_tua` | `ORTU-0081234501` | Parent of student **Agus Setiawan** |
| 10 | Bapak Slamet Santoso | `slamet` | `slamet.ortu@sit.sch.id` | `orang_tua` | `ORTU-0081234502` | Parent of student **Budi Santoso** |

---

## 3. ROLE-BASED ACCESS CONTROL (RBAC) MATRIX

Backend endpoints check credentials utilizing the `CheckRole` middleware. The matrix below defines the access limits:

| Dashboard Route / Endpoint | superadmin | admin | guru | walikelas | kurikulum | kepala_sekolah | bendahara | siswa | orang_tua |
|----------------------------|:----------:|:-----:|:----:|:---------:|:---------:|:--------------:|:---------:|:-----:|:---------:|
| `/panel` (Admin Main Dashboard) | **Yes** | **Yes** | No | No | No | No | No | No | No |
| `/panel/users/*` (User CRUD) | **Yes** | **Yes** | No | No | No | No | No | No | No |
| `/panel/guru` (Guru Dashboard) | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | No | No | No |
| `/panel/guru/wali-siswa` (BK / Roster) | No | No | No | **Yes** (Advisor) | No | No | No | No | No |
| `/panel/guru/kepsek` (Principal View) | No | No | No | No | No | **Yes** | No | No | No |
| `/panel/guru/kurikulum` (Curriculum View) | No | No | No | No | **Yes** | No | No | No | No |
| `/panel/bendahara` (Financial Dashboard) | No | No | No | No | No | No | **Yes** | No | No |
| `/panel/siswa` (Student Dashboard) | No | No | No | No | No | No | No | **Yes** | **Yes** (Child) |
| `/panel/siswa/pembayaran` (Pay SPP View) | No | No | No | No | No | No | No | **Yes** | **Yes** (Child) |
| `/panel/siswa/cbt` (Exam Bilik) | No | No | No | No | No | No | No | **Yes** | **Yes** (Read Only)* |

*\*Note: Parents (`orang_tua`) accessing the student CBT panel can view past exams but are prevented from starting new exams or submitting answers.*

---

## 4. DETAILED USER FLOWS FOR TESTSPRITE AUTOMATION

### Flow 1: Administrator User Management Flow
- **Goal**: Authenticate as administrator and register a new student user.
- **Steps**:
  1. Open `http://localhost:1945/adminlogin`.
  2. Input Username: `admin`, Password: `1234`, click **Masuk Portal Admin**.
  3. Navigate to **Akademik -> Manajemen User** on the sidebar.
  4. Click **Tambah User** (User Form).
  5. Fill in the form: Name: `Test Student`, Username: `teststudent`, Email: `test@sit.sch.id`, Role: `siswa`, Class: `X-1`, NISN: `0081234599`.
  6. Click **Simpan**.
  7. Confirm the user is added to the table list.
  8. Log out.

### Flow 2: Student KBM & Assignment Submission Flow
- **Goal**: Student logs in, reviews math material, and submits homework.
- **Steps**:
  1. Open `http://localhost:1945/login/siswa`.
  2. Input Username: `agus`, Password: `1234`, click **Masuk Portal Siswa**.
  3. Confirm redirect to `/panel/siswa`.
  4. Click **Materi** in the sidebar. Select **Logaritma Dasar dan Sifat-sifatnya**. Verify description is readable.
  5. Click **Tugas** in the sidebar. Select **Latihan Soal Logaritma**.
  6. Click **Unggah Jawaban** (Submit Homework).
  7. Write note: `Sudah dikerjakan pak.` and select a mock PDF file, click **Kirim**.
  8. Verify the submission status changes to "Submitted/Menunggu Penilaian".
  9. Log out.

### Flow 3: Teacher Grading & Presensi Flow
- **Goal**: Teacher grades student submissions and logs class presence.
- **Steps**:
  1. Open `http://localhost:1945/login/guru`.
  2. Input Username: `rina`, Password: `1234`, click **Masuk Portal Guru**.
  3. Go to **LMS -> Tugas Siswa** on the sidebar.
  4. Select **Latihan Soal Logaritma** and view student submission.
  5. Select **Agus Setiawan**, review the submission, input Grade: `95` and Feedback: `Kerja bagus!`. Click **Simpan Nilai**.
  6. Go to **KBM -> Presensi / Jurnal** in the sidebar.
  7. Select Class: `X-1`, Subject: `Matematika Wajib`.
  8. Update attendance status for Agus Setiawan to `Hadir` and Budi Santoso to `Terlambat`. Click **Simpan Jurnal**.
  9. Log out.

### Flow 4: Wali Kelas E-Rapor Generation Flow
- **Goal**: Class advisor reviews Romble, inserts Ekskul grade, and publishes final reports.
- **Steps**:
  1. Open `http://localhost:1945/login/guru`.
  2. Input Username: `ahmad` (Wali Kelas X-1), Password: `1234`, click **Masuk**.
  3. Go to **Wali Kelas -> Catatan Akademik** on the sidebar.
  4. Select **Agus Setiawan**. Input Extracurricular: `Pramuka` with Grade: `A` (Sangat Baik).
  5. In **Catatan Wali Kelas**, write: `Prestasi akademik sangat baik, terus tingkatkan.`. Click **Simpan**.
  6. Go to **Cetak Rapor**. Select Class X-1. Click **Publish Rapor** next to Agus's name.
  7. Verify the status changes to "Published".
  8. Log out.

### Flow 5: Financial Invoicing & Payment Entry Flow
- **Goal**: Treasurer issues monthly bills and logs a manual payment.
- **Steps**:
  1. Open `http://localhost:1945/bendahara`.
  2. Input Username: `siti`, Password: `1234`, click **Masuk Portal Bendahara**.
  3. Go to **Keuangan -> Buat Tagihan** on the sidebar.
  4. Set Title: `SPP Agustus 2026`, Type: `SPP Bulanan`, Amount: `250000`. Click **Buat Tagihan Masal** (creates invoices for all students).
  5. Go to **Transaksi Pembayaran**. Click **Input Pembayaran**.
  6. Search Student: `Budi Santoso`. select invoice `SPP Juli 2026` (Outstanding: 250000).
  7. Select Method: `Cash/Tunai`, input amount: `250000`, click **Proses Pembayaran**.
  8. Confirm the transaction is listed in the history table and the invoice status changes to `Lunas`.
  9. Log out.

### Flow 6: Parent Student-Monitoring Flow
- **Goal**: Parent logs in to check their child's scores and payment records.
- **Steps**:
  1. Open `http://localhost:1945/login/orang-tua`.
  2. Input Username: `joko` (Parent of Agus), Password: `1234`, click **Masuk**.
  3. Verify redirect to `/panel/siswa`. Check header: it should display parent access mode viewing student profile **Agus Setiawan**.
  4. Go to **Absensi** -> check attendance logs (confirm `Hadir` logs are correct).
  5. Go to **Tugas** -> confirm mathematics assignment grade is shown as `95` with teacher's feedback.
  6. Go to **Pembayaran** -> confirm invoice status: `SPP Juli 2026` is `Lunas` (paid).
  7. Go to **Rapor** -> verify report card is ready for download.
  8. Click **Logout**.

### Flow 7: CBT Exam Session & Anti-Cheat Validation Flow
- **Goal**: Student takes an online test, triggers anti-cheat warnings, and submits.
- **Steps**:
  1. Open `http://localhost:1945/login/siswa`.
  2. Input Username: `agus`, Password: `1234`, click **Masuk**.
  3. Navigate to **Ujian CBT** in the sidebar.
  4. Select **Ulangan Harian Logaritma**, input Token: `LOG123`, click **Mulai Ujian**.
  5. Verify exam room enters full-screen lock mode.
  6. Answer Question 1 (Select Option B: `3`). Confirm "Jawaban Disimpan" indicator appears.
  7. **Simulate Tab-Switching** (trigger blur/visibilitychange event). Verify that a popup warning appears stating: "Kecurangan terdeteksi! Dilarang berpindah halaman!".
  8. Complete all questions, click **Selesai Ujian** -> confirm confirmation modal.
  9. Verify redirect back to CBT history page displaying exam completion status.
  10. Log out.

### Flow 8: Public RFID Tap Terminals Flow
- **Goal**: Simulate attendance logging and fast payments using RFID terminal.
- **Steps (Attendance)**:
  1. Open `http://localhost:1945/tap/absensi`.
  2. Input Unlock PIN: `123456`, click **Unlock**.
  3. Trigger card swipe (POST request with `uid: "RF:AB:12:CD:34"`).
  4. Verify terminal UI flashes: `Agus Setiawan (Kelas X-1) - Hadir (06:45:00)`.
- **Steps (Payment)**:
  1. Open `http://localhost:1945/tap/pembayaran`.
  2. Input Unlock PIN: `123456`, click **Unlock**.
  3. Swipe card (POST request with `uid: "RF:EF:56:GH:78"`).
  4. Verify terminal displays student profile `Budi Santoso` and lists outstanding invoices (SPP).
  5. Click **Tap Bayar** -> confirm success toast: `Pembayaran Berhasil!`.

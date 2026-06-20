## Product Requirements Document (PRD): Sistem Informasi Rapor IB-MYP

### 1. Deskripsi Produk

Aplikasi berbasis web untuk mengelola, menghitung, dan mencetak rapor sekolah dengan standar kurikulum International Baccalaureate Middle Years Programme (IB-MYP). Aplikasi ini akan menggantikan proses manual menjadi sistem terpusat yang otomatis mengkalkulasi batas nilai (grade boundaries) dan menghasilkan dokumen pdf sesuai format resmi sekolah.

### 2. Logika Bisnis & Aturan Penilaian

AI agent harus mengimplementasikan logika penilaian mutlak berikut ke dalam *controller* atau *service layer*:

**Komponen Nilai:** Setiap mata pelajaran dinilai berdasarkan empat kriteria, yaitu Kriteria A, B, C, dan D. (lihat contoh_rapor.pdf)
 
**Poin Kriteria:** Setiap kriteria (A/B/C/D) diberi skor dari 0 hingga 8. (lihat contoh_rapor.pdf)

**Total Skor:** Total skor per mata pelajaran didapat dari penjumlahan Kriteria A + B + C + D, dengan nilai maksimal 32 poin. (lihat contoh_rapor.pdf)
 
**Syarat Penilaian:** Jika sebuah mata pelajaran belum menilai keempat kriteria tersebut pada semester berjalan, maka *Final Grade* tidak dapat diberikan. (lihat contoh_rapor.pdf)

* **Konversi *Final Grade* (MYP Grade Boundaries):** Total skor (0-32) harus dikonversi secara otomatis menjadi *Final Grade* (1-7) menggunakan rentang berikut:
    * Skor 0-5 = Grade 1 (lihat contoh_rapor.pdf)
    * Skor 6-9 = Grade 2 (lihat contoh_rapor.pdf)
    * Skor 10-14 = Grade 3 (lihat contoh_rapor.pdf)
    * Skor 15-18 = Grade 4 (lihat contoh_rapor.pdf)
    * Skor 19-23 = Grade 5 (lihat contoh_rapor.pdf)
    * Skor 24-27 = Grade 6 (lihat contoh_rapor.pdf)
    * Skor 28-32 = Grade 7 (lihat contoh_rapor.pdf)

**Data Kehadiran:** Kategori kehadiran terdiri dari *Present* (Hadir), *Unexcused* (Alpa), *Sick* (Sakit), dan *Excused* (Izin). (lihat contoh_rapor.pdf)

### 3. Struktur Database (Schema Requirements)

*AI Agent Instruction: Create the following relational database tables with appropriate foreign keys.*

1. **Users:** Tabel untuk autentikasi (Admin, Guru Homeroom, Guru Mata Pelajaran).
2. **Students:** Data siswa (ID Siswa/NIS, Nama Lengkap, Kelas).
3. **Subjects:** Data mata pelajaran (Nama Pelajaran, Kategori MYP).
4. **Criteria_Descriptors:** Tabel penyimpan teks deskripsi capaian pembelajaran untuk setiap Kriteria A/B/C/D per mata pelajaran.
5. **Grades:** Tabel nilai transaksional. Kolom wajib: `student_id`, `subject_id`, `semester`, `academic_year`, `score_a`, `score_b`, `score_c`, `score_d`, `total_score` (auto-calculated), `final_grade` (auto-calculated), `local_grade` (misal: C).
6. **Attendances:** Rekap kehadiran per siswa per semester. Kolom: `present_count`, `unexcused_count`, `sick_count`, `excused_count`.
7. **Homeroom_Comments:** Catatan wali kelas (Homeroom Teacher) yang mencakup refleksi atribut *IB Learner Profile* per siswa per semester. (lihat contoh_rapor.pdf)

### 4. Detail Menu dan Fitur UI/UX

*Build the admin dashboard with the following navigation menu and features.*

#### A. Menu Master Data (Data Induk)

**Siswa:** 
    *Data Siswa:* Fitur CRUD (Create, Read, Update, Delete) untuk daftar siswa.
    *Naik Kelas:* Fitur untuk proses kenaikan kelas dan kelulusan jika keklas 9 atau akhir
    *Alumni:* Untuk menyimpan data alumni
**Data Guru:** Fitur CRUD untuk menambah akun guru beserta penetapan *role* (Homeroom atau Subject Teacher).
**Data Kelas:** Untuk mengatur data kelas
**Data Mata Pelajaran:** Fitur CRUD untuk daftar mata pelajaran.
**Setup Deskriptor Kriteria:** Form untuk memasukkan teks deskripsi (Capaian) untuk Kriteria A, B, C, dan D pada masing-masing mata pelajaran. Ini akan muncul di halaman spesifik mata pelajaran di rapor.

#### B. Menu Akademik & Input

**Input Nilai (Grades):**
    * Tampilan berupa tabel grid matriks (seperti spreadsheet).
    * Filter: Pilih Tahun Ajaran, Semester, dan Mata Pelajaran.
    * Input Fields: Kolom untuk menginput angka (0-8) untuk Kriteria A, B, C, D.
    * *Real-time Feedback:* Saat angka diinput, kolom Total dan Final Grade (1-7) otomatis terisi tanpa perlu *refresh* halaman.

**Input Kehadiran & Catatan Homeroom:**
    * Formulir bagi Wali Kelas untuk memasukkan jumlah hari *Present*, *Sick*, *Excused*, *Unexcused*.
    * Text area (mendukung *Rich Text*) untuk memasukkan deskripsi perkembangan siswa yang terintegrasi dengan atribut *IB Learner Profile*. (lihat contoh_rapor.pdf)

#### C. Menu Laporan (Report Generation)

**Cetak Rapor:**
    * Tombol "Generate lihat contoh_rapor.pdf" untuk setiap siswa.
    * Hasil lihat contoh_rapor.pdf harus memuat penomoran halaman dinamis. (lihat contoh_rapor.pdf)
**Pengaturan Cetak:** Untuk mngatur hasil cetak rapor
**Atur Cover:** Untuk mengatur cover rapor

#### D. Menu Pengaturan
**Profil Sekolah:** utnuk mengatur profil lembaga atau sekolah
**Tahun Pelajaran:** Untuk mengatur tahun pelajaran dan semester aktif
**Kelola User**
    *Administrator:* Fitur CRUD (Create, Read, Update, Delete) untuk mengelola akun administrator
    *Guru:* Fitur untuk mengelola akun guru dan reset password jika ada yang lupa password
    *Siswa:* Fitur untuk mengelola akun siswa dan reset password jika ada yang lupa password

### 5. Panduan Layout Output pdf

*The generated pdf MUST strictly follow this multi-page layout.*

* **Halaman 1 (Cover Letter):** Kop surat berlogo , surat pengantar, tanda tangan Kepala Sekolah dan Koordinator MYP , serta identitas siswa di *footer*. (lihat contoh_rapor.pdf)

* **Halaman 2 (Guidelines):** Berisi tabel statis penjelasan *Assessment Criterias* dan tabel *Attendance Label*. (lihat contoh_rapor.pdf)

* **Halaman 3 (Progress Summary):** * Tabel rekap nilai semua mata pelajaran. Header tabel: Mata Pelajaran, A, B, C, D, Final Grade. (lihat contoh_rapor.pdf)
    * Kolom *Homeroom Teacher Comment* di bagian bawah. (lihat contoh_rapor.pdf)
    * Tabel *Attendance* dengan format 4 kolom (Present, Unexcused, Sick, Excused) beserta jumlah angkanya. (lihat contoh_rapor.pdf)

* **Halaman 4 dan Seterusnya (Subject Pages):** * Mengulang format ini untuk setiap mata pelajaran secara dinamis.
    * Memuat nama pelajaran, tabel Kriteria A/B/C/D beserta teks penjabarannya, dan total skor. (lihat contoh_rapor.pdf)
    * Menampilkan blok rekapitulasi nilai akhir (Final Grade, Local Grade) dan keterangan Boundary Guidelines di bagian bawah. (lihat contoh_rapor.pdf)

* **Halaman Terakhir (Lampiran):** Menampilkan gambar/infografis *IB Learner Profile* secara statis. (lihat contoh_rapor.pdf)
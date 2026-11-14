# 🧒 ESSA Kids Therapy
### Sistem Operasional & Pendaftaran Klinik Tumbuh Kembang Anak (Interactive Prototype)

[![Live Preview](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://essakidstheraphy.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Architecture-Desktop--First%20%7C%20Vanilla%20ES6%20%7C%20Alpine.js-blue?style=for-the-badge)](https://essakidstheraphy.vercel.app)
[![Prototype Status](https://img.shields.io/badge/Status-Interactive%20Prototype%20(Client--Ready)-emerald?style=for-the-badge)](https://essakidstheraphy.vercel.app)

---

## 📌 1. Ringkasan Proyek (Executive Summary)

**ESSA Kids Therapy** adalah sistem terpadu operasional klinik tumbuh kembang anak yang dirancang untuk menjawab tantangan tata kelola klinik modern. Sistem ini mengintegrasikan seluruh alur layanan mulai dari registrasi anak, manajemen kuota paket terapi bertingkat (*tiered sessions*), sistem penjadwalan anti-bentrok secara *real-time*, hingga pencatatan rekam evaluasi perkembangan sesi oleh para terapis.

> 🌐 **Akses Live Preview Prototype:**  
> 👉 **[https://essakidstheraphy.vercel.app](https://essakidstheraphy.vercel.app)**  
> *(Dapat dibuka langsung melalui browser Laptop/PC maupun Tablet & Smartphone)*

### 🎯 4 Pilar Layanan Terapi Spesialisasi
Sistem telah disesuaikan dengan nomenklatur klinis resmi tumbuh kembang anak:

| Layanan Terapi | Nama Resmi | Kode Domain | Warna Identitas | Deskripsi Penanganan |
| :--- | :--- | :---: | :---: | :--- |
| **Fisioterapi** | Physiotherapy | `PHYSIO` | 🔵 Sky Blue | Stimulasi motorik kasar, keseimbangan tubuh, dan koordinasi fisik |
| **Sensori Integrasi** | Sensory Integration | `SENSORY` | 🟣 Violet | Pengolahan stimulasi sensorik (taktil, vestibular, proprioseptif) |
| **Terapi Wicara** | Speech Therapy | `SPEECH` | 🟡 Amber | Artikulasi fonem, keterlambatan bicara (*speech delay*), & komunikasi |
| **Terapi Okupasi** | Occupational Therapy | `OCCUPATIONAL` | 🟢 Emerald | Motorik halus, kemandirian aktivitas harian (ADL), & fokus atensi |

---

## 🧭 2. Panduan Cepat Pengujian untuk Klien (End-to-End Walkthrough)

Dokumen ini disusun sebagai skenario pengujian nyata (*User Journey*) agar **Pemilik/Manajemen Klinik** dapat mengevaluasi efektivitas alur kerja sistem prototype secara interaktif:

```
[ Pendaftaran & Paket ] ➡️ [ Jadwal Anti-Bentrok ] ➡️ [ Check-In Hadir ] ➡️ [ Pengisian Evaluasi ] ➡️ [ Rekam Medis Anak ]
    (Resepsionis)               (Front Office)          (-1 Kuota Sesi)            (Terapis)               (Tersinkronisasi)
```

---

### 🏢 Langkah 1: Eksplorasi Portal Admin & Resepsionis

Buka menu [Portal Admin](https://essakidstheraphy.vercel.app/pages/admin/dashboard.html) untuk menguji tugas harian tim *Front Office*:

#### 1.1. Dashboard Operasional (`/pages/admin/dashboard`)
* **Metrik Utama:** Pantau metrik ringkasan harian (Total Pasien, Jadwal Hari Ini, Sesi Terlaksana, dan Peringatan Kuota Menipis $\le 2$ sesi).
* **Tabel Antrean Hari Ini:** Lihat daftar sesi berjalan. Anda dapat menyaring tabel per layanan terapi (*Fisioterapi*, *Sensori Integrasi*, *Terapi Wicara*, *Terapi Okupasi*).
* **Check-In Otomatis:** Klik tombol **`Check-In Hadir`** pada pasien anak yang berstatus terjadwal. Perhatikan bahwa sisa kuota sesi pasien akan **otomatis terpotong 1 sesi**.

#### 1.2. Pendaftaran Pasien Baru (`/pages/admin/patients`)
* Klik tombol **`+ Daftarkan Pasien Baru`** di pojok kanan atas.
* Isi data profil anak (Nama lengkap, nama panggilan, tanggal lahir, nama wali, nomor WhatsApp, catatan diagnosa awal) serta paket kuota perdananya.
* Data akan langsung tersimpan di tabel pasien tanpa perlu me-refresh halaman.

#### 1.3. Manajemen Tenaga Ahli Terapis (`/pages/admin/therapists`)
* Lihat daftar terapis beserta spesialisasi layanan, kontak WhatsApp, dan statistik beban sesi aktif vs evaluasi yang telah diselesaikan.
* Klik tombol **`Tambah Terapis Baru`** untuk mencoba simulasi rekrutmen terapis baru.

#### 1.4. Pemantauan & Top-Up Kuota Sesi (`/pages/admin/packages`)
* Amati indikator visual kesehatan kuota: **Aman (Hijau)**, **Hampir Habis (Kuning)**, dan **Habis (Merah)**.
* Klik tombol **`Perpanjang Kuota (Top-Up)`** pada kartu paket pasien untuk menambah 4, 8, atau 12 sesi tambahan.

#### 1.5. Penjadwalan Sesi & Radar Anti-Bentrok (`/pages/admin/schedules`)
* Klik tombol **`+ Buat Jadwal Baru`**.
* Pilih tanggal, slot jam, pasien anak, ruangan klinik, dan terapis yang bertugas.
* **Fitur Radar Anti-Bentrok:** Coba pilih jam, terapis, atau ruangan yang sama dengan sesi lain. Sistem akan otomatis memunculkan **peringatan merah (*Conflict Warning*)** dan mengunci tombol simpan untuk mencegah jadwal ganda.

---

### 🩺 Langkah 2: Eksplorasi Portal Terapis

Buka menu [Portal Terapis](https://essakidstheraphy.vercel.app/pages/therapist/daily-schedule.html) (atau klik pintasan **`Portal Terapis`** di pojok bawah sidebar):

#### 2.1. Simulasi Ganti Akun Terapis
* Pada sisi kanan atas (Top Navbar), terdapat dropdown **`Simulasi Terapis`**.
* Pilih terapis berbeda (contoh: *Kak Nadia - Sensori Integrasi*, *Kak Bima - Terapi Wicara*, atau *Kak Dinda - Terapi Okupasi*).
* Seluruh metrik tugas dan daftar sesi harian akan langsung berganti sesuai akun terapis yang dipilih.

#### 2.2. Pelaksanaan Sesi Terapi (`/pages/therapist/daily-schedule`)
* Pasien yang telah di-*Check-In* oleh resepsionis akan menampilkan tombol biru **`Isi Catatan Evaluasi Sesi`**.
* Terapis juga dapat membantu pasien melakukan check-in mandiri melalui tombol **`Bantu Check-In`** jika resepsionis sedang berhalangan.

#### 2.3. Pengisian Lembar Evaluasi Sesi (`/pages/therapist/session-evaluation`)
* Tampilan terbagi menjadi **2 Kolom (Split-View)**:
  * **Kolom Kiri (1/3):** Pemilih sesi pasien, ringkasan profil anak, kontak wali, dan riwayat catatan dari sesi-sesi terdahulu.
  * **Kolom Kanan (2/3):** Formulir evaluasi klinis sesi:
    1. **Mood & Kesiapan Anak:** Pilih tombol cepat (*Kooperatif & Ceria*, *Perlu Adaptasi Awal*, *Mudah Terdistraksi*, atau *Rewel / Tantrum*).
    2. **Aktivitas & Materi Terapi:** Contoh stimulasi sensorik, media kartu, atau latihan motorik.
    3. **Catatan Perkembangan & Respons Anak:** Capaian kontak mata, rentang konsentrasi, dll.
    4. **PR Stimulasi di Rumah (Untuk Orang Tua):** Rekomendasi aktivitas ringan di rumah agar orang tua ikut mendampingi terapi.
* Klik **`Simpan Evaluasi & Selesaikan Sesi`**. Status sesi otomatis berubah menjadi **Selesai (COMPLETED)**.

---

### 🔄 Langkah 3: Verifikasi Sinkronisasi Rekam Evaluasi di Admin

* Kembali ke **Portal Admin** $\rightarrow$ buka menu **Data Pasien Anak** (`/pages/admin/patients`).
* Klik tombol **`Detail & Evaluasi`** pada baris pasien yang baru saja Anda selesaikan sesinya.
* Catatan evaluasi, mood anak, nama terapis, dan rekomendasi PR yang diisi di portal terapis **langsung tersinkronisasi dan tampil di rekam data anak**.

---

## 💾 3. Catatan Penting Mengenai Mode Prototype (Simulasi Data)

Agar pengujian berjalan fleksibel tanpa hambatan instalasi database server yang rumit, prototype ini menggunakan arsitektur simulasi berbasis *Client-Side Persistence*:

* **Penyimpanan Lokal Browser (`LocalStorage`):**  
  Seluruh aksi yang Anda lakukan (mendaftarkan anak baru, memotong sesi kuota, menambah jadwal, hingga mengisi lembar evaluasi) langsung disimpan di memori lokal browser perangkat Anda. Data tidak akan hilang meskipun halaman di-refresh (*reload*).
* **Data Awal Otomatis (*Pre-loaded Seed Data*):**  
  Aplikasi secara otomatis menyediakan data sampel aktif saat pertama kali dibuka:
  * **3 Pasien Anak:** *Arkaiyan Putra Pratama (Arka)*, *Callysta Aurelia (Cally)*, *Kenzo Alfarizqi (Kenzo)*.
  * **4 Tenaga Terapis Spesialis:** Kak Nadia (Sensori), Kak Bima (Wicara), Kak Rini (Fisio), Kak Dinda (Okupasi).
  * **Paket Kuota Aktif:** Dengan variasi sisa kuota (Aman $\rightarrow$ Kritis).
  * **Jadwal Harian Otomatis:** Tanggal jadwal otomatis mengikuti tanggal hari ini secara dinamis (*real-time*).
* **Fitur Tombol "Reset Simulasi":**  
  Penguji bebas bereksperimen mengutak-atik, menghapus, atau menambahkan data. Jika Anda ingin mengembalikan seluruh data ke kondisi awal klinik yang bersih, cukup klik tombol **`Reset Simulasi`** dengan ikon putar balik di Top Navbar atas.

---

## 🛠️ 4. Ringkasan Arsitektur Teknis (Untuk Tim IT / Developer)

Prototype ini dibangun dengan prinsip **Clean Architecture & Framework-Agnostic Design**. Struktur kode dipisahkan dengan disiplin tinggi sehingga dapat langsung dipindahkan ke framework produksi (*Laravel*, *Next.js*, *Vue/Nuxt*, atau *NestJS*) tanpa perlu merombak logika bisnis.

### 🧱 Tech Stack
* **Markup & Struktur:** HTML5 Semantik
* **Styling & UI Kit:** [Tailwind CSS v3 CDN](https://tailwindcss.com/) + [DaisyUI v4](https://daisyui.com/) *(Theme: Emerald)*
* **Reactivity Engine:** [Alpine.js v3 CDN](https://alpinejs.dev/) *(Ringan, deklaratif, tanpa virtual DOM)*
* **Iconography:** [Lucide Icons](https://lucide.dev/)
* **Modularity:** Pure ES6 JavaScript Modules (`import` / `export` native)
* **Hosting Platform:** Vercel *(Mendukung Clean URLs)*

### 📂 Struktur Direktori Proyek

```text
essa-kids-therapy/
├── index.html                      # Landing Page & Role Switcher (Admin vs Terapis)
├── vercel.json                     # Konfigurasi Vercel Routing & Clean URLs
├── .gitignore                      # Proteksi file lokal Git
├── README.md                       # Dokumentasi resmi Interactive Prototype
│
├── pages/                          # LAYER 1: VIEWS & PAGES
│   ├── admin/                      # Portal Admin & Resepsionis (Desktop-First)
│   │   ├── dashboard.html          # Dashboard antrean & pengingat kuota
│   │   ├── patients.html           # Manajemen pasien & modal rekam evaluasi
│   │   ├── therapists.html         # Daftar & registrasi tenaga ahli terapis
│   │   ├── packages.html           # Monitoring kuota & modal perpanjangan (Top-Up)
│   │   └── schedules.html          # Kalender sesi & modal jadwal anti-bentrok
│   └── therapist/                  # Portal Tenaga Terapis (Desktop & Mobile Responsive)
│       ├── daily-schedule.html     # Kartu grid sesi harian terapis
│       └── session-evaluation.html # Split-view formulir catatan evaluasi sesi
│
├── components/layout/              # LAYER 2: MODULAR UI COMPONENTS
│   ├── admin-sidebar.js            # Collapsible Sidebar Admin (w-72 ke w-20)
│   ├── therapist-sidebar.js        # Collapsible Sidebar Terapis
│   ├── top-navbar.js               # Dynamic Navbar (Admin/Terapis switcher)
│   └── therapist-bottom-nav.js     # Adapter kompatibilitas navigasi
│
└── assets/                         # LAYER 3: CORE LOGIC & ASSETS
    ├── css/
    │   └── custom.css              # Reset styling badge DaisyUI & utility
    └── js/
        ├── app.js                  # Application bootstrapper & modular mounting
        ├── config/
        │   ├── constants.js        # Single Source of Truth (Services, Status, Rooms)
        │   ├── tailwind.config.js  # Runtime color branding token
        │   └── alpine-init.js      # Bootstrapper proteksi race-condition CDN Vercel
        ├── database/
        │   ├── storage-adapter.js  # Abstraksi Database (CRUD LocalStorage)
        │   └── seed-data.js        # Data generator tanggal dinamis
        ├── services/               # Pure Business Logic (API-Ready)
        │   ├── patient.service.js  # Logika validasi pasien
        │   ├── therapist.service.js# Logika data terapis
        │   ├── package.service.js  # Logika pemotongan & top-up kuota
        │   ├── schedule.service.js # Algoritma Radar Validasi Anti-Bentrok
        │   └── evaluation.service.js# Logika simpan catatan perkembangan
        ├── stores/
        │   └── clinic.store.js     # Centralized Reactive Store (Alpine.store)
        └── utils/
            ├── date-formatter.js   # Konversi tanggal Indonesia & hitung umur anak
            └── validator.js        # Validasi format input
```

### 🚀 Kesiapan Migrasi ke Tahap Produksi
Seluruh *business logic* di dalam folder `assets/js/services/` dirancang murni tanpa ketergantungan pada DOM (*DOM-agnostic*). Untuk menghubungkan aplikasi ini ke Backend API produksi (misal: RESTful API atau GraphQL):
1. Ganti pemanggilan `StorageAdapter` di `services/*.js` dengan `fetch()` atau `axios` ke endpoint backend.
2. Template HTML di `pages/` dapat langsung dikonversi menjadi Blade Views (*Laravel*), JSX (*React/Next.js*), atau Single File Components (*Vue*).
3. Logika validasi bentrok jadwal di `schedule.service.js` dapat di-*mirror* ke validator backend sebagai pengamanan ganda.

---

## 👤 Pengembang & Kontak

Aplikasi dan dokumentasi ini dikembangkan secara pribadi oleh **Daud Sutan Syah** (*Frontend Developer & Architect*).  
Untuk pertanyaan, diskusi penyesuaian fitur, maupun rencana migrasi sistem ke tahap produksi penuh, silakan menghubungi pengembang melalui profil GitHub:  
👉 **[@daudsutanssyah](https://github.com/daudsutanssyah)** | **[Repositori Proyek](https://github.com/daudsutanssyah/Essa-Kids-Therapy)**

> *Dibuat dengan dedikasi penuh untuk mendukung tumbuh kembang optimal anak-anak Indonesia.* 🌟

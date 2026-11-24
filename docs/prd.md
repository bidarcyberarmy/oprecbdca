# Product Requirements Document (PRD): Web Open Recruitment BDCA

## 1. Ringkasan Proyek
* **Nama Produk:** Portal Open Recruitment Bina Darma Cyber Army (BDCA)
* **Target Domain:** `oprec.bidarcyberarmy.org` (subdomain terpisah yang terhubung secara visual dengan situs utama `https://www.bidarcyberarmy.org/`)
* **Tujuan Utama:** Membangun *recruitment funnel* interaktif yang mengedukasi calon pendaftar mengenai profil organisasi, portofolio karya, pengurus, dan detail tugas tiap divisi sebelum mereka mengisi formulir pendaftaran. Sistem harus menyimpan data secara terstruktur, menyediakan fitur *export* data yang bersih bagi panitia, dan memberikan akses grup WhatsApp secara eksklusif setelah pendaftaran berhasil.
* **Target Pengguna:**
  1. **Calon Anggota (Publik):** Mahasiswa Universitas Bina Darma (mayoritas mengakses via perangkat mobile dari media sosial/grup pesan).
  2. **Panitia Oprec (Admin):** Pengurus BDCA yang memantau jumlah pendaftar, memfilter data per divisi, dan mengunduh rekap data untuk tahap seleksi.

---

## 2. Arsitektur & Rekomendasi Tech Stack
Gunakan arsitektur *full-stack* modern yang ringan, aman, dan siap di-deploy ke Vercel/Cloudflare:
* **Frontend & Backend API:** Next.js (App Router) + TypeScript + Tailwind CSS.
* **Database & Autentikasi:** Supabase (PostgreSQL + Row Level Security + Supabase Auth untuk halaman admin).
* **Export Data:** Library `xlsx` (SheetJS) untuk menghasilkan file Excel (`.xlsx`) dan `.csv` dengan pemformatan tipe data yang presisi.
* **Hosting:** Vercel dengan konfigurasi *custom domain* `oprec.bidarcyberarmy.org`.

---

## 3. Arah Desain & UI/UX
* **Identitas Visual:** Selaras dengan palet warna, logo, dan karakter `bidarcyberarmy.org`.
* **Gaya Visual:** Bersih, modern, terstruktur (*Swiss-inspired typography & grid*), memiliki ruang kosong (*whitespace*) yang proporsional, serta kontras teks yang tinggi agar nyaman dibaca. Hindari efek neon berlebihan, animasi berat, atau klise latar belakang "kode matrix" yang menurunkan keterbacaan.
* **Mobile-First:** Seluruh komponen navigasi, tab divisi, dan input formulir harus dioptimalkan untuk layar *smartphone* (minimum lebar 360px) sebelum skala desktop.

---

## 4. Arsitektur Konfigurasi Konten Modular
Pisahkan seluruh konten profil, portofolio, anggota, divisi, dan jadwal pendaftaran ke dalam satu file konfigurasi terpusat (`src/config/oprec.config.ts`) agar mudah diperbarui tanpa mengubah kode komponen UI.

```typescript
export interface Division {
  id: string;
  name: string;
  tagline: string;
  description: string;
  responsibilities: string[]; // Apa saja yang dikerjakan di divisi ini
  skillsAndTools: string[];   // Teknologi/skill yang akan dipelajari
  idealFor: string;           // Kriteria/minat mahasiswa yang cocok
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string; // Misal: "Web System", "CTF & Research", "Campus Event"
  year: string;
  summary: string;
  imageUrl?: string;
  link?: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  role: string;     // Misal: "Ketua Umum", "Ketua Divisi Software Engineering"
  division: string;
  photoUrl: string;
}

export interface OprecConfig {
  isOpen: boolean;
  periodLabel: string;        // Misal: "Batch 2026/2027"
  registrationDeadline: string;
  closedMessage: string;
  about: {
    headline: string;
    description: string;
    pillars: { title: string; detail: string }[];
  };
  divisions: Division[];
  portfolios: PortfolioItem[];
  members: MemberProfile[];
}
```

---

## 5. Spesifikasi Fungsional: Halaman Publik (`/`)

Halaman utama disusun secara berurutan sebagai *funnel* dari pengenalan hingga konversi pendaftaran:

### 5.1. Navigasi & Hero Section
* **Navbar Minimalis:** Logo BDCA, tautan cepat (*Tentang*, *Portofolio*, *Anggota*, *Divisi*), tautan kembali ke `bidarcyberarmy.org`, dan tombol CTA utama **"Daftar Sekarang"** (*smooth scroll* ke bagian formulir).
* **Hero Section:** Judul utama periode rekrutmen, subjudul singkat nilai jual bergabung dengan BDCA, status pendaftaran aktif (buka/tutup beserta tenggat waktu), dan tombol CTA.

### 5.2. Apa Itu BDCA (Tentang Organisasi)
* Penjelasan ringkas mengenai visi, fokus kegiatan (riset keamanan siber, pengembangan perangkat lunak, kompetisi, dan komunitas belajar), serta budaya kerja kolaboratif di Universitas Bina Darma.

### 5.3. Portofolio & Karya
* Menampilkan daftar proyek, sistem, riset, atau kegiatan yang telah dieksekusi oleh BDCA.
* Setiap kartu portofolio memuat judul, kategori, tahun, deskripsi singkat dampak/fungsi karya, dan gambar/tautan (jika ada).

### 5.4. Pengurus & Anggota Aktif
* Menampilkan profil pengurus inti dan koordinator divisi (foto, nama, jabatan/divisi) untuk membangun kedekatan dan transparansi struktur organisasi bagi calon pendaftar.

### 5.5. Eksplorasi Divisi (Interaktif)
* Menampilkan daftar divisi yang dibuka dalam format *Tab* atau *Accordion* interaktif agar tidak memakan ruang vertikal berlebihan di layar mobile.
* Setiap divisi wajib menampilkan empat informasi kunci:
  1. **Fokus Utama Divisi**
  2. **Tugas & Aktivitas Nyata** (*bullet points* kegiatan sehari-hari/proyek divisi)
  3. **Skill & Tools yang Dipelajari**
  4. **Cocok Untuk Siapa** (menegaskan bahwa pemula yang mau belajar tetap diterima)
* **Action Button:** Setiap tampilan detail divisi memiliki tombol **"Daftar ke Divisi [Nama Divisi]"**. Saat diklik, halaman otomatis melakukan *scroll* ke formulir pendaftaran dan langsung memilih divisi tersebut pada input pilihan divisi.

### 5.6. Formulir Pendaftaran
* Jika `isOpen` bernilai `false`, sembunyikan formulir dan tampilkan pesan penutupan pendaftaran beserta informasi kontak panitia.
* **Struktur Input Form:**

| Field | Tipe Input | Wajib | Aturan Validasi & Normalisasi |
| :--- | :--- | :---: | :--- |
| **Nama Lengkap** | Text | Ya | Minimal 3 karakter, trim spasi berlebih. |
| **NIM** | Text (Numeric) | Ya | Hanya angka (8–12 digit), disimpan sebagai string, wajib unik (tolak jika sudah terdaftar). |
| **Jurusan / Prodi** | Select / Text | Ya | Pilihan Prodi di Universitas Bina Darma (misal: Teknik Informatika, Sistem Informasi, dll.) + opsi lainnya. |
| **Nomor WhatsApp** | Tel | Ya | Validasi format nomor HP Indonesia, dinormalisasi ke awalan `628...` saat disimpan. |
| **Pilihan Divisi** | Radio Card / Select | Ya | Mengambil daftar dari `OprecConfig.divisions`. |
| **Pengalaman** | Textarea | Tidak | Diberi label *(Opsional)* serta keterangan bahwa belum memiliki pengalaman tetap boleh mendaftar. |
| **Riwayat Organisasi** | Textarea | Tidak | Diberi label *(Opsional)*. |

* **State Pengiriman:** Tombol submit menampilkan *loading indicator* dan dinonaktifkan selama proses pengiriman untuk mencegah *double-click submit*.

### 5.7. Konfirmasi Sukses & Onboarding Grup WhatsApp (Post-Submit)
* Setelah API mengembalikan status sukses (`201 Created`), komponen formulir digantikan oleh **Kartu Konfirmasi Pendaftaran**:
  * Menampilkan pesan ucapan terima kasih yang dipersonalisasi dengan nama pendaftar.
  * Menampilkan ringkasan data yang telah tercatat (Nama, NIM, Prodi, Divisi Pilihan) sebagai bukti pendaftaran.
  * Menampilkan instruksi langkah selanjutnya dan tombol utama **"Gabung Grup WhatsApp Calon Anggota"** (`target="_blank"`, `rel="noopener noreferrer"`).
* **Keamanan Link Grup WA:** URL undangan grup WhatsApp **tidak boleh** ditanam secara statis (*hardcoded*) di kode frontend. URL disimpan di *environment variable* server (`WHATSAPP_GROUP_INVITE_URL`) dan hanya dikirimkan dalam *response payload* API setelah data pendaftar berhasil tersimpan di database.

---

## 6. Spesifikasi Database & Keamanan Backend

### 6.1. Skema Tabel PostgreSQL (`registrations`)
```sql
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  nim TEXT NOT NULL UNIQUE,
  major TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  division TEXT NOT NULL,
  experience TEXT,
  organization TEXT
);

CREATE INDEX idx_registrations_division ON registrations(division);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
```

### 6.2. Row Level Security (RLS)
* Aktifkan RLS pada tabel `registrations`.
* **Kebijakan Publik (`anon`):** Tidak diberi akses `SELECT`, `UPDATE`, atau `DELETE` langsung. Proses `INSERT` dilakukan melalui Server Action / API Route (`/api/register`) menggunakan *Service Role Key* setelah melewati validasi server-side.
* **Kebijakan Admin (`authenticated`):** Hanya user panitia yang login melalui Supabase Auth yang memiliki izin `SELECT` untuk melihat dan mengekspor data.

### 6.3. Endpoint API Pendaftaran (`POST /api/register`)
1. Validasi seluruh *payload* menggunakan skema `Zod`.
2. Cek apakah `isOpen` pada konfigurasi masih aktif.
3. Normalisasi `nim` (hapus spasi) dan `whatsapp` (ubah awalan `08` atau `+628` menjadi `628`).
4. Cek apakah `nim` sudah ada di tabel `registrations`. Jika sudah ada, kembalikan status `409 Conflict` dengan pesan: *"NIM ini sudah terdaftar sebelumnya. Hubungi panitia jika terjadi kesalahan input."*
5. Simpan data ke database.
6. Kembalikan respons `201 Created` berisi ringkasan data tersimpan dan nilai `whatsappGroupUrl` dari `process.env.WHATSAPP_GROUP_INVITE_URL`.

---

## 7. Spesifikasi Fungsional: Dashboard Panitia (`/admin`)

Halaman tertutup bagi panitia untuk mengelola dan mengunduh data pendaftar:
1. **Autentikasi:** Halaman login (`/admin/login`) menggunakan email dan password panitia (Supabase Auth). Proteksi rute menggunakan Next.js Middleware.
2. **Ringkasan Statistik:** Kartu metrik yang menampilkan **Total Pendaftar** serta **Jumlah Pendaftar per Divisi**.
3. **Tabel Data Pendaftar:**
   * Kolom: Waktu Daftar, Nama Lengkap, NIM, Jurusan/Prodi, No. WhatsApp (tautan klik langsung ke `https://wa.me/628...`), Divisi Pilihan, Pengalaman, dan Organisasi.
   * Fitur **Pencarian** (berdasarkan Nama atau NIM) dan **Filter Dropdown** (berdasarkan Divisi).
   * Tampilan detail modal/drawer untuk membaca teks *Pengalaman* dan *Organisasi* yang panjang tanpa merusak lebar tabel.
4. **Fitur Export Data Rapi (`.xlsx` dan `.csv`):**
   * Tombol **"Export Excel (.xlsx)"** dan **"Export CSV"** (mendukung export seluruh data maupun export sesuai filter divisi yang sedang aktif).
   * **Standar Kerapian File Export:**
     * Nama file otomatis menyertakan tanggal dan filter, misal: `Oprec_BDCA_Semua_Divisi_2026-11-24.xlsx`.
     * Header kolom menggunakan bahasa manusia yang jelas: `No`, `Waktu Daftar (WIB)`, `Nama Lengkap`, `NIM`, `Jurusan / Prodi`, `No. WhatsApp`, `Divisi Pilihan`, `Pengalaman`, `Riwayat Organisasi`.
     * Kolom `NIM` dan `No. WhatsApp` diformat eksplisit sebagai tipe **Text/String** di dalam sheet `.xlsx` agar angka `0` di depan atau format digit panjang tidak berubah menjadi notasi ilmiah (`2.41E+08`) saat dibuka di Microsoft Excel.
     * Kolom kosong pada `Pengalaman` dan `Organisasi` otomatis diisi tanda `-` agar sel terlihat rapi.
     * Lebar kolom (*column width*) diatur otomatis menyesuaikan panjang karakter terpanjang di tiap kolom.

---

## 8. Environment Variables
Sediakan file `.env.example` dengan variabel berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
WHATSAPP_GROUP_INVITE_URL=https://chat.whatsapp.com/your_invite_code
```

---

## 9. Kriteria Penerimaan (Acceptance Criteria)
* [ ] Pengunjung dapat membaca informasi tentang BDCA, portofolio, pengurus, dan detail tugas tiap divisi dengan tata letak responsif di desktop maupun mobile.
* [ ] Klik tombol daftar pada kartu divisi melakukan *scroll* ke form dan otomatis memilih divisi terkait.
* [ ] Pendaftaran dengan NIM yang sama ditolak dengan pesan error yang jelas dan tidak menduplikasi data di database.
* [ ] Setelah form berhasil dikirim, pendaftar melihat ucapan terima kasih, ringkasan data, dan tombol aktif menuju grup WhatsApp.
* [ ] Link grup WhatsApp tidak terekspos di kode sumber publik sebelum form berhasil disubmit.
* [ ] Panitia dapat login ke `/admin`, memfilter pendaftar per divisi, dan mengunduh file `.xlsx` dengan struktur kolom rapi, timestamp WIB, serta NIM dan nomor WA yang terbaca utuh sebagai teks.
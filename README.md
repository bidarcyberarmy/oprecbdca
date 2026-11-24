# Portal Open Recruitment — Bina Darma Cyber Army (BDCA)

Website resmi Open Recruitment **Bina Darma Cyber Army (BDCA)** Universitas Bina Darma yang dirancang untuk di-deploy ke subdomain `oprec.bidarcyberarmy.org`.

## Fitur Utama
- **Halaman Publik (`/`):** Recruitment funnel responsif (mobile-first) dengan profil BDCA, eksplorasi divisi interaktif (Tab di desktop & Accordion di mobile) yang terhubung langsung ke form pendaftaran, serta pop-up konfirmasi ucapan terima kasih setelah pendaftaran berhasil (pendaftar akan dihubungi langsung oleh panitia via WhatsApp).
- **API Pendaftaran (`POST /api/register`):** Validasi server-side dengan `Zod`, normalisasi NIM & nomor WhatsApp (`628...`), pencegahan duplikasi NIM (`409 Conflict`), dan penyimpanan aman via Supabase Service Role Key.
- **Dashboard Panitia (`/admin`):** Diproteksi dengan Supabase Auth + Next.js Middleware, menampilkan statistik pendaftar total & per divisi, daftar mahasiswa pendaftar (nama, NIM, jurusan, nomor WhatsApp dengan tautan langsung untuk reminder, divisi, pengalaman, organisasi), pencarian & filter divisi, serta **Export Excel (`.xlsx`)** dan **Export CSV** dengan format teks eksplisit untuk NIM & WhatsApp.

---

## 1. Setup Database & RLS di Supabase

Buka **SQL Editor** di dashboard proyek Supabase Anda, lalu jalankan skrip berikut untuk membuat tabel `registrations`, indeks, dan kebijakan Row Level Security (RLS):

```sql
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  nim TEXT NOT NULL UNIQUE,
  major TEXT NOT NULL,
  semester TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  division TEXT NOT NULL,
  reason TEXT NOT NULL,
  experience TEXT,
  organization TEXT
);

CREATE INDEX idx_registrations_division ON registrations(division);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Publik (anon) tidak diberi akses SELECT/INSERT/UPDATE/DELETE langsung.
-- Proses INSERT dilakukan melalui /api/register menggunakan SUPABASE_SERVICE_ROLE_KEY.

-- Panitia yang login via Supabase Auth (authenticated) diizinkan membaca data
CREATE POLICY "Authenticated admins can view registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);
```

### Membuat Akun Panitia (Admin)
1. Buka menu **Authentication → Users** di dashboard Supabase.
2. Klik **Add user → Create new user** lalu masukkan email dan password panitia.
3. Akun tersebut digunakan untuk login di `/admin/login`.

---

## 2. Konfigurasi Environment Variables (`.env.local`)

Salin `.env.example` menjadi `.env.local` di root proyek, lalu isi nilainya:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Keamanan:** `SUPABASE_SERVICE_ROLE_KEY` hanya diakses di sisi server dan tidak pernah diekspos ke kode frontend.

### Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Akses aplikasi di `http://localhost:3000` dan dashboard panitia di `http://localhost:3000/admin`.

---

## 3. Mengubah Konten & Status Pendaftaran

Seluruh konten profil, portofolio, daftar pengurus, daftar divisi, jadwal deadline, hingga status buka/tutup pendaftaran dikelola terpusat di:

`src/config/oprec.config.ts`

- **Menutup pendaftaran:** Ubah `isOpen: false` dan sesuaikan `closedMessage`. Form pendaftaran akan otomatis disembunyikan dan endpoint `/api/register` akan menolak pengiriman baru (`403 Forbidden`).
- **Mengubah divisi / portofolio / pengurus:** Edit array `divisions`, `portfolios`, atau `members` pada `oprecConfig`. Untuk menambahkan foto pengurus, simpan gambar di `public/members/` lalu isi `photoUrl: "/members/nama-file.webp"`.

---

## 4. Deploy ke Vercel (`oprec.bidarcyberarmy.org`)

1. Push repository ini ke GitHub (misalnya organisasi `bidarcyberarmy`).
2. Buka [Vercel](https://vercel.com), klik **Add New → Project**, lalu import repository ini.
3. Pada bagian **Environment Variables**, tambahkan ketiga variabel dari `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy** dan tunggu hingga build selesai.
5. Buka **Settings → Domains** pada proyek Vercel, lalu tambahkan domain `oprec.bidarcyberarmy.org`.
6. Di penyedia DNS domain `bidarcyberarmy.org`, tambahkan **CNAME record**:
   - **Name / Host:** `oprec`
   - **Target / Value:** `cname.vercel-dns.com`
7. Setelah DNS terpropagasi, Vercel akan menerbitkan sertifikat SSL secara otomatis dan portal aktif di `https://oprec.bidarcyberarmy.org`.

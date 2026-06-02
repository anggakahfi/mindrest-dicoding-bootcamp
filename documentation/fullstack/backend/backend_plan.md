# Strategi Pengerjaan Backend — Angga (TweetMind)

## Keputusan yang Sudah Ditetapkan

| Keputusan | Pilihan |
|---|---|
| **Folder Structure** | Opsi A — Full Monorepo (sesuai `folder_structure.md`) |
| **Bahasa Backend** | TypeScript |
| **MongoDB Atlas** | Belum punya — perlu setup cluster baru |

---

## Situasi Saat Ini

| Aspek | Kondisi |
|---|---|
| **Repo** | Flat Next.js project, BUKAN monorepo sesuai `folder_structure.md` |
| **Frontend** | Sudah ada (Next.js + shadcn/ui), semua halaman sudah dibuat sebagai prototype statis |
| **Backend** | Belum ada sama sekali — 0% |
| **Dokumen pre-dev** | Baru 5 file overview. Belum ada **ERD** dan **API Contract** |
| **Mock data** | Ada di `lib/mock-data.ts` — bisa dijadikan acuan bentuk data |

---

## Fase 0: Dokumen yang HARUS Dibuat Sebelum Coding

> [!IMPORTANT]
> Dua dokumen ini adalah **prerequisite wajib** sebelum menulis baris kode backend manapun. Tanpa ini, kamu akan bolak-balik refactor karena struktur data dan kontrak API belum jelas.

### 0A. `documentation/erd.md` — Entity Relationship Diagram

Berdasarkan `mock-data.ts` dan `user_stories.md`, ada 3 koleksi MongoDB:

```
┌──────────────────┐
│      users       │
├──────────────────┤
│ _id              │
│ name             │
│ email (unique)   │
│ password (hash)  │
│ age              │
│ gender           │
│ createdAt        │
│ updatedAt        │
└────────┬─────────┘
         │ 1:N
         ▼
┌──────────────────┐
│   daily_checkins │
├──────────────────┤
│ _id              │
│ userId (ref)     │
│ journalText      │
│ checkinDate      │
│ createdAt        │
└────────┬─────────┘
         │ 1:1
         ▼
┌──────────────────┐
│   predictions    │
├──────────────────┤
│ _id              │
│ checkinId (ref)  │
│ stressLevel      │  ← enum: Rendah|Sedang|Tinggi
│ stressScore      │  ← float 0-1
│ recommendation   │
│ createdAt        │
└──────────────────┘
```

**Kenapa penting:** Ini menjadi cetak biru langsung untuk Mongoose schema. Tanpa ini kamu tidak tahu field apa saja yang dibutuhkan.

### 0B. `documentation/api_contract.md` — API Contract

Kontrak API yang mengikat antara Frontend ↔ Backend ↔ FastAPI. Didefinisikan berdasarkan `workload_allocation.md`:

| Method | Endpoint | Deskripsi | Auth? |
|---|---|---|---|
| `POST` | `/api/auth/register` | Daftar user baru | ❌ |
| `POST` | `/api/auth/login` | Login, return JWT | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |
| `POST` | `/api/checkins` | Simpan jurnal harian | ✅ |
| `GET` | `/api/checkins` | Ambil riwayat checkin user | ✅ |
| `POST` | `/api/predictions` | Kirim teks → forward ke FastAPI → simpan hasil | ✅ |
| `GET` | `/api/predictions` | Ambil riwayat prediksi user | ✅ |

Setiap endpoint perlu didefinisikan: **Request Body, Response Body (success + error), Status Codes**.

**Kenapa penting:** Frontend (Reynaldo) nantinya butuh kontrak ini untuk integrasi. Bahkan jika Reynaldo belum bisa dihubungi, dokumen ini jadi "perjanjian" yang sah.

---

## Fase 1: Restrukturisasi Folder — Full Monorepo (Opsi A)

> [!WARNING]
> Ini akan memindahkan **semua file Next.js ke folder `frontend/`**. Pastikan tidak ada proses dev server yang berjalan sebelum eksekusi.

### Struktur Target

```
capstone-dicoding/
├── frontend/                          # ← Next.js (dipindahkan dari root)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   ├── components.json
│   ├── next.config.mjs
│   ├── next-env.d.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── backend/                           # ← BARU: Node.js + Express (TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.model.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── checkin/
│   │   │   │   ├── checkin.controller.ts
│   │   │   │   ├── checkin.service.ts
│   │   │   │   ├── checkin.routes.ts
│   │   │   │   └── checkin.model.ts
│   │   │   └── prediction/
│   │   │       ├── prediction.controller.ts
│   │   │       ├── prediction.service.ts
│   │   │       ├── prediction.routes.ts
│   │   │       └── prediction.model.ts
│   │   ├── utils/
│   │   │   └── response.ts
│   │   └── app.ts
│   ├── server.ts
│   ├── tsconfig.json
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── ai-service/                        # ← Placeholder (urusan Deva & Marco)
│   └── README.md
│
├── data-science/                      # ← Placeholder (urusan Hayqal & Nathaniela)
│   └── README.md
│
├── documentation/                     # ← Dokumen tim (tetap di root)
│   ├── project_overview.md
│   ├── tech_stack.md
│   ├── user_stories.md
│   ├── workload_allocation.md
│   ├── folder_structure.md
│   ├── backend_plan.md
│   ├── erd.md                         # ← BARU (Fase 0A)
│   └── api_contract.md               # ← BARU (Fase 0B)
│
├── .gitignore
└── README.md
```

### Langkah Restrukturisasi

1. Buat folder `frontend/`
2. Pindahkan semua file/folder Next.js (`app/`, `components/`, `hooks/`, `lib/`, `public/`, `styles/`, `package.json`, dll) ke `frontend/`
3. Hapus `node_modules/` dan `.next/` dari root (akan di-reinstall di `frontend/`)
4. Buat folder `backend/` dengan struktur TypeScript
5. Buat folder `ai-service/` dan `data-science/` dengan `README.md` placeholder
6. Update `.gitignore` di root
7. Jalankan `pnpm install` di `frontend/` untuk reinstall dependencies

---

## Fase 2: Setup MongoDB Atlas

> [!IMPORTANT]
> MongoDB Atlas perlu di-setup sebelum mulai coding backend. Ini gratis untuk tier M0 (512 MB).

### Langkah Setup
1. Buka https://cloud.mongodb.com → buat akun / login
2. Create New Cluster → pilih **M0 Free Tier**
3. Pilih region terdekat (Singapore/Jakarta)
4. Buat Database User (username + password)
5. Whitelist IP: `0.0.0.0/0` (untuk development, nanti di-restrict untuk production)
6. Copy connection string → simpan di `.env` backend

---

## Fase 3: Eksekusi Backend (Urutan Pengerjaan)

### Step 1 — Project Setup
- `npm init -y` di folder `backend/`
- Install dependencies:
  - Production: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `express-validator`
  - Dev: `typescript`, `ts-node`, `tsx`, `nodemon`, `@types/express`, `@types/jsonwebtoken`, `@types/bcryptjs`, `@types/cors`
- Setup `tsconfig.json` untuk backend
- Buat `server.ts` (entry point) dan `src/app.ts` (Express setup)
- Buat `src/config/db.ts` (koneksi MongoDB Atlas)
- Buat `.env.example` dengan variabel: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `FASTAPI_URL`

### Step 2 — Middleware
- `auth.middleware.ts` — Verify JWT token dari header `Authorization: Bearer <token>`
- `error.middleware.ts` — Global error handler, format error response konsisten
- `validate.middleware.ts` — Wrapper untuk express-validator

### Step 3 — Modul Auth
- `auth.model.ts` — Mongoose schema `users` (name, email, password, age, gender)
- `auth.validation.ts` — Validasi register (email format, password min 8 char) & login
- `auth.service.ts` — Logic register (hash password, cek email unik) & login (compare password, generate JWT)
- `auth.controller.ts` — Handler HTTP request/response
- `auth.routes.ts` — Mount ke `/api/auth/*`

### Step 4 — Modul Check-in
- `checkin.model.ts` — Mongoose schema `daily_checkins` (userId, journalText, checkinDate)
- `checkin.service.ts` — CRUD logic (create checkin, get checkins by user, cek duplikat hari ini)
- `checkin.controller.ts` & `checkin.routes.ts`
- Mount ke `/api/checkins/*` dengan auth middleware

### Step 5 — Modul Prediction
- `prediction.model.ts` — Mongoose schema `predictions` (checkinId, stressLevel, stressScore, recommendation)
- `prediction.service.ts` — **Forward request ke FastAPI** (`POST ${FASTAPI_URL}/predict`), simpan response ke DB. Jika FastAPI belum tersedia → return **mock prediction** sebagai fallback
- `prediction.controller.ts` & `prediction.routes.ts`
- Mount ke `/api/predictions/*` dengan auth middleware

### Step 6 — CORS & Final Polish
- Konfigurasi CORS whitelist (frontend URL)
- Test semua endpoint dengan tool (Postman/Thunder Client)
- Tulis `README.md` backend (cara run lokal, env vars, endpoint list)

### Step 7 — Deploy ke Render.com
- Push kode backend
- Setup environment variables di Render dashboard
- Verifikasi semua endpoint berjalan di production

---

## Strategi untuk Workload Anggota Lain

| Anggota | Strategi |
|---|---|
| **Reynaldo** (Frontend) | Kode Next.js **dipindahkan** ke `frontend/` tanpa perubahan isi. Reynaldo tinggal `cd frontend && pnpm install && pnpm dev`. |
| **Deva** (FastAPI) | Folder `ai-service/` disiapkan dengan `README.md` placeholder. Di `prediction.service.ts`, buat **fallback mock** jika FastAPI belum up. |
| **Marco** (TF Model) | Tidak ada ketergantungan langsung. Model `.keras` akan dimuat oleh Deva. |
| **Hayqal & Nathaniela** (Data Science) | Folder `data-science/` disiapkan dengan `README.md` placeholder. |

> [!TIP]
> Kunci strategi: Backend kamu harus bisa **berdiri sendiri dan ditest** tanpa FastAPI. Gunakan mock response di `prediction.service.ts` yang mengembalikan data statis sesuai format di `mock-data.ts`. Ketika FastAPI Deva sudah ready, tinggal toggle ke real HTTP call.

---

## Verification Plan

### Automated Testing
- Test setiap endpoint menggunakan **Postman** atau **Thunder Client** di VS Code
- Validasi response body match dengan API Contract
- Test edge cases: email duplikat, password terlalu pendek, JWT expired, input kosong

### Manual Verification
- Register → Login → Create Checkin → Create Prediction flow end-to-end
- Verifikasi data tersimpan benar di MongoDB Atlas (cek via MongoDB Compass)
- Test CORS dari frontend origin
- Deploy ke Render.com → test semua endpoint di production URL

---

## Ringkasan Urutan Kerja

```
1. 📁 Restrukturisasi folder ke monorepo (frontend/, backend/, ai-service/, data-science/)
2. 📝 Buat ERD (documentation/erd.md)
3. 📝 Buat API Contract (documentation/api_contract.md)
4. 🗄️ Setup MongoDB Atlas (free tier M0)
5. 🔧 Setup project Express + TypeScript
6. 🔧 Buat middleware (auth, error, validate)
7. 🔧 Implementasi modul Auth
8. 🔧 Implementasi modul Check-in
9. 🔧 Implementasi modul Prediction (dengan mock FastAPI fallback)
10. 🔧 Konfigurasi CORS + polish
11. 🧪 Testing semua endpoint
12. 🚀 Deploy ke Render.com
13. 📝 Tulis README backend
```

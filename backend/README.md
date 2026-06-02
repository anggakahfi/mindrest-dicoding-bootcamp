# Backend API — TweetMind

> **PIC:** Angga

REST API utama aplikasi TweetMind menggunakan Node.js + Express + TypeScript.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT + bcrypt

## Cara Menjalankan

```bash
cd backend
npm install
cp .env.example .env    # Isi variabel sesuai kebutuhan
npm run dev              # Development (hot reload via tsx)
```

## Scripts

| Script | Keterangan |
|---|---|
| `npm run dev` | Development server dengan hot reload |
| `npm run build` | Compile TypeScript ke `dist/` |
| `npm start` | Jalankan production build |
| `npm run lint` | Type check tanpa emit |

## Environment Variables

| Variable | Keterangan | Contoh |
|---|---|---|
| `PORT` | Port server | `5000` |
| `MONGODB_URI` | Connection string MongoDB Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key untuk sign JWT | `random_string_here` |
| `JWT_EXPIRES_IN` | Masa berlaku JWT | `7d` |
| `FASTAPI_URL` | URL AI Service (FastAPI) | `http://localhost:8000` |

## Endpoints

### Health Check

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Status server |

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Daftar user baru |
| `POST` | `/api/auth/login` | ❌ | Login, return JWT |
| `GET` | `/api/auth/me` | ✅ | Profil user aktif |

### Check-in (`/api/checkins`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/checkins` | ✅ | Simpan jurnal harian (upsert per hari) |
| `GET` | `/api/checkins` | ✅ | Riwayat jurnal (paginated) |

**Query params GET:** `page` (default 1), `limit` (default 10, max 50)

### Predictions (`/api/predictions`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/predictions` | ✅ | Analisis stres untuk checkin tertentu |
| `GET` | `/api/predictions` | ✅ | Riwayat prediksi (paginated) |

**Query params GET:** `page`, `limit`, `days` (filter N hari terakhir untuk grafik)

### Format Response

Semua response menggunakan envelope pattern:

```json
{
  "success": true,
  "message": "Deskripsi",
  "data": { ... }
}
```

Untuk detail lengkap request/response body setiap endpoint, lihat [API Contract](../documentation/fullstack/api_contract.md).

## Struktur Folder

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              # Koneksi MongoDB
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── error.middleware.ts # Global error handler
│   │   └── validate.middleware.ts # express-validator wrapper
│   ├── modules/
│   │   ├── auth/              # Register, Login, Profile
│   │   ├── checkin/           # Jurnal harian CRUD
│   │   └── prediction/       # Prediksi stres + FastAPI integration
│   ├── utils/
│   │   └── response.ts       # Standardized response helpers
│   └── app.ts                # Express setup + routes mounting
├── server.ts                  # Entry point
├── tsconfig.json
├── .env.example
└── package.json
```

## Catatan

- **FastAPI Fallback:** Jika FastAPI belum tersedia, prediction endpoint mengembalikan mock data statis. Tidak ada error — user tetap mendapat hasil.
- **Password Security:** Password di-hash dengan bcrypt (12 salt rounds). Field `password` di-exclude dari semua query response secara default.
- **Upsert Checkin:** Jika user sudah checkin hari ini, data akan di-update (bukan duplikat). Response memberi tahu via field `isUpdated`.

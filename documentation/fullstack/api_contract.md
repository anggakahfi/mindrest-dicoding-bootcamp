# API Contract — MindRest

## Konvensi Umum

### Base URL

| Environment | URL |
|---|---|
| Development | `http://localhost:5000` |
| Production | `https://mindrest-api.onrender.com` (TBD) |

### Format Response (Envelope Pattern)

Semua response mengikuti format envelope yang konsisten:

**Success:**
```json
{
  "success": true,
  "message": "Deskripsi singkat",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Deskripsi error",
  "errors": [
    { "field": "email", "message": "Email sudah terdaftar" }
  ]
}
```

### Autentikasi

- Endpoint yang memerlukan auth menggunakan header `Authorization: Bearer <JWT_TOKEN>`
- JWT payload berisi: `{ userId: string, email: string }`
- Token berlaku selama `7 hari` (konfigurasi via `JWT_EXPIRES_IN`)
- Jika token tidak ada / invalid / expired, response: `401 Unauthorized`

### Content Type

- Request: `application/json`
- Response: `application/json`

---

## Ringkasan Endpoint

| Method | Endpoint | Deskripsi | Auth | User Story |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Daftar user baru | ❌ | US-01 |
| `POST` | `/api/auth/login` | Login, return JWT | ❌ | US-02 |
| `GET` | `/api/auth/me` | Profil user aktif | ✅ | US-02 |
| `POST` | `/api/checkins` | Simpan jurnal harian | ✅ | US-03, US-06 |
| `GET` | `/api/checkins` | Riwayat jurnal user | ✅ | US-07 |
| `POST` | `/api/predictions` | Analisis stres → simpan | ✅ | US-04, US-05 |
| `GET` | `/api/predictions` | Riwayat prediksi user | ✅ | US-07, US-08 |

---

## 1. Auth — Autentikasi

### `POST /api/auth/register`

Mendaftarkan user baru. Email harus unik, password minimal 8 karakter.

**Request Body:**

| Field | Type | Required | Constraint | Keterangan |
|---|---|---|---|---|
| `name` | `string` | ✅ | min: 1, max: 100 | Nama lengkap |
| `email` | `string` | ✅ | valid email format | Email unik |
| `password` | `string` | ✅ | min: 8, max: 128 | Plaintext (di-hash oleh server) |
| `age` | `number` | ✅ | min: 1, max: 150 | Umur |
| `gender` | `string` | ✅ | enum: `male`, `female` | Jenis kelamin |

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "_id": "665a1b2c3d4e5f6a7b8c9d0e",
      "name": "Angga Pratama",
      "email": "angga@email.com",
      "age": 22,
      "gender": "male",
      "createdAt": "2026-05-12T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response `400 Bad Request` (validasi gagal):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "password", "message": "Password minimal 8 karakter" }
  ]
}
```

**Response `409 Conflict` (email sudah terdaftar):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

### `POST /api/auth/login`

Login dengan email dan password. Mengembalikan JWT token.

**Request Body:**

| Field | Type | Required |
|---|---|---|
| `email` | `string` | ✅ |
| `password` | `string` | ✅ |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "_id": "665a1b2c3d4e5f6a7b8c9d0e",
      "name": "Angga Pratama",
      "email": "angga@email.com",
      "age": 22,
      "gender": "male"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response `401 Unauthorized` (kredensial salah):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

> **Catatan (US-02):** Pesan error bersifat **generik** — tidak membedakan apakah email tidak ditemukan atau password salah. Ini best practice keamanan untuk mencegah email enumeration.

---

### `GET /api/auth/me`

Mengambil profil user yang sedang login berdasarkan JWT.

**Headers:** `Authorization: Bearer <token>`

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "user": {
      "_id": "665a1b2c3d4e5f6a7b8c9d0e",
      "name": "Angga Pratama",
      "email": "angga@email.com",
      "age": 22,
      "gender": "male",
      "createdAt": "2026-05-12T00:00:00.000Z"
    }
  }
}
```

**Response `401 Unauthorized`:**
```json
{
  "success": false,
  "message": "Token tidak valid atau telah kedaluwarsa"
}
```

---

## 2. Check-in — Jurnal Harian

### `POST /api/checkins`

Menyimpan jurnal harian. Jika sudah ada checkin pada tanggal yang sama, data akan di-**update** (upsert).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

| Field | Type | Required | Constraint | Keterangan |
|---|---|---|---|---|
| `journalText` | `string` | ✅ | min: 10, max: 1000 | Isi jurnal teks bebas |

> **Catatan:** `checkinDate` otomatis diset oleh server ke tanggal hari ini (UTC). `userId` diambil dari JWT token.

**Response `201 Created` (checkin baru):**
```json
{
  "success": true,
  "message": "Jurnal berhasil disimpan",
  "data": {
    "checkin": {
      "_id": "665a2b3c4d5e6f7a8b9c0d1e",
      "userId": "665a1b2c3d4e5f6a7b8c9d0e",
      "journalText": "Hari ini saya merasa sangat tertekan karena deadline...",
      "checkinDate": "2026-05-12T00:00:00.000Z",
      "createdAt": "2026-05-12T10:30:00.000Z"
    },
    "isUpdated": false
  }
}
```

**Response `200 OK` (checkin diperbarui — sudah ada hari ini):**
```json
{
  "success": true,
  "message": "Jurnal hari ini berhasil diperbarui",
  "data": {
    "checkin": { ... },
    "isUpdated": true
  }
}
```

> **Catatan (US-06):** Field `isUpdated` memberi tahu frontend apakah data baru atau menimpa data lama, sehingga frontend bisa menampilkan konfirmasi yang sesuai.

**Response `400 Bad Request`:**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "journalText", "message": "Jurnal minimal 10 karakter" }
  ]
}
```

---

### `GET /api/checkins`

Mengambil daftar riwayat checkin milik user yang login. Diurutkan dari terbaru.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

| Param | Type | Default | Keterangan |
|---|---|---|---|
| `page` | `number` | `1` | Halaman ke-n |
| `limit` | `number` | `10` | Jumlah per halaman (max: 50) |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Riwayat jurnal berhasil diambil",
  "data": {
    "checkins": [
      {
        "_id": "665a2b3c4d5e6f7a8b9c0d1e",
        "journalText": "Hari ini saya merasa sangat tertekan...",
        "checkinDate": "2026-05-12T00:00:00.000Z",
        "createdAt": "2026-05-12T10:30:00.000Z",
        "prediction": {
          "stressLevel": "Tinggi",
          "stressScore": 0.87
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

> **Catatan (US-07):** Setiap checkin di-populate dengan `prediction` (hanya `stressLevel` dan `stressScore`) agar frontend bisa menampilkan label stres di halaman History tanpa request tambahan.

**Response `200 OK` (kosong):**
```json
{
  "success": true,
  "message": "Belum ada riwayat jurnal",
  "data": {
    "checkins": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

## 3. Predictions — Analisis Stres

### `POST /api/predictions`

Mengirim teks jurnal ke FastAPI untuk prediksi, menyimpan hasilnya ke database. Flow:

```
Frontend → Backend → FastAPI (/predict) → Backend (simpan) → Frontend
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

| Field | Type | Required | Constraint | Keterangan |
|---|---|---|---|---|
| `checkinId` | `string` | ✅ | valid ObjectId | ID checkin yang akan diprediksi |

> **Catatan:** Backend mengambil `journalText` dari checkin di database, lalu forward ke FastAPI. Frontend tidak perlu mengirim ulang teks jurnal.

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Prediksi berhasil",
  "data": {
    "prediction": {
      "_id": "665a3c4d5e6f7a8b9c0d1e2f",
      "checkinId": "665a2b3c4d5e6f7a8b9c0d1e",
      "userId": "665a1b2c3d4e5f6a7b8c9d0e",
      "stressLevel": "Tinggi",
      "stressScore": 0.87,
      "recommendation": "Coba luangkan 10 menit untuk pernapasan dalam sebelum tidur.",
      "createdAt": "2026-05-12T10:30:05.000Z"
    }
  }
}
```

**Response `404 Not Found` (checkin tidak ditemukan):**
```json
{
  "success": false,
  "message": "Checkin tidak ditemukan"
}
```

**Response `409 Conflict` (sudah ada prediksi untuk checkin ini):**
```json
{
  "success": false,
  "message": "Prediksi untuk checkin ini sudah ada",
  "data": {
    "existingPrediction": { ... }
  }
}
```

**Response `503 Service Unavailable` (FastAPI down — fallback aktif):**
```json
{
  "success": true,
  "message": "Prediksi menggunakan fallback (AI Service tidak tersedia)",
  "data": {
    "prediction": {
      "_id": "...",
      "stressLevel": "Sedang",
      "stressScore": 0.5,
      "recommendation": "Sempatkan istirahat sejenak dari layar dan tarik napas panjang selama beberapa menit.",
      "createdAt": "..."
    }
  }
}
```

> **Catatan (US-05):** Ketika FastAPI tidak tersedia, backend mengembalikan mock prediction dengan fallback statis. Response tetap `success: true` agar frontend tidak menampilkan error — user tetap mendapat hasil.

---

### `GET /api/predictions`

Mengambil daftar riwayat prediksi milik user yang login. Diurutkan dari terbaru.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

| Param | Type | Default | Keterangan |
|---|---|---|---|
| `page` | `number` | `1` | Halaman ke-n |
| `limit` | `number` | `10` | Jumlah per halaman (max: 50) |
| `days` | `number` | — | Jika diisi, ambil prediksi dalam N hari terakhir saja (untuk grafik) |

> **Catatan (US-08):** Parameter `days=7` digunakan frontend untuk mengambil data grafik 7 hari terakhir.

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Riwayat prediksi berhasil diambil",
  "data": {
    "predictions": [
      {
        "_id": "665a3c4d5e6f7a8b9c0d1e2f",
        "checkinId": "665a2b3c4d5e6f7a8b9c0d1e",
        "stressLevel": "Tinggi",
        "stressScore": 0.87,
        "recommendation": "Coba luangkan 10 menit untuk pernapasan dalam...",
        "createdAt": "2026-05-12T10:30:05.000Z",
        "checkin": {
          "journalText": "Hari ini saya merasa sangat tertekan...",
          "checkinDate": "2026-05-12T00:00:00.000Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 7,
      "totalPages": 1
    }
  }
}
```

---

## 4. Internal — Backend → FastAPI

Kontrak internal antara Backend Express dan FastAPI milik Deva. **Ini bukan public API.**

### `POST ${FASTAPI_URL}/predict`

**Request Body (dikirim oleh Backend):**
```json
{
  "text": "Hari ini saya merasa sangat tertekan karena deadline..."
}
```

**Expected Response (dari FastAPI):**
```json
{
  "stress_level": "Tinggi",
  "stress_score": 0.87,
  "recommendation": "Coba luangkan 10 menit untuk pernapasan dalam sebelum tidur."
}
```

> **Catatan:** Jika FastAPI tidak merespons dalam **5 detik** (timeout), Backend menggunakan fallback statis. Timeout ini sesuai US-04 acceptance criteria.

### `GET ${FASTAPI_URL}/health`

Health check endpoint. Backend bisa mengecek apakah FastAPI aktif sebelum mengirim prediksi.

**Expected Response:**
```json
{
  "status": "ok"
}
```

---

## Status Code Summary

| Code | Arti | Kapan Digunakan |
|---|---|---|
| `200` | OK | Request berhasil (GET, atau update checkin) |
| `201` | Created | Resource baru berhasil dibuat (register, checkin baru, prediction) |
| `400` | Bad Request | Validasi input gagal |
| `401` | Unauthorized | Token tidak ada / invalid / expired |
| `403` | Forbidden | User mencoba akses resource milik user lain |
| `404` | Not Found | Resource tidak ditemukan |
| `409` | Conflict | Duplikat (email sudah terdaftar, prediksi sudah ada) |
| `500` | Internal Server Error | Unexpected error di server |
| `503` | Service Unavailable | FastAPI down (tapi fallback aktif, response tetap 200 ke client) |

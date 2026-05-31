# Entity Relationship Diagram — MindRest

## Gambaran Umum

Database menggunakan **MongoDB Atlas** dengan **Mongoose** sebagai ODM.
Terdapat 3 koleksi utama dengan relasi referensial (bukan embedded) untuk menjaga fleksibilitas query.

---

## Diagram Relasi

```
┌───────────────────────────┐
│          users            │
├───────────────────────────┤
│ _id         : ObjectId    │  ← auto-generated
│ name        : String      │  required, trim
│ email       : String      │  required, unique, lowercase, trim
│ password    : String      │  required, minlength: 8 (sebelum hash)
│ age         : Number      │  required, min: 1, max: 150
│ gender      : String      │  required, enum: ["male", "female"]
│ createdAt   : Date        │  auto (timestamps)
│ updatedAt   : Date        │  auto (timestamps)
└─────────────┬─────────────┘
              │
              │ 1 : N
              ▼
┌───────────────────────────┐
│      daily_checkins       │
├───────────────────────────┤
│ _id         : ObjectId    │  ← auto-generated
│ userId      : ObjectId    │  required, ref → users, indexed
│ journalText : String      │  required, minlength: 10, maxlength: 1000
│ checkinDate : Date        │  required, indexed
│ createdAt   : Date        │  auto (timestamps)
│ updatedAt   : Date        │  auto (timestamps)
└─────────────┬─────────────┘
              │
              │ 1 : 1
              ▼
┌───────────────────────────┐
│       predictions         │
├───────────────────────────┤
│ _id            : ObjectId │  ← auto-generated
│ checkinId      : ObjectId │  required, ref → daily_checkins, unique
│ userId         : ObjectId │  required, ref → users, indexed
│ stressLevel    : String   │  required, enum: ["Rendah", "Sedang", "Tinggi"]
│ stressScore    : Number   │  required, min: 0, max: 1
│ recommendation : String   │  required
│ createdAt      : Date     │  auto (timestamps)
│ updatedAt      : Date     │  auto (timestamps)
└───────────────────────────┘
```

---

## Detail Per Koleksi

### 1. `users`

Menyimpan data akun pengguna. Password disimpan dalam bentuk bcrypt hash, **bukan** plaintext.

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| `_id` | `ObjectId` | auto | Primary key |
| `name` | `String` | required, trim | Nama lengkap |
| `email` | `String` | required, unique, lowercase, trim | Digunakan untuk login |
| `password` | `String` | required | Bcrypt hash (min 8 char sebelum hash) |
| `age` | `Number` | required, min: 1, max: 150 | Umur pengguna |
| `gender` | `String` | required, enum: `male`, `female` | Jenis kelamin |
| `createdAt` | `Date` | auto | Mongoose timestamps |
| `updatedAt` | `Date` | auto | Mongoose timestamps |

**Indexes:**
- `email`: unique index (mencegah duplikat, mempercepat lookup saat login)

**Referensi User Story:** US-01 (register), US-02 (login)

---

### 2. `daily_checkins`

Menyimpan jurnal harian pengguna. Satu user bisa memiliki banyak checkin, tapi hanya **satu checkin per hari** (unique compound index `userId + checkinDate`).

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| `_id` | `ObjectId` | auto | Primary key |
| `userId` | `ObjectId` | required, ref: `users` | Pemilik jurnal |
| `journalText` | `String` | required, min: 10, max: 1000 | Isi jurnal teks bebas |
| `checkinDate` | `Date` | required | Tanggal checkin (tanpa jam) |
| `createdAt` | `Date` | auto | Mongoose timestamps |
| `updatedAt` | `Date` | auto | Mongoose timestamps |

**Indexes:**
- `{ userId: 1, checkinDate: -1 }`: compound index (query riwayat per user, sorted terbaru)
- `{ userId: 1, checkinDate: 1 }`: unique compound index (mencegah duplikat per hari per user)

**Business Rules:**
- Jika sudah ada checkin pada tanggal yang sama, data lama di-**update** (bukan insert baru) — sesuai US-06 acceptance criteria "konfirmasi sebelum menimpa"
- `journalText` divalidasi di backend: minimal 10 karakter, maksimal 1000 karakter — sesuai US-03

**Referensi User Story:** US-03 (jurnal), US-06 (simpan), US-07 (riwayat)

---

### 3. `predictions`

Menyimpan hasil prediksi dari AI Service (FastAPI). Setiap checkin memiliki **tepat satu** prediksi (relasi 1:1 via `checkinId` unique).

| Field | Type | Constraint | Keterangan |
|---|---|---|---|
| `_id` | `ObjectId` | auto | Primary key |
| `checkinId` | `ObjectId` | required, ref: `daily_checkins`, unique | Checkin yang diprediksi |
| `userId` | `ObjectId` | required, ref: `users` | Denormalisasi untuk query efisien |
| `stressLevel` | `String` | required, enum: `Rendah`, `Sedang`, `Tinggi` | Label klasifikasi |
| `stressScore` | `Number` | required, min: 0, max: 1 | Confidence score (0.0 – 1.0) |
| `recommendation` | `String` | required | Saran relaksasi dari Gemini / fallback |
| `createdAt` | `Date` | auto | Mongoose timestamps |
| `updatedAt` | `Date` | auto | Mongoose timestamps |

**Indexes:**
- `checkinId`: unique index (1 prediksi per 1 checkin)
- `{ userId: 1, createdAt: -1 }`: compound index (query riwayat prediksi per user, sorted terbaru)

**Catatan Desain:**
- Field `userId` sengaja di-denormalisasi (duplikat dari `daily_checkins.userId`) agar query `GET /api/predictions` tidak perlu join/populate ke `daily_checkins` terlebih dahulu — ini best practice MongoDB untuk read-heavy pattern.
- Jika Gemini API gagal, `recommendation` diisi dengan **fallback statis** — sesuai US-05.

**Referensi User Story:** US-04 (prediksi), US-05 (rekomendasi), US-08 (grafik tren)

---

## Catatan Umum

1. **Semua koleksi menggunakan `timestamps: true`** pada Mongoose schema options, sehingga `createdAt` dan `updatedAt` otomatis dikelola.

2. **Password tidak pernah dikembalikan dalam response API.** Gunakan `select: false` pada field password di Mongoose schema, atau exclude secara eksplisit saat query.

3. **Soft delete tidak digunakan.** Untuk skala capstone ini, hard delete sudah memadai. Jika di masa depan dibutuhkan, bisa ditambahkan field `deletedAt`.

4. **Relasi menggunakan referensi (bukan embedded)** karena:
   - Predictions bisa di-query independen untuk chart (US-08)
   - Checkins bisa di-list tanpa membawa data predictions (US-07 hanya butuh label)
   - Lebih fleksibel untuk pagination

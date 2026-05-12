# Handoff & Integrasi — Backend ke Tim

> **Dari:** Angga (Backend)
> **Tanggal:** 12 Mei 2026
> **Status Backend:** ✅ Selesai & terverifikasi — semua 7 endpoint berjalan

---

## Status Saat Ini

| Komponen | Status | Detail |
|---|---|---|
| Backend API | ✅ Selesai | 7 endpoint, terkoneksi MongoDB Atlas, tested |
| Frontend UI | ✅ Selesai (prototype) | Semua halaman ada, tapi masih pakai mock data |
| Frontend ↔ Backend | ❌ Belum terhubung | Frontend belum ada API call ke backend |
| Backend → FastAPI | ✅ Siap (fallback aktif) | Backend sudah bisa call FastAPI, fallback ke mock jika belum ready |
| FastAPI | ❌ Belum ada | Placeholder folder sudah disiapkan |
| Model TF | ❌ Belum ada | — |
| Dashboard Streamlit | ❌ Belum ada | Placeholder folder sudah disiapkan |

---

## 1. Untuk Reynaldo (Frontend)

### Apa yang sudah siap

Backend API sudah berjalan di **`http://localhost:5000`** dengan 7 endpoint yang siap dikonsumsi frontend. Semua response menggunakan format envelope yang konsisten:

```json
{
  "success": true,
  "message": "Deskripsi",
  "data": { ... }
}
```

### Yang perlu Reynaldo lakukan

#### A. Install HTTP client
```bash
cd frontend
pnpm add axios
```

#### B. Buat file environment
Buat file `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### C. Buat service layer
Buat folder `frontend/lib/services/` dengan 3 file:

**`auth.service.ts`** — panggil endpoint auth:
```typescript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Sertakan token di setiap request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data: { name: string; email: string; password: string; age: number; gender: string }) =>
  API.post('/api/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  API.post('/api/auth/login', data);

export const getMe = () =>
  API.get('/api/auth/me');
```

**`checkin.service.ts`** — panggil endpoint jurnal:
```typescript
export const createCheckin = (journalText: string) =>
  API.post('/api/checkins', { journalText });

export const getCheckins = (page = 1, limit = 10) =>
  API.get(`/api/checkins?page=${page}&limit=${limit}`);
```

**`prediction.service.ts`** — panggil endpoint prediksi:
```typescript
export const createPrediction = (checkinId: string) =>
  API.post('/api/predictions', { checkinId });

export const getPredictions = (page = 1, limit = 10, days?: number) =>
  API.get(`/api/predictions?page=${page}&limit=${limit}${days ? `&days=${days}` : ''}`);
```

#### D. Ganti mock data dengan API call

| Halaman | Sekarang | Ganti dengan |
|---|---|---|
| Login (`page.tsx`) | `router.push("/home")` | `POST /api/auth/login` → simpan token → redirect |
| Register (`register/page.tsx`) | mock | `POST /api/auth/register` → simpan token → redirect |
| Home (`home/page.tsx`) | `sessionStorage` | `POST /api/checkins` → dapat `checkinId` → `POST /api/predictions` → redirect ke result |
| Result (`result/page.tsx`) | mock static | Baca prediction data dari state/query param |
| History (`history/page.tsx`) | `mockHistory` | `GET /api/checkins` (paginated, includes prediction) |
| Insights (`insights/page.tsx`) | static | Embed link Streamlit Dashboard (nanti dari Nathaniela) |

#### E. Flow autentikasi

```
Register/Login → dapat { token, user }
     ↓
Simpan token di localStorage
     ↓
Semua API call → header: Authorization: Bearer <token>
     ↓
Jika 401 → redirect ke Login
```

### Referensi lengkap
- Semua detail request/response body: **`documentation/fullstack/api_contract.md`**
- Tipe data yang sudah ada di `mock-data.ts` **sesuai** dengan response API

---

## 2. Untuk Deva (AI Engineer — FastAPI)

### Apa yang sudah siap

Backend sudah siap memanggil FastAPI kamu. Kode integrasi ada di `backend/src/modules/prediction/prediction.service.ts`. Backend membaca URL dari env var `FASTAPI_URL`.

### Yang perlu Deva buat

**2 endpoint saja:**

#### `POST /predict`

```
Request:
{
  "text": "Hari ini saya merasa sangat tertekan karena deadline..."
}

Response:
{
  "stress_level": "Tinggi",       ← HARUS salah satu: "Rendah" | "Sedang" | "Tinggi"
  "stress_score": 0.87,           ← float antara 0.0 dan 1.0
  "recommendation": "Coba luangkan 10 menit untuk pernapasan dalam..."
}
```

#### `GET /health`

```
Response:
{
  "status": "ok"
}
```

### Aturan penting

| Aturan | Detail |
|---|---|
| **Label bahasa Indonesia** | `Rendah`, `Sedang`, `Tinggi` — bukan English |
| **Score range** | `0.0` sampai `1.0` (float) |
| **Recommendation tidak boleh kosong** | Jika Gemini API gagal, harus return fallback statis |
| **Timeout** | Backend timeout di **5 detik**. Pastikan inference + Gemini selesai dalam waktu itu |
| **Port default** | Jalankan di `http://localhost:8000` |

### Cara test integrasi

Setelah FastAPI kamu jalan di `localhost:8000`:
1. Backend otomatis akan call endpoint kamu (tidak perlu ubah kode backend)
2. Jalankan backend: `cd backend && npm run dev`
3. Test: buat checkin lalu buat prediction — backend akan forward ke FastAPI kamu

### Jika belum siap

Tidak masalah — backend sudah punya **mock fallback**. Ketika FastAPI tidak respond dalam 5 detik, backend mengembalikan prediksi acak dengan rekomendasi statis. User tetap dapat hasil.

### Referensi
- Kontrak internal lengkap: bagian **"4. Internal — Backend → FastAPI"** di `documentation/fullstack/api_contract.md`
- Placeholder folder: `ai-service/`

---

## 3. Untuk Marco (AI Engineer — Model TensorFlow)

### Ketergantungan dengan backend

**Tidak ada ketergantungan langsung.** Model kamu dimuat oleh Deva di FastAPI, bukan oleh backend saya.

### Yang perlu diperhatikan

| Hal | Requirement |
|---|---|
| **Output label** | Model harus output: `Rendah`, `Sedang`, atau `Tinggi` (bahasa Indonesia) |
| **Output score** | Confidence score berupa float `0.0` - `1.0` |
| **Format model** | `.keras` — sesuai yang disepakati di workload allocation |
| **Handoff** | Serahkan file `.keras` + script preprocessing ke Deva untuk dimuat di FastAPI |

### Koordinasi

Koordinasi utama Marco adalah dengan **Deva**, bukan dengan saya. Pastikan:
1. Label output sesuai format di atas
2. Preprocessing teks yang dipakai saat training **sama persis** dengan yang Deva implementasi di FastAPI

---

## 4. Untuk Hayqal & Nathaniela (Data Science)

### Ketergantungan dengan backend

**Tidak ada.** Kalian bekerja sepenuhnya independen dari backend.

### Yang perlu dilakukan

1. **Hayqal:** Serahkan dataset bersih + preprocessing script ke Deva dan Marco
2. **Nathaniela:** Setelah Streamlit Dashboard di-deploy, kirim URL-nya ke **Reynaldo** untuk ditaruh di halaman Insights

### Di mana taruh file

Folder `data-science/` sudah disiapkan di repo. Struktur yang disarankan:

```
data-science/
├── datasets/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── 01_data_wrangling.ipynb
│   ├── 02_eda.ipynb
│   └── 03_ab_testing.ipynb
├── dashboard/
│   ├── app.py
│   └── requirements.txt
└── data_dictionary.md
```

---

## Diagram Alur Integrasi

```
┌─────────────┐     HTTP (axios)     ┌──────────────┐    HTTP (fetch)    ┌──────────────┐
│   Frontend   │ ──────────────────▶ │   Backend    │ ────────────────▶ │   FastAPI    │
│  (Reynaldo)  │ ◀────────────────── │   (Angga)    │ ◀──────────────── │   (Deva)     │
│  Next.js     │    JSON response    │  Express+TS  │   JSON response   │  Python      │
└─────────────┘                      └──────┬───────┘                   └──────┬───────┘
                                            │                                  │
                                            │ Mongoose                         │ load
                                            ▼                                  ▼
                                     ┌──────────────┐                   ┌──────────────┐
                                     │ MongoDB Atlas │                   │ Model .keras │
                                     │  (3 koleksi) │                   │   (Marco)    │
                                     └──────────────┘                   └──────────────┘

                                                              ┌──────────────┐
                                                              │  Streamlit   │
                                                              │ (Nathaniela) │──── URL dikirim
                                                              └──────┬───────┘     ke Reynaldo
                                                                     │
                                                              ┌──────────────┐
                                                              │ Dataset bersih│
                                                              │  (Hayqal)    │──── dikirim ke
                                                              └──────────────┘     Deva & Marco
```

---

## Checklist Integrasi

| # | Task | PIC | Depends On | Status |
|---|---|---|---|---|
| 1 | Backend API selesai & tested | Angga | — | ✅ |
| 2 | Frontend ganti mock → API call | Reynaldo | #1 | ⬜ |
| 3 | FastAPI `POST /predict` & `GET /health` | Deva | #5 | ⬜ |
| 4 | Model `.keras` selesai | Marco | #6 | ⬜ |
| 5 | Model dimuat di FastAPI | Deva | #4 | ⬜ |
| 6 | Dataset bersih diserahkan | Hayqal | — | ⬜ |
| 7 | Streamlit Dashboard deploy | Nathaniela | #6 | ⬜ |
| 8 | URL Streamlit dimasukkan ke FE | Reynaldo | #7 | ⬜ |
| 9 | End-to-end test (FE → BE → FastAPI) | Angga + Reynaldo + Deva | #2, #3 | ⬜ |
| 10 | Deploy semua service ke production | All | #9 | ⬜ |

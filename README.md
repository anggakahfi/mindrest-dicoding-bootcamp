# TweetMind

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-orange?logo=google)](https://ai.google.dev/)

**TweetMind** adalah aplikasi web interaktif yang membantu pengguna memantau tingkat stres harian mereka melalui jurnal teks bebas. Aplikasi ini memadukan kekuatan **Deep Learning berbasis NLP** (untuk mengklasifikasikan tingkat stres) dan **Generative AI (Google Gemini)** (untuk memberikan ringkasan kondisi mental dan saran relaksasi personal).

Proyek ini dibangun sebagai Capstone Project untuk program Bangkit Academy 2026.

---

## Fitur Utama

- **Daily Check-in Journal**: Pengguna dapat meluapkan perasaannya melalui teks jurnal bebas setiap hari (atau beberapa kali sehari).
- **AI Stress Analysis**: Menggunakan model Deep Learning (TensorFlow/Keras) untuk mendeteksi emosi dan mengklasifikasikan tingkat stres pengguna menjadi **Rendah**, **Sedang**, atau **Tinggi**.
- **Personalized Recommendations**: Integrasi Google Gemini API untuk membaca konteks jurnal dan memberikan ringkasan emosi, daftar langkah konkret yang bisa dilakukan, serta pesan dukungan moral yang suportif.
- **Progress Tracking**: Memvisualisasikan fluktuasi tingkat stres pengguna selama 7 hari terakhir menggunakan grafik interaktif (Recharts).
- **Secure Authentication**: Sistem registrasi dan login yang aman menggunakan JWT dan enkripsi password.

---

## Struktur Monorepo (Arsitektur Sistem)

Proyek ini dibangun menggunakan arsitektur monorepo dengan pemisahan *concern* yang jelas (microservices):

```text
capstone-dicoding/
├── frontend/        -> Antarmuka Pengguna (UI) menggunakan Next.js (App Router), TailwindCSS, dan shadcn/ui.
├── backend/         -> Core REST API menggunakan Node.js, Express, TypeScript, dan MongoDB Atlas.
├── ai-service/      -> Layanan Inferensi Machine Learning (FastAPI) untuk prediksi stres & Google Gemini.
├── data-science/    -> Eksperimen model NLP, EDA (Jupyter Notebooks), dan Streamlit Dashboard analitik.
└── documentation/   -> Spesifikasi proyek (ERD, API Contract, Tech Stack, dll).
```

---

## Cara Menjalankan Aplikasi Secara Lokal

Karena aplikasi ini terdiri dari 3 service utama yang saling bergantung, Anda perlu menjalankan ketiganya secara bersamaan di terminal yang berbeda.

### 1. Menjalankan AI Service (Port 8000)
AI Service bertugas memproses model Machine Learning dan memanggil Gemini API.
```bash
cd ai-service

# Buat dan aktifkan Virtual Environment
python -m venv venv
.\venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependensi
pip install -r requirements.txt

# Setup Environment Variable (.env)
cp .env.example .env
# Jangan lupa masukkan GEMINI_API_KEY asli Anda di dalam file .env!

# Jalankan server FastAPI
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Menjalankan Backend (Port 5000)
Backend bertugas mengatur *business logic*, autentikasi, dan operasi database.
```bash
cd backend

# Install dependensi
npm install

# Setup Environment Variable (.env)
# URL MongoDB Development sudah tersedia di .env.example
cp .env.example .env

# Jalankan backend development server
npm run dev
```

### 3. Menjalankan Frontend (Port 3000)
Aplikasi antarmuka pengguna utama.
```bash
cd frontend

# Install dependensi menggunakan pnpm (disarankan, sesuai dengan pnpm-workspace.yaml)
pnpm install

# Jalankan Next.js development server
pnpm run dev
```

Setelah ketiga service menyala:
Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda!

---

## Dokumentasi Lebih Lanjut

Untuk detail teknis lebih lanjut seputar arsitektur dan perencanaan proyek, silakan baca dokumentasi di folder `documentation/`:
- [Arsitektur & Tech Stack Lengkap](documentation/project/tech_stack.md)
- [API Contract (Backend & AI Service)](documentation/fullstack/api_contract.md)
- [Entity Relationship Diagram (ERD)](documentation/fullstack/erd.md)
- [Wireframe & Desain UI](documentation/fullstack/frontend/wireframe.md)
- [Pembagian Tugas (Workload Allocation)](documentation/project/workload_allocation.md)

---

## Tim Pengembang (CC26-PSU250)

Proyek ini dibangun oleh tim kolaboratif lintas disiplin:
- **Machine Learning / Data Science:** (2 Anggota) - *Fokus pada EDA, training NLP model, dan dashboard analitik.*
- **AI Engineer (FastAPI):** (2 Anggota) - *Fokus pada serving model, integrasi Gemini, dan prompt engineering.*
- **Fullstack Web Developer:** (2 Anggota) - *Fokus pada UI/UX Next.js, Express Backend, dan integrasi sistem End-to-End.*

---
*Dibuat untuk kesehatan mental yang lebih baik.*

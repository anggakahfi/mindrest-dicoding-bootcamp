# Workload Allocation — TweetMind

## Angga (saya) — Backend (Node.js + Express)

**Scope penuh:**
- Setup project Express, koneksi MongoDB Atlas via Mongoose
- Implementasi skema database sesuai ERD (users, daily_checkins, predictions)
- Endpoint autentikasi: `POST /api/auth/register`, `POST /api/auth/login`
- Middleware JWT untuk semua protected route
- Middleware enkripsi password dengan bcrypt
- Endpoint check-in: `POST /api/checkins`, `GET /api/checkins`
- Endpoint prediksi: `POST /api/predictions`, `GET /api/predictions`
- Integrasi internal ke FastAPI (forward request, terima response)
- Middleware global error handler
- Middleware validasi input (format, tipe data, batas karakter)
- Konfigurasi CORS agar frontend bisa akses
- Deploy backend ke Render.com
- Konfigurasi environment variables production
- Dokumentasi cara menjalankan backend di lokal (README)

---

## Reynaldo — Frontend (React + Vite + Tailwind)

**Scope penuh:**
- Setup project React + Vite, instalasi dan konfigurasi Tailwind CSS
- Setup routing dengan React Router
- Implementasi semua halaman: Register, Login, Home, Result, History, Insights
- Komponen reusable: Button, Input, Badge, Toast, Navbar
- Integrasi semua axios call ke backend (auth, checkin, prediction)
- Implementasi loading state dan error state di setiap halaman
- Implementasi line chart progres 7 hari dengan Chart.js
- Implementasi character counter di textarea jurnal
- Implementasi empty state di halaman History
- Responsivitas semua halaman (mobile + desktop)
- Simpan JWT token dan manajemen session di client
- Deploy frontend ke Vercel
- Buat wireframe di Figma (bisa dikerjakan hari 1–2 sebelum coding)

---

## Marco — AI Engineer (Model TensorFlow)

**Scope penuh:**
- Setup environment TensorFlow
- Eksplorasi dan eksperimen arsitektur model klasifikasi teks
- Preprocessing teks untuk input model (tokenisasi, padding, embedding)
- Training model menggunakan TF Functional API
- Implementasi Custom Callback (early stopping)
- Implementasi `tf.GradientTape` custom training loop (file terpisah)
- Setup dan integrasi TensorBoard untuk monitoring training
- Iterasi dan tuning model hingga akurasi ≥ 85%
- Ekspor model final ke format `.keras`
- Buat skrip `predict.py` yang bisa dijalankan standalone
- Catat semua eksperimen di ML Experiment Log
- Simpan log TensorBoard ke GitHub
- Tulis dokumentasi model (arsitektur final, cara training ulang)

---

## Deva — AI Engineer (FastAPI + Integrasi)

**Scope penuh:**
- Setup project FastAPI (struktur folder, virtual environment, dependencies)
- Buat mock endpoint `POST /predict` di hari 2–3 (hardcoded response)
- Buat endpoint `GET /health` untuk health check
- Definisi Pydantic schema untuk request dan response
- Integrasi model `.keras` dari Marco ke FastAPI (inference pipeline)
- Implementasi text preprocessing sebelum masuk model
- Integrasi Gemini API: buat prompt template per label stres
- Implementasi fallback statis jika Gemini API gagal
- Error handling: validasi input, tangkap exception model, timeout
- Swap mock response ke inference nyata ketika model Marco selesai
- Stress test endpoint dengan berbagai input edge case
- Deploy FastAPI ke Render.com (service terpisah dari backend)
- Tulis dokumentasi FastAPI (endpoint, cara run lokal)

---

## Hayqal — Data Scientist (Data & EDA)

**Scope penuh:**
- Cari dan download dataset teks berlabel stres dari Kaggle (Dreaddit, Stress Annotations, dsb.)
- Cari dataset tambahan jika jumlah sampel kurang dari 1000 baris
- Data assessing: identifikasi missing values, distribusi label, kualitas teks
- Data cleaning: hapus noise, normalisasi teks (lowercase, hapus karakter aneh)
- EDA: distribusi label stres, word frequency per kelas, panjang teks, wordcloud
- Explanatory analysis: menjawab pertanyaan bisnis dari data
- Buat visualisasi EDA yang siap dimasukkan ke Streamlit Dashboard
- Serahkan dataset bersih + preprocessing script ke Deva dan Marco di akhir minggu 1

---

## Nathaniela — Data Scientist (A/B Testing & Dashboard)

**Scope penuh:**
- Buat Data Dictionary dari dataset yang ditemukan Hayqal
- Diskusi bersama Marco dan Deva: tentukan kolom target dan strategi encoding
- Feature engineering: panjang teks, jumlah kata negatif, TF-IDF score
- Tentukan hipotesis A/B Testing dan pembagian grup dari dataset
- Eksekusi A/B Testing menggunakan uji T-Test di Jupyter Notebook
- Interpretasi hasil A/B Testing dalam bahasa yang mudah dipahami pengguna awam
- Bangun Streamlit Dashboard: layout, navigasi, integrasikan visualisasi EDA dari Hayqal
- Masukkan hasil A/B Testing ke dashboard dalam format yang menarik
- Deploy Streamlit Dashboard ke Streamlit Community Cloud
- Kirim link dashboard ke Reynaldo untuk halaman Data Insights
- Tulis laporan teknis PDF dari Problem Discovery hingga hasil akhir

---

## Ringkasan Kepemilikan

| Deliverable | PIC |
|---|---|
| Backend Express (deployed) | Angga |
| Skema database & migrasi | Angga |
| Integrasi Backend → FastAPI | Angga |
| Frontend React (deployed) | Reynaldo |
| Wireframe Figma | Reynaldo |
| Grafik Chart.js | Reynaldo |
| Model TensorFlow `.keras` | Marco |
| ML Experiment Log | Marco |
| Skrip `predict.py` | Marco |
| Log TensorBoard di GitHub | Marco |
| FastAPI + mock endpoint | Deva |
| Integrasi Gemini API | Deva |
| Dataset bersih + preprocessing script | Hayqal |
| EDA & visualisasi | Hayqal |
| Data Dictionary | Nathaniela |
| A/B Testing | Nathaniela |
| Streamlit Dashboard (deployed) | Nathaniela |
| Laporan teknis PDF | Nathaniela |
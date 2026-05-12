# Project Overview — MindRest

MindRest adalah aplikasi web yang membantu pengguna memantau tingkat stres harian mereka melalui jurnal teks bebas. Pengguna menulis kondisi hariannya dalam teks, model Deep Learning berbasis NLP mengklasifikasikan tingkat stres (Rendah / Sedang / Tinggi), dan AI Generatif memberikan saran relaksasi personal.

**Tim:** 6 orang (2 Data Scientist, 2 AI Engineer, 2 Fullstack)
**Tema:** Healthy Lives and Well-being
**ID Tim:** CC26-PSU250

---

# Tech Stack

## Frontend
| Teknologi | Fungsi |
|---|---|
| React + Vite | Framework UI dan module bundler |
| Tailwind CSS | Styling dan responsivitas |
| Axios | HTTP client untuk komunikasi ke backend |
| Chart.js | Visualisasi grafik progres stres 7 hari |
| React Router | Client-side routing antar halaman |

## Backend
| Teknologi | Fungsi |
|---|---|
| Node.js + Express | REST API utama aplikasi |
| JWT | Autentikasi dan manajemen session |
| bcrypt | Enkripsi password |
| MongoDB Atlas | Database cloud untuk menyimpan user dan riwayat prediksi |
| Mongoose | ODM untuk interaksi dengan MongoDB |

## AI Service
| Teknologi | Fungsi |
|---|---|
| Python + FastAPI | REST API serving model ML |
| TensorFlow + Keras | Membangun dan melatih model klasifikasi teks |
| TensorBoard | Monitoring metrik training |
| Google Gemini API | Generasi saran relaksasi personal |

## Data Science
| Teknologi | Fungsi |
|---|---|
| Pandas + NumPy | Data wrangling dan preprocessing |
| Matplotlib + Seaborn | Visualisasi EDA |
| SciPy | A/B Testing (uji T-Test) |
| Streamlit | Dashboard analitik interaktif |

## Infrastruktur
| Layanan | Fungsi |
|---|---|
| Vercel | Hosting frontend |
| Render.com | Hosting backend Express dan FastAPI |
| Streamlit Community Cloud | Hosting dashboard DS |
| GitHub | Version control dan penyimpanan log TensorBoard |

---

# User Stories — MindRest

## Epic 1: Autentikasi

**US-01**
Sebagai pengguna baru, saya ingin mendaftarkan akun dengan nama, email, password, umur, dan jenis kelamin, agar saya bisa mengakses aplikasi secara personal.

> Acceptance Criteria:
> - Form validasi: email harus unik, password minimal 8 karakter
> - Setelah register berhasil, langsung diarahkan ke halaman Home
> - Jika email sudah terdaftar, muncul pesan error yang jelas

**US-02**
Sebagai pengguna terdaftar, saya ingin login menggunakan email dan password, agar data dan riwayat saya tetap tersimpan dan bisa diakses kembali.

> Acceptance Criteria:
> - Jika kredensial salah, muncul pesan error generik tanpa membedakan email vs password
> - Session tetap aktif selama pengguna tidak logout
> - Terdapat tombol logout yang bisa diakses dari halaman mana pun

---

## Epic 2: Jurnal Harian & Prediksi

**US-03**
Sebagai pengguna, saya ingin menulis jurnal teks bebas tentang kondisi saya hari ini, agar sistem dapat menganalisis tingkat stres saya berdasarkan apa yang saya rasakan dan alami.

> Acceptance Criteria:
> - Tersedia textarea dengan placeholder teks panduan penulisan
> - Minimal 10 karakter, maksimal 1000 karakter
> - Terdapat counter karakter yang terlihat
> - Tombol "Analisis" tidak aktif jika belum memenuhi minimal karakter

**US-04**
Sebagai pengguna, saya ingin melihat hasil prediksi tingkat stres saya setelah menulis jurnal, agar saya tahu kondisi stres saya hari ini secara objektif.

> Acceptance Criteria:
> - Hasil menampilkan label tingkat stres (Rendah / Sedang / Tinggi)
> - Hasil menampilkan confidence score dalam bentuk persentase atau progress bar
> - Proses prediksi tidak membuat halaman crash atau freeze lebih dari 5 detik
> - Jika server tidak merespons, muncul pesan error yang ramah dengan tombol "Coba Lagi"

**US-05**
Sebagai pengguna, saya ingin mendapatkan saran relaksasi singkat yang relevan dengan tingkat stres saya, agar saya tahu langkah konkret yang bisa langsung dilakukan.

> Acceptance Criteria:
> - Saran muncul bersamaan dengan hasil prediksi
> - Panjang saran 1–2 kalimat
> - Jika API Gemini gagal, tampilkan saran fallback statis — tidak boleh kosong

**US-06**
Sebagai pengguna, saya ingin menyimpan hasil prediksi hari ini ke riwayat saya, agar saya bisa melacak pola stres saya dari waktu ke waktu.

> Acceptance Criteria:
> - Terdapat tombol "Simpan ke Riwayat" di halaman hasil
> - Setelah disimpan, muncul toast konfirmasi singkat
> - Jika sudah ada data tersimpan hari ini, muncul konfirmasi sebelum menimpa

---

## Epic 3: Riwayat & Progres Pribadi

**US-07**
Sebagai pengguna, saya ingin melihat daftar riwayat jurnal dan prediksi saya, agar saya bisa mengingat kembali kondisi saya di hari-hari sebelumnya.

> Acceptance Criteria:
> - Riwayat ditampilkan dalam urutan terbaru di atas
> - Setiap entri menampilkan: tanggal, cuplikan teks jurnal, dan label stres
> - Jika belum ada riwayat, tampilkan empty state dengan CTA ke halaman Home

**US-08**
Sebagai pengguna, saya ingin melihat grafik tingkat stres saya selama 7 hari terakhir, agar saya bisa melihat tren stres saya secara visual.

> Acceptance Criteria:
> - Grafik berupa line chart dengan sumbu X tanggal dan sumbu Y confidence score (0–1)
> - Jika data kurang dari 7 hari, grafik tetap tampil dengan data yang ada
> - Jika hanya 1 titik data, tampilkan keterangan "Butuh minimal 2 data untuk melihat tren"
> - Hari tanpa data tidak diinterpolasi — titik kosong dibiarkan kosong

---

## Epic 4: Data Insights

**US-09**
Sebagai pengguna, saya ingin melihat insight berbasis data populasi tentang hubungan pola teks dengan tingkat stres, agar saya bisa memahami konteks kondisi saya dibanding gambaran umum.

> Acceptance Criteria:
> - Tersedia tombol atau link yang membuka Streamlit Dashboard di tab baru
> - Jika Streamlit tidak tersedia, tampilkan pesan informatif
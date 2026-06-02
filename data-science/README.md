# Data Science Project

## Deskripsi
Project ini bertujuan untuk menganalisis sentimen pengguna Twitter terhadap topik kesehatan mental. Analisis dilakukan melalui tahapan Data Wrangling, Exploratory Data Analysis (EDA), A/B Testing, dan visualisasi hasil menggunakan dashboard interaktif berbasis Streamlit.

## Struktur Folder

```text
data-science/
├── dashboard/
│   ├── app.py
│   └── requirements.txt
│
├── datasets/
│   ├── raw/
│   │   └── Twitter_Analysis.xlsx
│   │
│   └── processed/
│       ├── twitter_clean.csv
│       ├── top_hashtags.json
│       ├── ab_results.json
│       └── assessment.json
│
├── notebooks/
│   ├── 01_data_wrangling.ipynb
│   ├── 02_eda.ipynb
│   └── 03_ab_testing.ipynb
│
├── reports/
│   ├── README.md
│   └── figures/
│       ├── viz1_eda_overview.png
│       ├── viz2_top_hashtags.png
│       ├── viz3_correlation_heatmap.png
│       ├── viz4_ab_testing.png
│       └── viz5_explanatory.png
|
├── README.md
|
└── data_dictionary.md
```

### Keterangan Folder

| Folder/File | Deskripsi |
|------------|-----------|
| `datasets/raw/` | Dataset mentah yang diperoleh sebelum proses pembersihan data |
| `datasets/processed/` | Dataset hasil data wrangling dan preprocessing yang siap dianalisis |
| `notebooks/01_data_wrangling.ipynb` | Proses pembersihan dan transformasi data |
| `notebooks/02_eda.ipynb` | Exploratory Data Analysis (EDA) dan visualisasi data |
| `notebooks/03_ab_testing.ipynb` | Pengujian hipotesis dan A/B Testing |
| `dashboard/` | Dashboard interaktif berbasis Streamlit |
| `reports/figures/` | Hasil visualisasi dan grafik analisis |
| `reports/README.md` | Dokumentasi dan penjelasan setiap visualisasi yang terdapat pada folder `figures`, termasuk interpretasi hasil analisis yang diperoleh dari grafik. |
| `README.md` | Dokumentasi utama proyek yang berisi deskripsi proyek, struktur folder, dataset, tahapan analisis, cara menjalankan dashboard, serta informasi kontributor. |
| `data_dictionary.md` | Dokumentasi atribut, tipe data, dan deskripsi setiap kolom pada dataset yang digunakan. |

## Tujuan Analisis

- Mengidentifikasi distribusi sentimen pengguna Twitter terhadap isu kesehatan mental.
- Menganalisis pola penggunaan hashtag pada setiap kategori sentimen.
- Mengevaluasi perbedaan karakteristik tweet menggunakan pendekatan A/B Testing.
- Menyajikan hasil analisis dalam dashboard interaktif.

## Dataset

Dataset yang digunakan merupakan bagian dari Stress Detection from Social Media Articles yang dikembangkan oleh SenticNet. Dataset berisi data media sosial yang telah diberi label untuk mendukung analisis stres dan sentimen berbasis teks.

Dataset ini dikembangkan dalam penelitian :

> *Stress Detection from Social Media Articles: New Dataset Benchmark and Analytical Study*

Sumber Dataset:
https://github.com/SenticNet/stress-detection

Dataset yang digunakan pada project ini berasal dari file:

```text
datasets/raw/
└── Twitter_Full.xlsx
```

## Tahapan Analisis

### 1. Data Wrangling
- Membersihkan data
- Menangani missing values
- Transformasi format data

### 2. Exploratory Data Analysis (EDA)
- Analisis distribusi data
- Visualisasi pola dan tren
- Korelasi antar variabel

### 3. A/B Testing
- Pengujian hipotesis
- Evaluasi perbedaan antar kelompok

## Dashboard Interaktif

Dashboard dapat diakses secara online melalui Streamlit Community Cloud:

[![Live Demo](https://img.shields.io/badge/Streamlit-Live_Dashboard-FF4B4B?logo=streamlit&logoColor=white)](https://tweetmind-dashboard.streamlit.app/)

🔗 https://tweetmind-dashboard.streamlit.app/

## Tech Stack

- Python
- Pandas
- NumPy
- Plotly
- Streamlit
- SciPy
- Statsmodels
- Jupyter Notebook

## Cara Menjalankan Dashboard

### 1. Clone Repository

```bash
git clone https://github.com/anggakahfi/mindrest-dicoding-bootcamp.git
cd mindrest-dicoding-bootcamp/data-science
```

### 2. Install Dependencies

Pastikan Python 3.10+ sudah terpasang, kemudian install seluruh library yang dibutuhkan :

```bash
pip install -r dashboard/requirements.txt
```

### 3. Siapkan Dataset

Pastikan file berikut tersedia pada folder :

```text
datasets/processed/
├── twitter_clean.csv
├── top_hashtags.json
├── ab_results.json
└── assessment.json
```

### 4. Jalankan Dashboard

Dari folder `data-science`, jalankan:

```bash
streamlit run dashboard/app.py
```

### 5. Buka Dashboard

Setelah aplikasi berjalan, Streamlit akan menampilkan alamat seperti :

```text
Local URL: http://localhost:8501
```

Buka URL tersebut melalui browser untuk mengakses dashboard.

---

## Fitur Dashboard

Dashboard menyediakan beberapa menu analisis :

### 1. EDA (Exploratory Data Analysis)
- Distribusi sentimen (Positive, Neutral, Negative)
- Visualisasi histogram fitur numerik
- Statistik deskriptif berdasarkan sentimen

### 2. Hashtag Analysis
- Top hashtag berdasarkan sentimen
- Filter jumlah hashtag yang ditampilkan
- Insight penggunaan hashtag pada sentimen negatif

### 3. A/B Testing
- Hasil pengujian statistik
- Nilai p-value
- Keputusan menerima atau menolak hipotesis nol (H₀)

### 4. Data Preview
- Menampilkan dataset yang telah dibersihkan
- Filter berdasarkan kategori sentimen

## Kontributor

| Nama | Tanggung Jawab |
|--------|--------|
| Haikal Akbar Rizky Iskandar | Data Wrangling, Exploratory Data Analysis (EDA), Visualisasi Data |
| Nathaniela Isya Nur Rofiah | A/B Testing, Dashboard Development (Streamlit) |

## Kesimpulan

Analisis menunjukkan bahwa sentimen negatif mendominasi percakapan terkait kesehatan mental di Twitter. Selain itu, beberapa hashtag populer muncul pada berbagai kategori sentimen dan menunjukkan adanya variasi konteks penggunaan. Hasil A/B Testing mengindikasikan adanya perbedaan karakteristik tertentu antar kelompok tweet yang dianalisis. Dashboard Streamlit dikembangkan untuk mempermudah eksplorasi hasil analisis secara interaktif.

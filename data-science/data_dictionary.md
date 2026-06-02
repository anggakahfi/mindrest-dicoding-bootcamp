# Data Dictionary

## Dataset: twitter_clean.csv

Dataset ini merupakan hasil preprocessing dari dataset Twitter terkait kesehatan mental yang digunakan untuk analisis sentimen, Exploratory Data Analysis (EDA), dan A/B Testing.

Jumlah data: **8.439 tweet**

---

## Deskripsi Kolom

| Nama Kolom | Tipe Data | Deskripsi |
|------------|-----------|-----------|
| `text` | String | Teks tweet asli sebelum dilakukan preprocessing. |
| `hashtags` | String | Hashtag yang terdapat pada tweet. |
| `labels` | Integer | Label numerik sentimen (0 = Buruk, 1 = Cukup, 2 = Bagus). |
| `label_text` | String | Representasi teks dari label numerik (`Buruk`, `Cukup`, `Bagus`). |
| `text_length` | Integer | Panjang tweet berdasarkan jumlah karakter. |
| `hashtag_count` | Integer | Jumlah hashtag yang terdapat dalam tweet. |
| `text_clean` | String | Teks tweet yang telah melalui proses preprocessing seperti case folding, penghapusan karakter khusus, URL, mention, dan pembersihan teks lainnya. |
| `sentiment` | Categorical | Kategori sentimen yang dipetakan menjadi `Negative`, `Neutral`, dan `Positive`. |

---

## Mapping Label Sentimen

| labels | label_text | sentiment |
|---------|-----------|-----------|
| 0 | Buruk | Negative |
| 1 | Cukup | Neutral |
| 2 | Bagus | Positive |

---

## Deskripsi Variabel Turunan

### text_length

Menggambarkan panjang tweet berdasarkan jumlah karakter.

Contoh:

```text
"mental health matters"
```

Panjang karakter:

```text
21
```

---

### hashtag_count

Menggambarkan jumlah hashtag yang digunakan dalam sebuah tweet.

Contoh:

```text
#mentalhealth #stress #wellbeing
```

Jumlah hashtag:

```text
3
```

---

## Kategori Sentimen

| Sentimen | Deskripsi |
|-----------|-----------|
| Positive | Tweet yang mengandung opini, pengalaman, atau ekspresi positif terkait kesehatan mental. |
| Neutral | Tweet yang bersifat informatif, netral, atau tidak menunjukkan kecenderungan sentimen yang kuat. |
| Negative | Tweet yang mengandung opini, pengalaman, atau ekspresi negatif terkait kesehatan mental. |

---

## Statistik Dataset

| Informasi | Nilai |
|------------|--------|
| Jumlah Baris | 8.439 |
| Jumlah Kolom | 8 |
| Missing Values | 0 |
| Tipe Data Numerik | 3 |
| Tipe Data Kategorikal/Teks | 5 |

---

## Sumber Dataset

Dataset berasal dari penelitian :

**Stress Detection from Social Media Articles: New Dataset Benchmark and Analytical Study**

Repository:
https://github.com/SenticNet/stress-detection

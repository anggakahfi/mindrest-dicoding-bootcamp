# Data Dictionary
## Twitter Sentiment Analysis — Mental Health Topic

---

## Dataset: `twitter_clean.csv`
**Lokasi:** `datasets/processed/twitter_clean.csv`
**Deskripsi:** Dataset tweet bertema Mental Health yang telah melalui proses cleaning dan feature engineering.
**Jumlah Baris:** 8,439 tweet unik
**Jumlah Kolom:** 19

---

## Kolom Raw (dari sumber asli)

| Kolom | Tipe | Deskripsi | Contoh |
|-------|------|-----------|--------|
| `text` | str | Teks asli tweet | `"Stress may not directly cause..."` |
| `hashtags` | str | Hashtag dalam format string list | `"['Stress', 'anxiety']"` |
| `labels` | int | Kode numerik sentimen | `0`, `1`, `2` |
| `label_text` | str | Label sentimen Bahasa Indonesia | `Bagus`, `Cukup`, `Buruk` |
| `text_length` | int | Panjang teks asli (karakter) | `180` |
| `hashtag_count` | int | Jumlah hashtag dalam tweet | `3` |

### Label Mapping
| `labels` | `label_text` | `sentiment` | Keterangan |
|----------|-------------|-------------|------------|
| `2` | Bagus | Positive | Sentimen Positif |
| `1` | Cukup | Neutral | Sentimen Netral |
| `0` | Buruk | Negative | Sentimen Negatif |

---

## Kolom Cleaned

| Kolom | Tipe | Deskripsi | Contoh |
|-------|------|-----------|--------|
| `text_clean` | str | Teks setelah hapus URL & normalisasi whitespace | `"Stress may not directly cause..."` |

---

## Kolom Engineered (Feature Engineering)

| Kolom | Tipe | Formula / Metode | Deskripsi | Relevansi ML |
|-------|------|-----------------|-----------|-------------|
| `word_count` | int | `len(text_clean.split())` | Jumlah kata dalam teks bersih | ⭐⭐ Sedang |
| `text_length_clean` | int | `len(text_clean)` | Panjang teks bersih (karakter) | ⭐⭐ Sedang |
| `avg_word_len` | float | `mean([len(w) for w in text.split()])` | Rata-rata panjang kata — proxy keformalan bahasa | ⭐⭐ Sedang |
| `char_per_word` | float | `text_length_clean / (word_count + 1)` | Rata-rata karakter per kata | ⭐ Rendah |
| `hashtag_density` | float | `hashtag_count / (word_count + 1)` | Rasio hashtag terhadap jumlah kata | ⭐⭐⭐ Tinggi |
| `exclaim_count` | int | `text.str.count('!')` | Jumlah tanda seru — intensitas emosi | ⭐ Rendah |
| `question_count` | int | `text.str.count('?')` | Jumlah tanda tanya — ekspresi keraguan | ⭐ Rendah |
| `caps_ratio` | float | `sum(c.isupper() for c in text) / len(text)` | Proporsi huruf kapital — ekspresi penekanan | ⭐ Rendah |
| `has_hashtag` | bool | `hashtag_count > 0` | Apakah tweet mengandung ≥1 hashtag | ⭐⭐ Sedang |
| `has_mention` | bool | `bool(re.search(r'@\w+', text))` | Apakah tweet mengandung @mention | ⭐ Rendah |
| `has_url` | bool | `bool(re.search(r'http\S+', text))` | Apakah tweet mengandung URL | ⭐ Rendah |
| `sentiment` | str | `labels.map({0:'Negative',1:'Neutral',2:'Positive'})` | Label sentimen Bahasa Inggris | Target Variable |

---

## Dataset: Raw

| File | Deskripsi |
|------|-----------|
| `datasets/raw/Twitter_Analysis.xlsx` | Dataset mentah original — 12,492 baris, 6 kolom |

---

## File Pendukung

| File | Lokasi | Deskripsi |
|------|--------|-----------|
| `top_hashtags.json` | `datasets/processed/` | Top 20 hashtag per sentimen (Positive/Neutral/Negative) |
| `ab_results.json` | `datasets/processed/` | Hasil 4 uji statistik A/B Testing |
| `assessment.json` | `datasets/processed/` | Laporan assessing data (missing values, duplikat, distribusi) |

---

## Statistik Ringkas Dataset Bersih

| Sentimen | Jumlah | Persentase |
|----------|--------|-----------|
| Positive | 1,505 | 17.8% |
| Neutral | 2,804 | 33.2% |
| Negative | 4,130 | 48.9% |
| **Total** | **8,439** | **100%** |

> ⚠️ **Catatan:** Distribusi tidak seimbang pasca-deduplikasi. Gunakan `class_weight='balanced'` atau SMOTE sebelum training model ML.

---

## Hasil A/B Testing

| Variabel | Test | p-value | Signifikan? | Kesimpulan |
|----------|------|---------|-------------|------------|
| Hashtag Count | Mann-Whitney U | < 0.0001 | ✅ Ya | Tweet Negatif (5.25) > Positif (3.73) hashtag |
| Hashtag Density | Mann-Whitney U | < 0.0001 | ✅ Ya | Kepadatan hashtag berbeda signifikan |
| Word Count | Kruskal-Wallis | > 0.05 | ❌ Tidak | Jumlah kata sama antar sentimen |
| Text Length | Kruskal-Wallis | > 0.05 | ❌ Tidak | Panjang teks sama antar sentimen |

---

*Dibuat sebagai bagian dari proyek Twitter Sentiment Analysis — Mental Health Topic*

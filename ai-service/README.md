# AI Service — TweetMind

> **PIC:** Deva (FastAPI + Integrasi) & Marco (Model TensorFlow)

Folder ini berisi service FastAPI untuk inference model klasifikasi stres dan integrasi Gemini API.

## Status: Belum dimulai

Silakan lihat `documentation/workload_allocation.md` untuk detail scope pekerjaan.

## Struktur Target

```
ai-service/
├── app/
│   ├── api/routes/predict.py
│   ├── core/config.py
│   ├── models/stress_model.keras
│   ├── services/
│   │   ├── model.service.py
│   │   └── gemini.service.py
│   ├── schemas/predict.schema.py
│   └── main.py
├── ml/
│   ├── notebooks/
│   ├── scripts/
│   │   ├── train.py
│   │   ├── predict.py
│   │   └── evaluate.py
│   ├── logs/
│   └── experiment_log.csv
├── requirements.txt
├── .env.example
└── README.md
```

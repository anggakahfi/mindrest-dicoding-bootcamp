# MindRest

Aplikasi web yang membantu pengguna memantau tingkat stres harian melalui jurnal teks bebas. Model Deep Learning berbasis NLP mengklasifikasikan tingkat stres (Rendah / Sedang / Tinggi), dan AI Generatif memberikan saran relaksasi personal.

**Tim:** CC26-PSU250 (6 orang)
**Tema:** Healthy Lives and Well-being

## Struktur Monorepo

```
capstone-dicoding/
├── frontend/        → React + Next.js (UI)
├── backend/         → Node.js + Express + TypeScript (REST API)
├── ai-service/      → Python + FastAPI (ML Inference + Gemini)
├── data-science/    → Jupyter Notebooks + Streamlit Dashboard
└── documentation/   → Dokumen proyek (ERD, API Contract, dsb.)
```

## Cara Menjalankan

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Dokumentasi

Lihat folder `documentation/` untuk detail lengkap:
- [Project Overview](documentation/project_overview.md)
- [Tech Stack](documentation/tech_stack.md)
- [User Stories](documentation/user_stories.md)
- [Workload Allocation](documentation/workload_allocation.md)
- [Folder Structure](documentation/folder_structure.md)

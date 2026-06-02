# Folder Structure — TweetMind (Monorepo)

Struktur monorepo aktual proyek TweetMind:

```
capstone-dicoding/
├── frontend/                          # Next.js 16 (App Router)
│   ├── app/                           # Pages (App Router)
│   │   ├── page.tsx                   # Login
│   │   ├── register/page.tsx          # Register
│   │   ├── home/page.tsx              # Jurnal harian
│   │   ├── result/page.tsx            # Hasil prediksi
│   │   ├── history/page.tsx           # Riwayat
│   │   ├── insights/page.tsx          # Data Insights
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Global styles
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── navbar.tsx                 # Navigation bar
│   │   └── theme-provider.tsx         # Dark/light mode
│   ├── hooks/                         # Custom hooks
│   ├── lib/
│   │   ├── mock-data.ts               # Tipe data & mock data prototype
│   │   └── utils.ts                   # Helper functions
│   ├── public/                        # Static assets
│   ├── styles/                        # Additional styles
│   ├── components.json                # shadcn/ui config
│   ├── next.config.mjs
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── backend/                           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                  # Koneksi MongoDB Atlas
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts      # JWT verification
│   │   │   ├── error.middleware.ts     # Global error handler
│   │   │   └── validate.middleware.ts  # express-validator wrapper
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.model.ts      # Mongoose schema: users
│   │   │   │   ├── auth.validation.ts # Input validation rules
│   │   │   │   ├── auth.service.ts    # Business logic (register, login)
│   │   │   │   ├── auth.controller.ts # HTTP handlers
│   │   │   │   └── auth.routes.ts     # Route definitions
│   │   │   ├── checkin/
│   │   │   │   ├── checkin.model.ts   # Mongoose schema: daily_checkins
│   │   │   │   ├── checkin.service.ts # CRUD + upsert logic
│   │   │   │   ├── checkin.controller.ts
│   │   │   │   └── checkin.routes.ts
│   │   │   └── prediction/
│   │   │       ├── prediction.model.ts    # Mongoose schema: predictions
│   │   │       ├── prediction.service.ts  # FastAPI integration + fallback
│   │   │       ├── prediction.controller.ts
│   │   │       └── prediction.routes.ts
│   │   ├── utils/
│   │   │   └── response.ts           # Standardized response helpers
│   │   └── app.ts                     # Express app setup + route mounting
│   ├── server.ts                      # Entry point
│   ├── tsconfig.json
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── ai-service/                        # Python + FastAPI (PIC: Deva & Marco)
│   └── README.md                      # Placeholder — belum dimulai
│
├── data-science/                      # Jupyter + Streamlit (PIC: Hayqal & Nathaniela)
│   └── README.md                      # Placeholder — belum dimulai
│
├── documentation/                     # Semua dokumen proyek
│   ├── project/                       # Dokumen umum tim
│   │   ├── project_overview.md
│   │   ├── tech_stack.md
│   │   ├── user_stories.md
│   │   ├── workload_allocation.md
│   │   └── folder_structure.md        # ← File ini
│   ├── fullstack/                     # Dokumen teknis fullstack
│   │   ├── erd.md                     # Entity Relationship Diagram
│   │   ├── api_contract.md            # Kontrak API (7 endpoint)
│   │   ├── backend/
│   │   │   └── backend_plan.md        # Strategi pengerjaan backend
│   │   └── frontend/
│   │       └── wireframe.md           # Placeholder wireframe
│   ├── ai-engineer/                   # Placeholder — belum dimulai
│   └── data-science/                  # Placeholder — belum dimulai
│
├── .gitignore                         # Ignore rules per service
└── README.md                          # Root README monorepo
```

---

## Catatan Penting

**`.env` tidak pernah di-push ke GitHub.** Setiap service punya `.env.example` berisi nama variabel tanpa nilainya sebagai panduan anggota lain.

**Pemisahan per service di root** — `frontend/`, `backend/`, `ai-service/`, `data-science/` — memungkinkan setiap anggota tim bekerja di folder masing-masing tanpa konflik.

**Backend menggunakan modular architecture** — setiap fitur (auth, checkin, prediction) dikelompokkan dalam folder sendiri dengan file model, service, controller, routes. Ini memudahkan navigasi dan mencegah file terlalu besar.

**`documentation/` diorganisasi per divisi** — `project/` untuk dokumen umum, `fullstack/` untuk desain teknis frontend-backend, `ai-engineer/` dan `data-science/` disiapkan untuk anggota tim lain.
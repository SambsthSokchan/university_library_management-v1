# LibraryOS — Frontend (Next.js)

University Library & Financial Management System frontend built with Next.js 14, TailwindCSS, and TypeScript.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API URL
Edit `next.config.js` or create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
app/
├── layout.tsx               # Root layout (fonts, toast)
├── globals.css              # Global styles + CSS variables
├── login/
│   └── page.tsx             # Login page
└── dashboard/
    ├── layout.tsx           # Dashboard layout (sidebar)
    ├── page.tsx             # Dashboard home (stats + charts)
    ├── books/page.tsx       # Books management
    ├── members/page.tsx     # Members management
    ├── borrow/page.tsx      # Borrow & Return
    ├── fines/page.tsx       # Fines management
    ├── thesis-invoice/      # Thesis invoices
    ├── clearance/           # Clearance requests
    ├── income/              # Income transactions
    ├── expense/             # Expenses
    ├── payouts/             # Staff payouts
    ├── staff/               # Staff management (Admin only)
    └── reports/             # Reports (Admin only)

components/
└── Sidebar.tsx              # Role-based sidebar navigation

lib/
└── api.ts                   # All API calls to Spring Boot backend
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary font | Playfair Display (headings) |
| Body font | DM Sans |
| Mono font | JetBrains Mono |
| Background | #0A0A0F (ink-950) |
| Accent | #F5C842 (gold) |
| Success | #5A9E59 (sage) |
| Danger | #EF4444 (rose) |

---

## 🔐 Default Login

| Field | Value |
|---|---|
| Username | admin |
| Password | admin123 |

---

## 🔗 Backend

Make sure your Spring Boot backend is running on `http://localhost:8080`.

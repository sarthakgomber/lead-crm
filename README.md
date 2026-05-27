# Lead CRM — Mini Lead Management System

A full-stack Lead Management System built with **React**, **Node.js**, and **PostgreSQL**.

> Built as part of the Full Stack Development Internship Assignment — Sankar Group.

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, Axios         |
| Backend  | Node.js, Express        |
| Database | PostgreSQL               |
| Hosting  | Vercel (frontend + backend) + Neon/Supabase (DB) |

---

## Features

- **Add Lead** — Name, Phone, Source (Call / WhatsApp / Field)
- **View All Leads** — Grid layout with ID, date, source
- **Update Status** — Interested / Not Interested / Converted (inline dropdown)
- **Delete Lead** — With confirmation
- **Search & Filter** — By name, phone, status, source
- **Dashboard** — Live stats: total, converted, by source
- **Form Validation** — Client + server side
- **Responsive UI** — Blueprint minimalism design

---

## Project Structure

```
lead-crm/
├── backend/
│   ├── src/
│   │   ├── index.js            # Express app entry
│   │   ├── db/index.js         # PostgreSQL pool + table init
│   │   ├── routes/leads.js     # API routes
│   │   └── controllers/        # Business logic
│   ├── vercel.json
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.jsx             # Root component
    │   ├── api/leads.js        # Axios API client
    │   ├── hooks/useLeads.js   # Data fetching hook
    │   ├── components/
    │   │   ├── Dashboard.jsx   # Stats cards
    │   │   ├── AddLeadForm.jsx # Form with validation
    │   │   ├── LeadsList.jsx   # List + filters
    │   │   └── LeadCard.jsx    # Individual card
    │   └── index.css           # Global styles + blueprint theme
    ├── vercel.json
    └── package.json
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/lead-crm.git
cd lead-crm
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/lead_crm
```

Create the database in PostgreSQL:
```sql
CREATE DATABASE lead_crm;
```

Start the backend:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`  
Health check: `http://localhost:5000/health`

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

`.env` should have:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint                    | Description         |
|--------|-----------------------------|---------------------|
| GET    | `/api/leads`                | Get all leads       |
| GET    | `/api/leads?search=&status=&source=` | Filter leads |
| GET    | `/api/leads/stats`          | Get dashboard stats |
| POST   | `/api/leads`                | Add new lead        |
| PATCH  | `/api/leads/:id/status`     | Update status       |
| PUT    | `/api/leads/:id`            | Update full lead    |
| DELETE | `/api/leads/:id`            | Delete lead         |

### POST /api/leads — Request Body
```json
{
  "name": "Rahul Sharma",
  "phone": "+91 98000 00000",
  "source": "Call",
  "notes": "Interested in property"
}
```

---

## Database Schema

```sql
CREATE TABLE leads (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  source     VARCHAR(20)  NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
  status     VARCHAR(20)  NOT NULL DEFAULT 'Interested'
             CHECK (status IN ('Interested', 'Not Interested', 'Converted')),
  notes      TEXT,
  created_at TIMESTAMPTZ  DEFAULT NOW(),
  updated_at TIMESTAMPTZ  DEFAULT NOW()
);
```

---

## Deploying to Vercel

### Step 1 — Set up cloud PostgreSQL (Neon — free)

1. Go to [neon.tech](https://neon.tech) → Create account → New project
2. Create a database called `lead_crm`
3. Copy the **connection string** (looks like `postgresql://user:pass@host/dbname?sslmode=require`)

### Step 2 — Deploy Backend

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `backend`
4. Add environment variable:
   - `DATABASE_URL` = your Neon connection string
   - `FRONTEND_URL` = your frontend Vercel URL (add after frontend deploy)
5. Deploy → Copy the backend URL (e.g. `https://lead-crm-backend.vercel.app`)

### Step 3 — Deploy Frontend

1. Go to Vercel → New Project → Same repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-backend.vercel.app/api`
4. Deploy

### Step 4 — Update CORS

Go back to your **backend** project on Vercel → Settings → Environment Variables:
- Set `FRONTEND_URL` = your frontend Vercel URL
- Redeploy backend

---

## Environment Variables Summary

### Backend `.env`
```env
PORT=5000
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Submission

- GitHub Repo: [link]
- Live Demo: [link]
- Demo Video: [link]

---

Built with ◈ for Sankar Group Internship Assignment

# Development Environment & Workflow Guide

Practical setup guide for the capstone forms portal. Backend: Node/Express + MongoDB.
Frontend: React (CRA, MUI). PDF generation via PDFKit.

## 1. Prerequisites

- **Node.js 18** — the backend Dockerfile pins `node:18.18.0` (`backend/Dockerfile:1`); use Node 18 locally to match (CRA 5 also requires Node >= 14).
- **pnpm 10.11.0** — both `package.json` files declare `packageManager: pnpm@10.11.0+sha512...`. Install with `corepack enable && corepack prepare pnpm@10.11.0 --activate` (or `npm install -g pnpm@10.11.0`).
- **Docker + Docker Compose** — for the MongoDB/backend stack (optional for local dev).
- **MongoDB** — either via Docker (recommended) or a local install.

Note: both `package-lock.json` and `pnpm-lock.yaml` are committed for each app; either `npm` or `pnpm` works.

## 2. Local Dev Without Docker

### Backend (port 5100 recommended)

```powershell
cd backend
npm install        # or: pnpm install
Copy-Item .env.example .env
# edit .env, set PORT=5100 (frontend default), MONGO_URI, JWT_SECRET
npm run dev        # nodemon src/server.js  (npm start = plain node)
```

```bash
cd backend && cp .env.example .env && npm run dev
```

### Frontend (port 3000)

```powershell
cd frontend
npm install        # or: pnpm install
npm start          # react-scripts start
```

The frontend calls the API at `http://localhost:5100/api` by default
(`frontend/src/services/api.js:5`), overridable with `REACT_APP_API_URL`.
CORS is wide open (`app.use(cors())`, `backend/src/server.js:14`), so the
frontend on :3000 can hit the backend on any port. **Gotcha:** `.env.example`
sets `PORT=5000` — either change it to `5100` for local dev or set
`REACT_APP_API_URL=http://localhost:5000/api` in `frontend/.env`.

## 3. Docker-Based Setup

`docker-compose.yml` currently provides **MongoDB + backend only** — there is
**no frontend service** (no `frontend/Dockerfile` exists; only
`backend/Dockerfile`). Run the React app locally (`npm start`) and use
`REACT_APP_API_URL=http://localhost:5100/api`.

- Services: `mongodb` (image `mongo:7`, container `mongo-db`, host port `27017:27017`), `backend` (built from `./backend`, port `5100:5100`).
- Backend env comes from `env_file: ./backend/.env` — **this file must exist or `docker compose up` fails**. For Docker, `MONGO_URI` must be `mongodb://mongodb:27017/<dbname>` (service name, not `localhost`) and `PORT=5100`.
- Persistent volume: `mongo-data` (`mongo-data:/data/db`).
- Network: bridge network `app-network`.

```powershell
Copy-Item backend\.env.example backend\.env
# set MONGO_URI=mongodb://mongodb:27017/capstone, PORT=5100, JWT_SECRET
docker compose up --build
```

The backend Dockerfile uses `npm start`, so it runs without nodemon. Backend
health check: `curl http://localhost:5100/` returns
`{"message":"Server is running 🚀"}`.

## 4. Environment Variables

### Backend (`.env` in `backend/`, loaded by dotenv in `src/server.js:1`)

| Variable | Example | Consumed in | Notes |
|---|---|---|---|
| `PORT` | `5100` | `src/server.js:31` | Compose maps `5100:5100`; `.env.example` says `5000` |
| `MONGO_URI` | `mongodb://mongodb:27017/capstone` | `src/config/db.js:5`, `src/server.js:28` | Required — server exits on failure |
| `JWT_SECRET` | `your_secret_here` | `src/middleware/authMiddleware.js:10`, `src/controllers/authController.js:125`, `src/routes/adminRoutes.js:46` | Signs/verifies auth tokens |
| `EMAIL_USER` | `your_email@gmail.com` | `src/controllers/authController.js:34,206,211` | Gmail account for nodemailer (app password) |
| `EMAIL_PASS` | `your_email_password` | `src/controllers/authController.js:35,206` | Missing → forgot-password fails at `authController.js:206` |
| `FRONTEND_URL` | `http://localhost:3000` | `src/controllers/authController.js:204` | Base for reset links; defaults to `http://localhost:3000` — not in `.env.example` |

SMTP: nodemailer `service: "gmail"`, `host: smtp.gmail.com`, `port: 587`,
`secure: false` (`authController.js:28-37`). Use a Gmail app password, not the
account password.

### Frontend (`frontend/.env`, optional)

| Variable | Default | Consumed in |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5100/api` | `src/services/api.js:5`, `src/pages/BulkImport.js:150` |

## 5. Database

- Database name is whatever you put at the end of `MONGO_URI` (not hardcoded anywhere).
- Local dev against Docker Mongo (no compose needed):

```powershell
docker run -d -p 27017:27017 --name mongo-dev -v mongo-data:/data/db mongo:7
mongosh "mongodb://localhost:27017/capstone"
```

- Collections: `users`, `formtemplates`, `formsubmissions` (created by Mongoose models). List them: `mongosh "mongodb://localhost:27017/capstone" --eval "db.getCollectionNames()"`.
- **No seed script exists.** Form templates are synced lazily: the hardcoded catalog (`backend/src/catalog/hardcodedTemplateCatalog.js`) is imported into Mongo on demand by `ensureTemplateFromDefinition` (`backend/src/controllers/formController.js:1088`) when a form is fetched — they appear after the first request.

## 6. Common Dev Workflows

### Adding a new form

1. Add a template definition to `backend/src/catalog/hardcodedTemplateCatalog.js` using the helpers there (`textField`, `tableField`, `yesNoOptions`, etc.).
2. Wire it into the catalog export so `ensureTemplateFromDefinition` picks it up; see `FORM_DESIGN_STANDARDS.md` at the repo root for field/schema conventions.
3. Restart the backend (`npm run dev` picks it up) and fetch the form — the template is written to Mongo on first use.

### Running the app end-to-end

```powershell
docker compose up --build   # MongoDB + backend
cd frontend; npm start      # React app on :3000
```

Open `http://localhost:3000`, log in, browse catalog, fill and submit a form,
check submission history and PDF download.

### Testing login with a bulk-imported user

1. Admin → Bulk Import page (`/admin/bulk-import`), upload a CSV with headers `name,email,password,role` — copy `frontend/public/example.csv` (served at `http://localhost:3000/example.csv`).
2. Emails must match `@iitp.ac.in` (regex in `backend/src/utils/inputValidation.js:4`); allowed roles: `Faculty, HOD, Dean, Director` (register) plus `Admin` (admin controller). Password optional — defaults to `password`; min length 6.
3. Progress streams back over SSE (`/api/admin/bulk-import/:jobId/stream`); then log in at `/login` with the imported credentials.

## 7. Troubleshooting

- **`docker compose up` fails immediately** — `backend/.env` is missing (compose uses `env_file: ./backend/.env`). Copy `.env.example` first.
- **Backend exits with "MongoDB connection failed"** — `MONGO_URI` unset/invalid. In compose it must be `mongodb://mongodb:27017/...` (host = service name), not `localhost`.
- **Login works but API calls from the UI 404/fail** — port mismatch: backend on `5000` (`.env.example`) vs frontend default base URL `:5100`. Set `PORT=5100` or `REACT_APP_API_URL`.
- **Port conflicts** — `27017` (Mongo) or `5100` (backend) already in use: `docker ps`, or stop a local Mongo service; adjust the compose `ports` mapping if needed.
- **Forgot-password emails never send** — Gmail rejects normal passwords; use an app password, and confirm `EMAIL_USER`/`EMAIL_PASS` are set (`authController.js:206` guards this).
- **Hindi text renders as boxes in the PDF** — the Devanagari font `backend/src/assets/NotoSansDevanagari.ttf` is missing (the code `fs.existsSync`-falls back silently, `renderEstbDepartureRejoiningReportPdf.js:13`). Keep the font file in `backend/src/assets/`.

## 8. Version Pinning Status (pending task per `todo.md` §4)

- Backend `dependencies`: exact versions (no ranges) ✓ — only **devDependency `nodemon` still has `^3.0.1`**.
- Frontend: **all** `dependencies` still use `^` ranges (e.g. `react ^18.2.0`, `@mui/material ^5.15.7`); `react-scripts 5.0.1` is pinned.
- Docker base images are pinned (`node:18.18.0`, `mongo:7`) ✓; lockfiles committed ✓.
- Remaining: strip caret ranges from `frontend/package.json` and `backend/package.json` devDependencies — tracked in `todo.md` §4.

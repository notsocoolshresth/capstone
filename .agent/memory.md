# Project Memory — IIT Patna Institute Form Portal (Capstone)

## 1. Project overview and purpose

An institute form portal that replaces Word-based forms with web forms, PDF output, submission history, dynamic approval workflows, and admin-driven user management (goal set in `todo.md`). Target: 100+ forms browsable by category, styled branded PDFs, and full Docker-based deployment.

- Frontend: React SPA (CRA) with MUI v5.
- Backend: Node/Express + MongoDB (Mongoose) REST API.
- PDF: PDFKit in Node.js (WeasyPrint only planned as backup).
- Ground truth for form replication: original PDFs in `actualforms/` (40 reference files, gitignored).

## 2. Current state of the codebase

### Root
- `todo.md` — full roadmap/checklist; most product features are still unchecked (todo).
- `FORM_DESIGN_STANDARDS.md` — unified frontend + backend PDF design standards (must follow when adding forms).
- `docker-compose.yml` — mongodb + backend services (see §5).
- `test.csv` — sample bulk-import file.
- `iitp.jpg` — institute logo (present at root).
- `actualforms/` — original Word-derived PDFs used as replication reference (gitignored).
- `tools/` — **empty** directory.

### backend/ (`backend/`)
| Area | Status |
|---|---|
| Express server (`backend/src/server.js`) | Mounts `/api/auth`, `/api/forms`, `/api/submissions`, `/api/admin`; JSON limit 1mb; CORS open; connects to MongoDB before listening |
| Auth (`backend/src/controllers/authController.js`, `backend/src/routes/authRoutes.js`) | register (only `@iitp.ac.in`, roles Faculty/HOD/Dean/Director), login (JWT 7d), `/me`, `/generate-pdf`, forgot/reset password (15-min token), change-password |
| Admin (`backend/src/controllers/adminController.js`, `backend/src/routes/adminRoutes.js`) | CSV bulk user import with async job + SSE progress stream (`GET /bulk-import/:jobId/stream`, token via query param), role change; `adminOnly` middleware |
| Form templates (`backend/src/controllers/formController.js`, `backend/src/routes/formRoutes.js`) | Lazy-seeded hardcoded templates + `POST /templates` for schema-based templates; generic `GET /:templateCode/template` fallback |
| Submissions (`backend/src/controllers/submissionController.js`, `backend/src/routes/submissionRoutes.js`) | Submit (with photo upload), history, detail, pending approvals, approve/reject, PDF download |
| Models | `User.js`, `FormTemplate.js`, `FormSubmission.js` (see §5) |
| PDF renderers (`backend/src/forms/<dept>/`) | One module per form; dispatch via big if/else chain on template code in `submissionController.generateSubmissionPDF`; generic fallback `backend/src/forms/generic/renderStructuredTemplatePdf.js` |
| Template catalog (`backend/src/catalog/hardcodedTemplateCatalog.js`) | 24 hardcoded templates (cc, estb, fac, fin, guesthouse, medical, snp sections) |
| Utils | `backend/src/utils/inputValidation.js` (sanitizers/validators), `pdfStyles.js` (PDF constants/helpers), `pdfUtils.js` (getResponseValue, formatDate) |
| Middleware | `backend/src/middleware/authMiddleware.js` (JWT protect), `adminMiddleware.js` |
| Docker | `backend/Dockerfile` — `node:18.18.0`, `npm install`, exposes 5100 |

Auth is fully functional (login, forgot/reset password with nodemailer via SMTP env credentials).

### frontend/ (`frontend/`)
- CRA app (react-scripts 5.0.1), React 18, MUI v5, React Router v6, axios.
- `frontend/src/App.js` — all routes defined; auth pages: Login, Register, ForgotPassword, ResetPassword; app pages: Dashboard, Forms, FormFill, Submissions, Approvals, BulkImport, ChangePassword; plus one hardcoded `<Route>` per form component under `/forms/<code>`; dynamic fallback `/forms/:templateRef`.
- Per-form components in `frontend/src/forms/<dept>/` mirror backend renderers (e.g. `security/SecurityRequisitionForVehicleSticker.js`).
- `frontend/src/services/api.js` — axios instance, baseURL `REACT_APP_API_URL || http://localhost:5100/api`, Bearer token from `localStorage.token`, request-data sanitization.
- `frontend/src/utils/formStyles.js` (standard input styles), `frontend/src/theme/theme.js` (IBM Plex Sans, primary `#0d47a1`), `frontend/src/utils/formValidation.js`, `inputSanitizers.js`.
- Components: `PrivateRoute.js`, `Layout.js`, `AuthLayout.js`.
- No frontend Dockerfile/container yet.

## 3. Non-negotiable constraints (from `todo.md` §2)

| Constraint | Status | Notes |
|---|---|---|
| Docker-first setup | Partial | `docker-compose.yml` + backend Dockerfile exist; frontend and mailpit containers missing; no health checks |
| Exact dependency versions (no `^`/`~`) | Partial | Backend deps all pinned exact except devDep `nodemon: ^3.0.1`; frontend deps all use `^` ranges — must be pinned |
| Commit lockfiles, pin Docker base images | Partial | `backend/package-lock.json` + `frontend/package-lock.json` committed; `node:18.18.0` pinned exact; `mongo:7` not pinned to patch version |
| PDFKit primary, WeasyPrint backup | Partial | PDFKit (0.14.0) is the only generator implemented; WeasyPrint backup not yet built |
| SMTP credentials env-only | Satisfied | nodemailer uses `process.env.EMAIL_USER` / `EMAIL_PASS`; `.env` gitignored; `.env.example` committed |
| Rotate exposed SMTP passwords | Unknown | No evidence either way; treat any leaked password as needing rotation |

## 4. Key architectural decisions

- **Hardcoded template catalog + lazy DB seeding** — templates defined as JS objects (`backend/src/catalog/hardcodedTemplateCatalog.js`, plus ~25 inline constants in `formController.js`); on first GET they are `findOne` by `code` and `FormTemplate.create`d if missing (`createdBy: req.user.id`). DB stores them afterwards, but source of truth is code. New forms do NOT yet require zero code changes (todo goal C is unmet).
- **Per-department form module pattern** — `backend/src/forms/<dept>/<Form>.js` exports `render<X>Pdf(doc, submission)`; paired 1:1 with a frontend component in `frontend/src/forms/<dept>/`. Registration is manual in 3 places: `submissionController.js` (PDF dispatch), `formController.js` (template handler + route), `App.js` (route). A generic schema-driven renderer (`backend/src/forms/generic/renderStructuredTemplatePdf.js`) and dynamic `FormFill` page handle catalog/schema forms without custom renderers.
- **PDFKit renderers + `pdfStyles`/`pdfUtils` helpers** — all PDFs use Helvetica only, standardized font sizes (TITLE 16, SECTION_HEADER 13, LABEL 11, BODY 11, SMALL 10) per `FORM_DESIGN_STANDARDS.md`.
- **MUI v5 + React Router v6** — single SPA with `PrivateRoute`/`Layout` wrappers.
- **Mongoose models present** — `User`, `FormTemplate` (with embedded `fieldSchema`/`tableColumnSchema`), `FormSubmission` (with embedded `approvalLogSchema`). Missing models from todo: `FormCategory`, `WorkflowDefinition`, `ApprovalAction`.
- **JWT auth with bcryptjs** — stateless tokens (7d), role-based access checks inline in controllers/middleware.
- **Bulk import via async job + SSE** — in-memory `jobs` Map, progress streamed to admin UI.

## 5. Important technical details

- **Ports**: backend `5100` (compose maps `5100:5100`, Dockerfile EXPOSE 5100). Frontend dev default `3000` (`FRONTEND_URL || http://localhost:3000` used in reset emails). Note: `backend/.env.example` still says `PORT=5000` — override needed if reused.
- **MongoDB**: `mongo:7` image, port `27017`, persistent volume `mongo-data`, network `app-network`; backend `depends_on: mongodb`. Backend reads `MONGO_URI` from `backend/.env` (compose `env_file`).
- **Package manager**: both package.json declare `packageManager: pnpm@10.11.0+sha512...`, but the backend Dockerfile runs `npm install` and lockfiles are npm (`package-lock.json`). pnpm lockfiles are absent — do not assume pnpm is actually in use.
- **Env vars** (see `backend/.env.example`): `PORT`, `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`; frontend uses `REACT_APP_API_URL`.
- **API URL conventions**: all under `/api` — auth `/api/auth/*`, forms `/api/forms/<code>/template` (protected, lazy-seeds), submissions `/api/submissions/*`, admin `/api/admin/*`. Submission `templateId` accepts either an ObjectId or template code string.
- **User model fields**: `name`, `email` (unique, lowercase), `password` (min 6, bcrypt-hashed), `role` enum `["Faculty","HOD","Dean","Director","Admin"]` (default Faculty), `resetToken`, `resetTokenExpire`, timestamps. No `department`/`status`/active flag yet (todo D).
- **FormTemplate field types**: `text, number, date, textarea, select, radio, file, email, table`; table has `columns` (label/name/type/required/options/width) + `minRows`/`defaultRows`. Template has `approvalStages: [String]` (ordered roles, e.g. `["HOD","Dean","Director"]`).
- **FormSubmission fields**: `template` (ref), `submittedBy` (ref), `responses` (Map of Mixed), `photo` (Buffer+contentType, optional), `status` enum `draft|submitted|approved|rejected`, `version` + `parentSubmission` (ref, for "edit as new"), `approvalStages[]`, `currentStageIndex`, `approvals[]` (embedded: role, user, action approved|rejected, comment, actedAt).
- **PDF dispatch**: `GET /api/submissions/:id/pdf` picks renderer by template `code` (if/else chain); unknown codes fall back to `renderStructuredTemplatePdf`; approval history appended to PDF when present. Auth: owner or Admin/HOD/Dean/Director.
- **Approval flow**: `POST /api/submissions/:id/act` with `{action: "approved"|"rejected", comment?}`; requires the acting user's role to equal `approvalStages[currentStageIndex]`; reject sets status `rejected`, approve advances index or sets `approved`. No "send back" action yet (todo E).
- **Photo upload**: multer memory storage, 5MB limit, images only, field `responses[photo]`.
- **Catalog sections** (from `hardcodedTemplateCatalog.js`): cc, estb, fac, fin, guesthouse, medical, snp; 24 entries. `getHardcodedTemplateDefinition(code)` returns a definition or null.

## 6. Known limitations / debt / caution areas

- **Dependency ranges not pinned in frontend** (`^` on every dep) and `nodemon: ^3.0.1` in backend devDeps — violates the exact-version constraint.
- **`mongo:7` is not patch-pinned**; `node:18.18.0` is exact.
- **`PORT=5000` in `backend/.env.example`** contradicts compose/Dockerfile `5100`.
- **pnpm vs npm mismatch**: `packageManager` fields say pnpm, but Dockerfile/lockfiles use npm.
- **Approval workflow is minimal**: no WorkflowDefinition model, no send-back, no per-user approver mapping, no workflow builder UI; `approvalStages` empty for all hardcoded templates today.
- **No WeasyPrint fallback** implemented.
- **No frontend container, no mailpit container, no backend health check** in compose.
- **Forms defined as code, not pure DB schema**: adding a custom form requires touching controller, routes, PDF dispatcher, and App.js (3–4 files), despite the DB schema existing. Catalog forms (24) work via the generic route/renderer without per-form frontend components.
- **Bulk-import jobs live in an in-memory Map** (`jobs`) — lost on restart, no persistence/audit.
- **`tools/` is empty** — no scripts for seeding/catalog generation yet.
- **Some routes have duplicate/legacy paths** in `App.js` (e.g. both `/forms/cc-rd-recommendation-gem` and `/forms/computer-center-rd-recommendation-gem`; timestamp-suffixed legacy LDAP path) — be careful not to add more.
- **Template lazy-seeding mutates DB on GET** with `createdBy: req.user.id`; `getAllTemplates` also auto-creates several known templates on every call.
- **PDF layout code is hand-positioned** (absolute coordinates per form); edits to one renderer can break its PDF layout — always test by regenerating PDFs.
- **`actualforms/` is gitignored** — reference PDFs won't be in a fresh clone.

## 7. Updating this file

- **Append, never rewrite history**: add a new dated section at the end for each significant change (e.g. `## 2026-08-02 — Added X`), and only correct facts in earlier sections if they are outright wrong.
- Update status columns in §3 and §6 when constraints are completed (pin frontend versions, add WeasyPrint, add frontend container, etc.).
- Keep entries concise and factual; prefer absolute paths like `backend/src/forms/security/SecurityRequisitionForVehicleSticker.js`.

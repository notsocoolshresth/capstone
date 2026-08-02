# AGENTS.md — Operating Guide for AI Agents

Guide for AI coding agents working in this repository. Read fully before changing anything.

## 1. Repo overview

- IIT Patna institute forms portal (capstone project): replaces Word-based forms with web forms that produce PDFs, keep submission history, and support role-based approval workflows.
- `frontend/` — React 18 + Material UI 5 app (CRA/react-scripts 5). Pages in `frontend/src/pages/`, form components in `frontend/src/forms/<dept>/`, API client in `frontend/src/services/api.js`.
- `backend/` — Express 4 + Mongoose 7 API. Models in `backend/src/models/`, controllers in `backend/src/controllers/`, routes in `backend/src/routes/`, PDF renderers in `backend/src/forms/<dept>/`.
- MongoDB is the data store. Form definitions live in MongoDB (`FormTemplate`), seeded from hardcoded definitions; `hardcodedTemplateCatalog.js` (`backend/src/catalog/`) is the catalog for schema-driven forms.
- Deployment is Docker-first: `docker-compose.yml` runs `mongodb` (mongo:7) and `backend` (port 5100); the frontend is NOT containerized — run it with `npm start`.

## 2. Commands

All commands run from the repo root unless noted. There is **no lint script** and **no typecheck** in either package.json — verify changes by running the servers and the frontend build.

- Backend dev (auto-restart): `npm run dev` (runs `nodemon src/server.js`) — workdir `backend/`
- Backend prod: `npm start` (runs `node src/server.js`) — workdir `backend/`
- Frontend dev server: `npm start` (runs `react-scripts start`, port 3000) — workdir `frontend/`
- Frontend production build: `npm run build` (runs `react-scripts build`) — workdir `frontend/`
- Frontend tests: `npm test` (react-scripts test) exists in `frontend/package.json` but **no test files currently exist**; the backend has **no test script**.
- Docker stack: `docker compose up --build` from repo root (mongodb + backend only; requires `backend/.env`, see pitfalls).
- Backend needs a running MongoDB: locally set `MONGO_URI` in `backend/.env` (e.g. `mongodb://localhost:27017/<db>`), or use the compose Mongo on `localhost:27017`.

## 3. Critical constraints and conventions (non-negotiable)

- **Exact dependency versions only.** No caret (`^`) or tilde (`~`) ranges in `package.json`. Backend deps are already pinned exactly; the frontend still uses `^` (a known, tracked violation in `todo.md`), and `nodemon` is pinned `^3.0.1` in backend devDependencies — do NOT add any new ranged dependency.
- **Docker-first.** Dockerfiles and `docker-compose.yml` must stay pinned to exact base image versions (backend `Dockerfile` is `FROM node:18.18.0`, compose uses `mongo:7`). Commit lockfiles (`package-lock.json`).
- **PDF generation must use PDFKit** (`pdfkit` 0.14.0 in backend deps). WeasyPrint is only a backup concept per `todo.md`. `pdf-lib` 1.17.1 is installed but renderers use PDFKit.
- **Email (SMTP) config comes only from environment variables** (`EMAIL_USER`, `EMAIL_PASS`) — never hardcoded credentials in source files. See `backend/src/controllers/authController.js` for the pattern (falls back gracefully when env vars are absent).
- **No secrets in code or docs.** `.env`, `backend/.env`, `node_modules` are gitignored; never commit a real `.env`.
- Both package.json files declare `"packageManager": "pnpm@10.11.0+sha512.…"`. Prefer pnpm locally, but do NOT rewrite the backend `Dockerfile` (it uses `npm install`) without explicit approval.
- Mongo container: docker-compose uses `mongo:7` (exact tag), not `mongo:latest`.

## 4. How to add a new form end-to-end

Follow this exact pattern (verified against `SecurityRequisitionForVehicleSticker` and the `cc`/`snp` forms). The template `code`/`slug` is the single string that ties everything together — pick one slug and reuse it everywhere.

1. **Frontend form component** — create `frontend/src/forms/<dept>/<FormName>.js`:
   - Default-export a React function component. Import `API` from `../../services/api`, MUI components, and from `../../utils/`: `getErrorMessage`, `prepareSubmissionPayload` (`formValidation.js`), and `formContainerSx`/`formPaperSx`/`standardInputSx`/`standardInputProps` (`formStyles.js`).
   - Define `const TEMPLATE_SLUG = "/<slug>/template"` — must match the backend route exactly (e.g. `/security_requisition_for_vehicle_sticker/template`). Fetch the template on mount with `API.get(TEMPLATE_SLUG)` and store `data._id`.
   - `initialValues` keys MUST match the backend template field `name`s exactly.
   - Submit via `POST /submissions` using `prepareSubmissionPayload({ templateId, templateSlug: TEMPLATE_SLUG, responses: values, parentSubmissionId })`; support `location.state.prefill` for "edit as new". PDF button: `API.get(`/submissions/${id}/pdf`, { responseType: "blob" })`, open blob in new tab.
   - Use MUI `standard` variant inputs (`standardInputProps`), not `outlined`.
2. **Register the route** in `frontend/src/App.js`: add `<Route path="/forms/<slug>" element={…<YourForm />}>` inside `PrivateRoute`/`Layout`, placed BEFORE the catch-all `<Route path="/forms/:templateRef">` (FormFill).
3. **Backend template definition** — pick ONE of:
   - *Catalog (recommended for new forms):* add `{ code, title, description, section, approvalStages: [], fields }` to `MISSING_HARDCODED_TEMPLATES` in `backend/src/catalog/hardcodedTemplateCatalog.js`. Use the helpers `textField(label, name, { type, required, options, section, … })` and `tableField(label, name, columns, { section, defaultRows })`. No route needed — the catch-all `GET /api/forms/:templateCode/template` (`getHardcodedCatalogTemplate`) syncs and serves it, and `getAllTemplates` → `ensureMissingHardcodedTemplates` seeds it into MongoDB on first catalog load.
   - *Explicit controller:* define a `const X_TEMPLATE = { code, title, …, fields }` in `backend/src/controllers/formController.js`, add a `getXTemplate` handler (findOne by code, create if missing, return json), export it, then add `router.get("/<slug>/template", protect, getXTemplate)` in `backend/src/routes/formRoutes.js` and an `ensure` block in `getAllTemplates`.
   - Field `type` must be one of: `text | number | date | textarea | select | radio | email | file | table` (see `FormTemplate.js`). `select`/`radio` need `options`.
4. **Backend PDF renderer** — create `backend/src/forms/<dept>/<FormName>.js`:
   - `module.exports = { render<Name>Pdf };` where `render<Name>Pdf = (doc, submission) => { … }`. Read values with `getResponseValue(submission.responses, "fieldName")` (handles Mongoose Map) and `formatDate(...)` from `../../utils/pdfUtils`; use font sizes via `pdfStyles.getFontSize("TITLE"|"SECTION_HEADER"|"LABEL"|"BODY"|"SMALL")` from `../../utils/pdfStyles`; Helvetica/Helvetica-Bold only. Do NOT call `doc.end()` inside the renderer — the controller owns the PDF lifecycle.
5. **Register the renderer** in `backend/src/controllers/submissionController.js` `generateSubmissionPDF`: add a `const <NAME>_CODE = "<slug>"`, a `const is<Name> = templateCode === <NAME>_CODE` flag, optionally a margin branch in the `new PDFDocument({ margin, size: "A4" })` ternary, and an `else if (is<Name>) { render<Name>Pdf(doc, submission); }` branch before the fallback `renderStructuredTemplatePdf(doc, submission)` (generic schema-driven renderer used for any unregistered code — a form that is fillable but prints a generic PDF if step 5 is skipped).

## 5. Code style conventions

- **Backend is CommonJS**: `require(...)` / `module.exports = { … }`. No ESM/`import` in backend files.
- **Frontend is ESM**: `import`/`export default`. MUI `sx` styling inline, styled via `formStyles.js` constants. Two-space indent, double quotes, semicolons (both sides).
- **Controllers**: async handlers `(req, res)`, wrapped in try/catch; success = `res.status(2xx).json(data)`, failure = `res.status(4xx/5xx).json({ message })`; log with `console.error(error)` before 500s. Controllers are mounted in `server.js` under `/api/*` (auth, forms, submissions, admin).
- **Routes**: `express.Router()`, JWT guard `protect` from `middleware/authMiddleware.js` (reads `Bearer` token, sets `req.user = { id, role }`), plus `adminOnly` for admin endpoints.
- **PDF flow** (owner: `submissionController.generateSubmissionPDF`): create `new PDFDocument({ size: "A4", margin })`, set `Content-Type: application/pdf` + `Content-Disposition` headers, `doc.pipe(res)`, call a renderer, append approval history, then `doc.end()`.
- **Validation is centralized** in `backend/src/utils/inputValidation.js`: submissions go through `extractSubmissionPayload` then `sanitizeAndValidateResponses(template, responses)` (required checks, select/radio options matching, email/date/number/phone/aadhaar/roll-number rules keyed off field type and label/name heuristics). Never write ad-hoc per-form validation in a controller; extend `inputValidation.js` if new field rules are needed.
- **Admin routes** (`adminRoutes.js`): CSV bulk import via multer memory storage (5 MB, .csv only) + SSE progress stream (token via query param for EventSource).

## 6. Pitfalls and warnings

- **The slug/code string must match in 4 places**: frontend `TEMPLATE_SLUG`, frontend route path in `App.js`, backend `code` in the template definition, and the `…_CODE` constant in `submissionController.js`. A mismatch shows up as "Template not found" or a generic structured PDF.
- **Catalog definitions overwrite the DB copy**: `ensureTemplateFromDefinition` in `formController.js` replaces the stored template's `fields`/`title`/`section`/`approvalStages` whenever the definition differs (`templatesMatchDefinition`), on every `getAllTemplates` or catalog fetch. Existing submissions keep their own response snapshot, but changing a catalog definition silently rewrites the live template. Some explicit-controller templates instead only create-if-missing and prune stale fields — check which pattern you're editing.
- **Frontend `initialValues` must exactly match template field names**; server-side required-field validation rejects submissions whose required fields are missing, so keep `canSubmit` checks in sync.
- **Validation is field-type driven** in `utils/inputValidation.js`; label/name heuristics (e.g. `isEmailField`, `isAadhaarField`, `isRollNumberField`) will start applying rules if your labels contain "email", "mobile", "aadhar", "rollno", etc. Verify new fields against `getFieldMaxLength` (default 500 chars) and date format `YYYY-MM-DD`.
- **Logo asset path**: `iitp.jpg` lives at the repo ROOT and is referenced from backend as `path.resolve(__dirname, "../../../iitp.jpg")` (authController) — don't move it or break the relative path.
- **Ports**: backend listens on `process.env.PORT` (`.env.example` says 5000), but docker-compose maps host `5100:5100` and the frontend axios baseURL defaults to `http://localhost:5100/api` (`REACT_APP_API_URL` overrides). For local dev, set `PORT=5100` in `backend/.env` or the frontend won't reach the API.
- **`docker compose up` fails without `backend/.env`** (`env_file: ./backend/.env`). Create it from `backend/.env.example` first. `.env.example` is only a template — `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`.
- **Templates are seeded lazily**: the DB is empty until `GET /api/forms/templates` runs (`getAllTemplates` seeds hardcoded + catalog templates). A fresh DB + direct submission attempt will 404 on template lookup.
- **`frontend/src/services/api.js` auto-sanitizes request bodies** via `utils/inputSanitizers.js` and injects the JWT from `localStorage`; don't bypass it with raw axios in form code.
- **Approvals**: submissions are only approvable if the template has `approvalStages` (array of role names). Leave `[]` for forms without workflows.
- **SSE admin import** reads the token from the query string — do not remove that fallback.

## 7. Do-not-do list

- Never hardcode SMTP credentials, JWT secrets, or any password/API key in source files, tests, or documentation (including this guide).
- Never commit `.env` or `backend/.env` (gitignored); never commit real credential values anywhere.
- Do not add caret/tilde ranges to `package.json` dependencies; never delete `package-lock.json`.
- Do not change pinned Docker base image tags (`node:18.18.0`, `mongo:7`) or switch the backend build to another package manager.
- Do not write per-form server-side validation in controllers — extend `backend/src/utils/inputValidation.js` instead.
- Do not call `doc.end()`/`doc.pipe()` inside a PDF renderer (the controller does that), and do not use custom fonts in PDFs (Helvetica only, per `FORM_DESIGN_STANDARDS.md`).
- Don't create new template fields as inline literal objects in routes; keep template definitions in `formController.js` or `hardcodedTemplateCatalog.js`.

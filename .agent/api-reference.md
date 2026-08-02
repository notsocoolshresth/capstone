# IIT Patna Forms Portal — API Reference

Backend: Express + Mongoose. All routes verified against source in `backend/src`.

## 1. Base URL & Conventions

- Default base URL: `http://localhost:5100/api` (frontend default; overridable via `REACT_APP_API_URL`).
- Mount points (`backend/src/server.js`): `/api/auth`, `/api/forms`, `/api/submissions`, `/api/admin`.
- All requests/responses are JSON (`Content-Type: application/json`); request body limit 1 MB; CORS enabled.
- **Authentication**: JWT Bearer token. Send `Authorization: Bearer <token>`.
  - Token payload: `{ id, role }`, expiry 7 days, signed with `JWT_SECRET`.
  - Missing/invalid token → `401 { "message": "Not authorized, no token" | "Not authorized, token failed" }` (`authMiddleware.js`).
  - Admin check (`adminMiddleware.js`) → `403 { "message": "Admin access required" }`.
- **Error shape** (all controllers): `{ "message": string }`, extended for: submission validation (`errors: [...]`), register invalid role (`allowedRoles: [...]`), forgot-password fallback (`resetURL`, `emailSent`), bulk-import response (`jobId`, `total`).
- **Roles**: `Faculty`, `HOD`, `Dean`, `Director`, `Admin` (`models/User.js`). Public register allows only Faculty/HOD/Dean/Director.
- Emails must be `@iitp.ac.in`; passwords ≥ 6 characters.
- Access levels: **Public** (no token), **Auth** (any logged-in user), **Admin** (role `Admin`).

## 2. Auth Endpoints (`/api/auth`)

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Auth | Current user profile |
| GET | `/api/auth/generate-pdf` | Auth | Profile PDF download |
| POST | `/api/auth/forgot-password` | Public | Send reset link (15 min expiry) |
| POST | `/api/auth/reset-password/:token` | Public | Set new password with token |
| POST | `/api/auth/change-password` | Auth | Change own password |

### POST /api/auth/register
Body: `{ "name": "...", "email": "x@iitp.ac.in", "password": "secret1", "role": "Faculty" }` (`role` optional, one of `Faculty|HOD|Dean|Director`).

```bash
curl -X POST http://localhost:5100/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Amit Kumar","email":"amit@iitp.ac.in","password":"secret1","role":"Faculty"}'
```

- `201` → `{ "message": "User registered successfully" }`
- `400` → missing fields / invalid email / invalid role (`allowedRoles` included) / password < 6 chars / `"User already exists"` / Mongoose validation
- `403` → non-`@iitp.ac.in` email

### POST /api/auth/login
Body: `{ "email": "amit@iitp.ac.in", "password": "secret1" }`

- `200` → `{ "message": "Login successful", "token": "<jwt>" }`
- `400` → missing fields / invalid email / `"Invalid credentials"`
- `403` → non-`@iitp.ac.in` email

### GET /api/auth/me
```bash
curl http://localhost:5100/api/auth/me -H "Authorization: Bearer <token>"
```
- `200` → user document without password: `{ "_id", "name", "email", "role", "createdAt", "updatedAt", ... }`; `401` → missing/invalid token

### GET /api/auth/generate-pdf
- `200` → `application/pdf`, `Content-Disposition: attachment; filename=profile.pdf` (PDFKit stream; logo from `iitp.jpg` at repo root if present).

### POST /api/auth/forgot-password
Body: `{ "email": "amit@iitp.ac.in" }`

- `200` → `{ "message": "Password reset email sent", "emailSent": true }`; if `EMAIL_USER`/`EMAIL_PASS` not configured → `{ "message": "Password reset link generated", "resetURL": "<frontend>/reset/<token>", "emailSent": false }`
- `400` / `403` → invalid/foreign email; `404` → `"User not found"`; `500` → SMTP auth failure (`EAUTH`)

### POST /api/auth/reset-password/:token
Body: `{ "password": "newpass1" }` (token from the reset link; hashed SHA-256; valid 15 min).

- `200` → `{ "message": "Password reset successful" }`
- `400` → password required / < 6 chars / `"Invalid or expired token"`

### POST /api/auth/change-password
Body: `{ "currentPassword": "old", "newPassword": "newpass1" }`

- `200` → `{ "message": "Password changed successfully" }`
- `400` → missing fields, new password < 6 chars, new === current, `"Current password is incorrect"`
- `404` → user not found

## 3. Form (Template) Endpoints (`/api/forms`) — all Auth

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/forms/templates` | Auth | Create custom template |
| GET | `/api/forms/templates` | Auth | List all templates (auto-seeds hardcoded ones) |
| GET | `/api/forms/templates/me` | Auth | Templates created by current user |
| GET | `/api/forms/:slug/template` | Auth | Named hardcoded template (list below) |
| GET | `/api/forms/:templateCode/template` | Auth | Catch-all: catalog lookup by code |

Template document shape: `{ _id, code, title, description, section, fields[], approvalStages[], createdBy, isActive, createdAt, updatedAt }`, where each field is `{ label, name, type, required, options[], section, placeholder, helperText, minRows, defaultRows, columns[] }`. Field types: `text | number | date | textarea | select | radio | file | email | table`.

### POST /api/forms/templates
Body: `{ "title": "...", "description": "...", "section": "...", "fields": [{ "label": "...", "name": "...", "type": "text", "required": true }], "approvalStages": ["HOD", "Dean"] }` (payload sanitized by `sanitizeTemplatePayload`).

- `201` → created template; `400` → `"Title and fields required"`; `500` → `"Failed to create template"`

### GET /api/forms/templates
- `200` → array of all templates, populated `createdBy` (name, email), sorted by `createdAt` descending. Also ensures every hardcoded template exists in DB.

### Named template slugs (GET `/api/forms/<slug>/template`)
Template is returned (created on first access if missing). Unknown slug → `404 { "message": "Template not found" }`.

| Slug | Code |
|---|---|
| `general-administration-self-declaration/template` | `gen-admin` |
| `general-administration-vehicle-requisition-transport/template` | `gen-admin-vehicle-requisition-transport` |
| `security-campus-leave-permission-female/template` | `security-campus-leave-female` |
| `security-day-scholar-vehicle-permit/template` | `security-day-scholar-vehicle-permit` |
| `security-mess-workers/template` | `security-mess-workers` |
| `security-pass-renewal/template` | `security-pass-renewal` |
| `security-entry-pass/template` | `security-entry-pass` |
| `security_requisition_for_vehicle_sticker/template` | `security_requisition_for_vehicle_sticker` |
| `security-vehicle-sticker-requition-for-married-scholar/template` | `security-vehicle-sticker-requition-for-married-scholar` |
| `security_undertaking_regarding_worker_conduct_and_responsibility/template` | `security_undertaking_regarding_worker_conduct_and_responsibility` |
| `computer-center-ldap-account-request/template` | `cc-ldap-account-request` |
| `estb-departure-rejoining-report/template` | `estb-departure-rejoining-report` |
| `estb-house-allotment-d-type/template` | `estb-house-allotment-d-type` |
| `finance-procurement-recommendation-sanction-double-bid-inr/template` | `finance-procurement-recommendation-sanction-double-bid-inr` |
| `finance-travelling-allowance-bill/template` | `finance-travelling-allowance-bill` |
| `computer-center-faculty-performa/template` | `cc-faculty-performa` |
| `computer-center-faculty-declaration/template` | `cc-faculty-declaration` |
| `computer-center-email-account-request/template` | `cc-email-account-request` |
| `computer-center-proxy-ldap-request/template` | `cc-proxy-ldap-request` |
| `computer-center-rd-recommendation-gem/template` | `cc-rd-recommendation-gem` |
| `computer-center-rd-two-bid-gem/template` | `cc-rd-two-bid-gem` |
| `stores-stationery-indent/template` | `stores-stationery-indent` |

### GET /api/forms/:templateCode/template (catch-all catalog)
Resolves codes from `catalog/hardcodedTemplateCatalog.js` (`MISSING_HARDCODED_TEMPLATES`, 24 entries), e.g. `cc-network-extension-requisition`, `estb-ltc-application-teaching`, `faculty-conference-assistance`, `finance-contingency-grant`, `guest-house-accommodation-request`, `medical-opd-treatment-claim`, `snp-purchase-indent`, `snp-central-store-requisition-slip`. Definition is upserted into DB; unknown code → `404`.

## 4. Submission Endpoints (`/api/submissions`) — all Auth

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/submissions` | Auth | Create submission (multipart, optional photo) |
| GET | `/api/submissions/me` | Auth | My submission history |
| GET | `/api/submissions/pending/list` | Auth | Submissions pending at my role's stage |
| GET | `/api/submissions/:id` | Auth | Single submission (owner or Admin/HOD/Dean/Director) |
| POST | `/api/submissions/:id/act` | Auth | Approve/reject (current-stage approver) |
| GET | `/api/submissions/:id/pdf` | Auth | Generate/download PDF (owner or privileged) |

Route order matters: `/me` and `/pending/list` are matched before `/:id`.

### POST /api/submissions
`multipart/form-data`. The photo file is uploaded under the field name **`responses[photo]`** (only `image/jpeg|jpg|png|webp`, ≤ 5 MB, multer memory storage). Text fields can be sent as a JSON `responses` object or as individual `responses[<fieldName>]` form keys (`extractSubmissionPayload`). Top-level fields:

| Field | Required | Notes |
|---|---|---|
| `templateId` | yes | MongoDB ObjectId **or** template code string |
| `responses` | yes | object of field-name → value (required fields enforced, type/date/email/phone/Aadhaar/roll-no validated) |
| `parentSubmissionId` | no | creates a new version (version = parent.version + 1); parent must belong to the user |
| `responses[photo]` | no | file part (image only) |

```bash
curl -X POST http://localhost:5100/api/submissions \
  -H "Authorization: Bearer <token>" \
  -F "templateId=security-mess-workers" \
  -F 'responses={"hostelName":"Himalaya","vendorName":"XYZ Caterers","worker1Name":"Raj","worker1Aadhar":"123456789012"}' \
  -F "responses[photo]=@photo.jpg;type=image/jpeg"
```

- `201` → submission document: `{ _id, template, submittedBy, responses, photo, status: "submitted", version, parentSubmission, approvalStages, currentStageIndex: 0, approvals: [], createdAt, updatedAt }`
- `400` → `{ "message": "Template and responses required" }`; validation errors `{ "message": "<first error>", "errors": [...] }`; `"Invalid parent submission id"`; `"Only image uploads are allowed"` (multer)
- `404` → template not found / parent submission not found for user

### GET /api/submissions/me
- `200` → array of user's submissions, populated `template` (`title, description, approvalStages, code`), newest first.

### GET /api/submissions/pending/list
- `200` → submissions with `status: "submitted"` where the role at `currentStageIndex` of `approvalStages` equals the caller's role. Populates `template` and `submittedBy`.
- `400` → user has no role.

### GET /api/submissions/:id
- `200` → submission populated with `template` (fields), `submittedBy` (name, email, role), `approvals.user`.
- `403` → not owner and not Admin/HOD/Dean/Director; `404` → not found.

### POST /api/submissions/:id/act
Body: `{ "action": "approved" | "rejected", "comment": "optional (≤ 1000 chars)" }`

- `200` → updated submission. `approved` advances `currentStageIndex` (last stage → `status: "approved"`); `rejected` sets `status: "rejected"`. Approval log entry `{ role, user, action, comment, actedAt }` appended.
- `400` → invalid action / not pending / comment too long; `403` → caller is not the current-stage approver; `404` → not found.

### GET /api/submissions/:id/pdf
- `200` → `application/pdf`, `Content-Disposition: attachment; filename=form-<id>.pdf` (see §7).
- `403` → not owner / not privileged; `404` → not found.

## 5. Admin Endpoints (`/api/admin`) — all Admin except the SSE stream (token via query)

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/admin/bulk-import` | Admin | Upload CSV to bulk-create users (async) |
| GET | `/api/admin/bulk-import/:jobId/stream` | Admin (SSE) | Progress stream for an import job |
| PATCH | `/api/admin/change-role` | Admin | Change a user's role |

### POST /api/admin/bulk-import
`multipart/form-data`, single file under field name **`file`** — must be `.csv` (mimetype `text/csv` or `.csv` extension), ≤ 5 MB. CSV columns: `name, email, role` (password optional; default `password`). Role defaults to `Faculty`; allowed `Faculty|HOD|Dean|Director|Admin`.

```bash
curl -X POST http://localhost:5100/api/admin/bulk-import \
  -H "Authorization: Bearer <admin-token>" \
  -F "file=@users.csv"
```

- `202` → `{ "jobId": "<uuid>", "total": <rowCount> }` — rows processed asynchronously
- `400` → no file / `"Invalid CSV format: ..."` / empty CSV / non-CSV file
- `401` / `403` → not authenticated / not Admin

### GET /api/admin/bulk-import/:jobId/stream
Server-Sent Events (EventSource cannot send headers, so **auth is via `?token=` query param** or `Authorization` header; role must be Admin). Content type `text/event-stream`.

```bash
curl -N "http://localhost:5100/api/admin/bulk-import/<jobId>/stream?token=<admin-token>"
```

Events (`data: <json>\n\n`):
- `{ "type": "row", "row": n, "name": "...", "email": "...", "status": "success" | "failed", "reason": "...", "total": N }` (per row; reasons: missing fields, invalid/foreign email, invalid role, duplicate, short password)
- `{ "type": "complete", "created": n, "failed": n, "total": N }`

- `404` → `{ "message": "Job not found or has expired" }` (jobs deleted 10 min after completion); `401`/`403` on bad token/role.

### PATCH /api/admin/change-role
Body: `{ "email": "user@iitp.ac.in", "role": "HOD" }` (role: `Faculty|HOD|Dean|Director|Admin`)

```bash
curl -X PATCH http://localhost:5100/api/admin/change-role \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"amit@iitp.ac.in","role":"HOD"}'
```

- `200` → `{ "message": "Role updated to \"HOD\" for amit@iitp.ac.in", "user": { "name", "email", "role" } }`
- `400` → missing fields / invalid email / invalid role (allowed values listed) / already that role; `403` → non-iitp email; `404` → no user with that email

## 6. PDF Generation

No PDFs are persisted to disk — each is rendered on demand with PDFKit and **streamed** to the HTTP response.

| Endpoint | Access | File name | Renderer |
|---|---|---|---|
| `GET /api/auth/generate-pdf` | Auth | `profile.pdf` | Inline profile PDF (`authController.generateProfilePdf`) |
| `GET /api/submissions/:id/pdf` | Auth (owner or Admin/HOD/Dean/Director) | `form-<submissionId>.pdf` | Per-form renderer in `backend/src/forms/<section>/`, dispatched by `template.code` in `submissionController.generateSubmissionPDF` |

- Response headers for both: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename=...`
- Submission PDF dispatch: each hardcoded template code has a matching renderer (e.g. `gen-admin` → `forms/genadmin/pdfGenerator.js`, `security-mess-workers` → `forms/security/SecurityMessWorkers.js`, `cc-faculty-performa` → `forms/cc/ComputerCenterFacultyPerformaForm.js`, `stores-stationery-indent` → `forms/snp/StoreStationeryIndentPdf.js`). Unknown/custom templates fall back to the generic renderer `forms/generic/renderStructuredTemplatePdf.js`, which walks the template `fields` array. If the submission has approval history, the PDF appends an "Approval History" section (role, action, date, comment). Frontend fetches with `responseType: "blob"` and saves client-side.

```bash
curl -o form.pdf http://localhost:5100/api/submissions/<id>/pdf \
  -H "Authorization: Bearer <token>"
```

## 7. Frontend ↔ Backend Parity

`frontend/src/services/api.js` uses baseURL `http://localhost:5100/api`, attaches `Authorization: Bearer <token>` from `localStorage` (skips sanitizing `FormData` payloads), and calls (verified against route files):
- Auth: `/auth/register`, `/auth/login`, `/auth/me`, `/auth/generate-pdf`, `/auth/forgot-password`, `/auth/reset-password/:token`, `/auth/change-password`
- Forms: `/forms/templates`, all named template slugs
- Submissions: `/submissions`, `/submissions/me`, `/submissions/pending/list`, `/submissions/:id/pdf`, `/submissions/:id/act`
- Admin: `/admin/bulk-import`, `/admin/change-role` (+ SSE stream via query token)

**All endpoints the frontend expects are implemented by the backend** — no gaps were found between `frontend/src/services/api.js` call sites and the route registrations.

Notes / quirks:
- `GET /submissions/pending/list` and `GET /submissions/me` must be requested before `GET /submissions/:id` in any client matching logic (Express route order already handles this).
- Bulk-import SSE requires the token in the `?token=` query string (EventSource limitation); the photo upload is only supported on `POST /submissions` under the exact field name `responses[photo]`; registration never accepts the `Admin` role (only login + admin `change-role` can produce one).

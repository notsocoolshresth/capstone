# Capstone Portal — Data Model

Verified against `backend/src/models/*.js`, `backend/src/controllers/*.js`, `backend/src/config/db.js`, `backend/src/catalog/hardcodedTemplateCatalog.js`, and `backend/.env`.

## 1. MongoDB connection

- Driver: Mongoose (`mongoose.connect(process.env.MONGO_URI)`, see `backend/src/config/db.js`).
- URI: read from `MONGO_URI` env var. Local example (`.env`): `mongodb+srv://<user>:<pass>@cluster.5lcbpxm.mongodb.net/AI_APP` → database name **`AI_APP`**, MongoDB Atlas, default port 27017.
- API server port: `PORT` env (`backend/.env` = 5100, `.env.example` = 5000).
- No `dbName` override, no indexes declared beyond schema-level ones.

Collections (Mongoose pluralization of the model names below):

| Collection | Model |
|---|---|
| `users` | User |
| `formtemplates` | FormTemplate |
| `formsubmissions` | FormSubmission |

## 2. Models

### 2.1 User (`backend/src/models/User.js`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | String | Yes | trimmed |
| `email` | String | Yes | **unique**, lowercased; must match `@iitp.ac.in` on create/import (`EMAIL_REGEX`, `IITP_EMAIL_REGEX` in `inputValidation.js`) |
| `password` | String | Yes | `minlength: 6`; hashed with bcrypt (cost 10) at creation (`adminController.js`) |
| `role` | String | No | enum `["Faculty","HOD","Dean","Director","Admin"]`, default `"Faculty"` |
| `resetToken` | String | No | password-reset token |
| `resetTokenExpire` | Date | No | |
| `createdAt`/`updatedAt` | Date | — | `timestamps: true` |

> Note: **no `status`/`isActive` field exists** on User yet. The enum value `"draft"` in submission schema is unused (see §5).

### 2.2 FormTemplate (`backend/src/models/FormTemplate.js`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `code` | String | No | `trim`, default `""`, **indexed**; used to look up templates (`findOne({ code })`) and by PDF renderers |
| `title` | String | Yes | `trim` |
| `description` | String | No | default `""` |
| `section` | String | No | `trim`, default `""` (category, e.g. `security`, `fin`, `cc`) |
| `fields` | Array of Field | No | form schema (below) |
| `approvalStages` | Array of String | No | ordered role list, e.g. `["HOD","Dean","Director"]` |
| `createdBy` | ObjectId → `User` | Yes | |
| `isActive` | Boolean | No | default `true` (declared but not currently read/written by controllers) |
| `createdAt`/`updatedAt` | Date | — | `timestamps: true` |

**Field sub-document** (`fieldSchema`):

| Field | Type | Required | Notes |
|---|---|---|---|
| `label` | String | Yes | |
| `name` | String | Yes | unique key for responses |
| `type` | String | No | enum `["text","number","date","textarea","select","radio","file","email","table"]`, default `"text"` |
| `required` | Boolean | No | default `false` |
| `options` | Array of String | No | for select/radio |
| `section` | String | No | default `""` (visual grouping) |
| `placeholder` | String | No | default `""` |
| `helperText` | String | No | default `""` |
| `minRows` | Number | No | default `0` |
| `defaultRows` | Number | No | default `0` (table fields default to 1 via catalog) |
| `columns` | Array of TableColumn | No | for `type: "table"` |

**TableColumn sub-document** (`tableColumnSchema`, `_id: false`):

| Field | Type | Required | Notes |
|---|---|---|---|
| `label` | String | Yes | |
| `name` | String | Yes | |
| `type` | String | No | enum `["text","number","date","textarea","select","radio","file","email"]`, default `"text"` |
| `required` | Boolean | No | default `false` |
| `options` | Array of String | No | default `[]` |
| `width` | String | No | default `""` |

### 2.3 FormSubmission (`backend/src/models/FormSubmission.js`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `template` | ObjectId → `FormTemplate` | Yes | always the real template `_id` (never code) |
| `submittedBy` | ObjectId → `User` | Yes | |
| `responses` | Map of Mixed | Yes | field-name → value snapshot; sanitized before save |
| `photo` | Object | No | `{ data: Buffer, contentType: String }`, both default `null`; single image upload (JPG/PNG/WEBP ≤ 5 MB) |
| `status` | String | No | enum `["draft","submitted","approved","rejected"]`, **default `"submitted"`** |
| `version` | Number | No | default `1`; incremented on resubmission (`parentSubmission.version + 1`) |
| `parentSubmission` | ObjectId → `FormSubmission` | No | default `null`; "edit as new" lineage |
| `approvalStages` | Array of String | No | **copied from template at submit time** (snapshot) |
| `currentStageIndex` | Number | No | default `0`; pointer into `approvalStages` |
| `approvals` | Array of ApprovalLog | No | default `[]` |
| `createdAt`/`updatedAt` | Date | — | `timestamps: true` |

**ApprovalLog sub-document** (`approvalLogSchema`, `_id: false`):

| Field | Type | Required | Notes |
|---|---|---|---|
| `role` | String | Yes | the acting role |
| `user` | ObjectId → `User` | Yes | |
| `action` | String | Yes | enum `["approved","rejected"]` |
| `comment` | String | No | default `""`; sanitized, max 1000 chars |
| `actedAt` | Date | No | default `Date.now` |

Example submission document:

```js
{
  template: ObjectId("..."),            // ref FormTemplate
  submittedBy: ObjectId("..."),         // ref User
  responses: {
    salutation: "Dr.", fullName: "A. Sharma",
    declarationDate: "2026-07-30", companions: ["x", "y"]
  },
  photo: { data: Buffer, contentType: "image/jpeg" },
  status: "submitted",
  version: 2,
  parentSubmission: ObjectId("...") | null,
  approvalStages: ["HOD", "Dean"],
  currentStageIndex: 1,
  approvals: [
    { role: "HOD", user: ObjectId("..."), action: "approved",
      comment: "OK", actedAt: ISODate() }
  ],
  createdAt: ISODate(), updatedAt: ISODate()
}
```

## 3. Hardcoded template catalog

Two sources of built-in templates:

1. **Inline constants in `formController.js`** (e.g. `GEN_ADMIN_TEMPLATE`, `SECURITY_ENTRY_PASS_TEMPLATE`) — lazily persisted on first request via `findOne({code})` → else `FormTemplate.create({...def, createdBy: req.user.id})`.
2. **`backend/src/catalog/hardcodedTemplateCatalog.js`** — exports `MISSING_HARDCODED_TEMPLATES` (~25 definitions) and `getHardcodedTemplateDefinition(code)`. `ensureTemplateFromDefinition` (formController.js:1080) creates a missing template, or **overwrites title/description/section/fields/approvalStages of the existing doc** if it no longer matches the definition (`templatesMatchDefinition`). `ensureMissingHardcodedTemplates` is called to backfill all catalog entries.

Entry shape — same as a FormTemplate minus `createdBy`:

```js
{
  code: "cc-network-extension-requisition",
  title: "Network Extension Requisition Form",
  description: "Computer Centre requisition form ...",
  section: "cc",
  approvalStages: [],                       // always [] in the catalog
  fields: [
    { label: "Name", name: "requesterName", type: "text", required: true,
      section: "Requester Details", placeholder: "", helperText: "",
      minRows: 0, defaultRows: 0, options: [], columns: [] },
    { label: "Detailed Estimate Items", name: "detailedEstimateItems",
      type: "table", required: false, section: "Detailed Estimate",
      minRows: 1, defaultRows: 1,
      columns: [
        { label: "Item name", name: "itemName", type: "text", required: false,
          options: [], width: "" },
        { label: "QTY", name: "quantity", type: "number", required: false,
          options: [], width: "" }
      ] }
  ]
}
```

Helpers: `textField(label, name, opts)` normalizes a field; `tableField(...)` builds a `type:"table"` field with `minRows`/`defaultRows` ≥ 1. Known `section` values: `genadmin`, `security`, `estb`, `cc`, `fin`, `fac`, `snp`, `stores`, `guesthouse`, `medical`.

## 4. Relationships

```
User (1) ──submits──> (N) FormSubmission.submittedBy
FormTemplate (1) ──has──> (N) FormSubmission.template
FormSubmission (1) ──parent──> (0..1) FormSubmission.parentSubmission
FormSubmission.approvals[].user ──> User
FormTemplate.createdBy ──> User
```

- `submissionController.submitForm` resolves `templateId` (ObjectId **or** template `code` string) to the template `_id` before saving.
- Queries populate: `template` (`title description approvalStages code` / `fields`), `submittedBy` (`name email role`), `approvals.user` (`name email role`).

## 5. Status / state values

**Submission `status`** (enum): `draft`, `submitted`, `approved`, `rejected`.

- `submitted` — set on every create (`submitForm`). Default.
- `submitted` → `approved` — `actOnSubmission` advances `currentStageIndex`; when the last stage approves, status becomes `approved`.
- `submitted` → `rejected` — any approver rejects.
- `draft` — **declared in the enum but never written by any controller** (no draft-save flow exists yet).
- `actOnSubmission` rejects actions when status ≠ `submitted`; `getPendingApprovals` matches `status: "submitted"` AND `approvalStages[ currentStageIndex ] === req.user.role`.

**Approval log `action`** (enum): `approved`, `rejected`.

**User**: no status field. Effective state is `role`; access control compares against `["Admin","HOD","Dean","Director"]` (privileged) vs. owner. Role changes via `adminController.changeRole` (validated against the 5-role enum).

**Template**: `isActive` exists (default true) but no controller reads/writes it — hardcoded/catalog templates are effectively always active.

## 6. CSV bulk-import contract

`adminController.bulkImport` parses CSV with `columns: true` (header row) and expects columns: **`name`, `email`, `role`, `password`**.

Per-row rules (`processRows`):

| Column | Required | Validation |
|---|---|---|
| `name` | Yes | non-empty after sanitize |
| `email` | Yes | `EMAIL_REGEX` + **must end `@iitp.ac.in`** (`IITP_EMAIL_REGEX`) |
| `role` | No | default `"Faculty"`; else must case-insensitively match `Faculty/HOD/Dean/Director/Admin` |
| `password` | No | default `"password"`; `minlength: 6`; bcrypt-hashed (cost 10) |

Duplicates by email are rejected ("A user with this email already exists"). Import is async: `POST` returns `{jobId, total}`, progress streamed via SSE (`bulkImportStream`).

> ⚠️ `frontend/public/example.csv` uses `@college.edu` addresses — these would be **rejected** by the current `@iitp.ac.in` rule in code.

Example (must pass the iitp rule):

```csv
name,email,password,role
Jane Smith,jane@iitp.ac.in,pass123,Faculty
Bob Dean,bob@iitp.ac.in,pass123,HOD
```

## 7. Data integrity notes (as implemented)

- **No delete/remove operations exist** in `backend/src/` (no `deleteOne`/`findByIdAndDelete`/`remove`). Templates are created and overwritten in place, never removed.
- **Responses are a stored snapshot**: `responses` is persisted at submit time, so submissions remain self-contained even if a template's fields change later.
- **Approval stages are snapshotted** onto the submission at create time (`approvalStages: template.approvalStages`), so later template edits do not alter in-flight submissions.
- **Catalog re-sync overwrites template fields**: `ensureTemplateFromDefinition` rewrites `title/description/section/fields/approvalStages` whenever an existing doc diverges from the hardcoded definition.
- **Template deletion is not handled**: `template` is a required ref on submissions; nothing cascades or nulls it. If a template doc were manually removed, `populate("template")` would yield `null` and PDF rendering would fall through to the generic `renderStructuredTemplatePdf` (template code would be empty).
- **Versioning**: resubmitting with `parentSubmissionId` (must belong to `req.user`) creates a new doc with `version = parent.version + 1` and `parentSubmission` set; old submissions are never mutated.

## 8. Planned schema extensions (NOT yet implemented — todo.md §6)

All of the following are **planned, not present in the current code/schemas**:

- `User`: add `department`, `status` (activate/deactivate) fields (todo §6: "Extend `User` model with role, department, status, and reset-token metadata if needed").
- **`FormCategory`** model — new collection for category-based form catalog.
- `FormTemplate`: add JSON schema + **PDF config** (header, logo, section metadata) (todo §6: "Extend or redesign `FormTemplate` to store JSON schema and PDF config").
- `FormSubmission`: add **generated PDF metadata** (todo §6: "generated PDF metadata").
- **`WorkflowDefinition`** model — dynamic approval steps (todo §6: "Add `WorkflowDefinition` model for dynamic approval steps"). Currently workflows are the `approvalStages` string array on template/submission only.
- **`ApprovalAction`** or embedded approval-log restructure (todo §6: "Add `ApprovalAction` or embedded approval log structure") — embedded `approvals` array already exists, but no standalone model.
- Submission `draft` status flow ("create draft, submit" APIs) and admin activate/deactivate are planned but unimplemented.

Source of truth for this section: `todo.md` lines 108–121.

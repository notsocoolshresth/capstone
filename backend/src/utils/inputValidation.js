const CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const MULTISPACE_REGEX = /[ \t]+/g;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IITP_EMAIL_REGEX = /^[^\s@]+@iitp\.ac\.in$/i;
const PHONE_REGEX = /^\+?[0-9][0-9()\s-]{6,20}$/;
const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ROLL_NUMBER_REGEX = /^\d{4}[a-z]{2}\d{2}$/;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function sanitizeString(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }

  const {
    lowercase = false,
    preserveNewlines = true,
    trim = true,
  } = options;

  let next = value.replace(CONTROL_CHAR_REGEX, "").replace(/\r\n?/g, "\n");

  if (preserveNewlines) {
    next = next
      .split("\n")
      .map((line) => line.replace(MULTISPACE_REGEX, " ").trim())
      .join("\n");
  } else {
    next = next.replace(/\s+/g, " ");
  }

  if (trim) {
    next = next.trim();
  }

  if (lowercase) {
    next = next.toLowerCase();
  }

  return next;
}

function sanitizeDeep(value, options = {}) {
  if (typeof value === "string") {
    return sanitizeString(value, options);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDeep(item, options));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeDeep(item, options)])
    );
  }

  return value;
}

function normalizeEmail(value) {
  return sanitizeString(value, {
    lowercase: true,
    preserveNewlines: false,
  });
}

function normalizeComparable(value) {
  return sanitizeString(String(value || ""), {
    lowercase: true,
    preserveNewlines: false,
  }).replace(/[\s_-]+/g, "");
}

function normalizeRollNumber(value) {
  return sanitizeString(String(value || ""), {
    lowercase: true,
    preserveNewlines: false,
  }).replace(/[\s-]+/g, "");
}

function isBlankValue(value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string") {
    return sanitizeString(value) === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0 || value.every((item) => isBlankValue(item));
  }

  if (isPlainObject(value)) {
    const values = Object.values(value);
    return values.length === 0 || values.every((item) => isBlankValue(item));
  }

  return false;
}

function looksLikeJsonString(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

function maybeParseStructuredValue(value) {
  if (!looksLikeJsonString(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function extractSubmissionPayload(body = {}) {
  const parsedResponses = isPlainObject(body.responses) ? { ...body.responses } : {};

  Object.entries(body).forEach(([key, value]) => {
    const match = key.match(/^responses\[(.+)\]$/);
    if (match) {
      parsedResponses[match[1]] = value;
    }
  });

  return {
    templateId: sanitizeString(body.templateId, { preserveNewlines: false }),
    parentSubmissionId: sanitizeString(body.parentSubmissionId, {
      preserveNewlines: false,
    }),
    responses: parsedResponses,
  };
}

function isEmailField(field = {}) {
  const name = String(field.name || "").toLowerCase();
  const label = String(field.label || "").toLowerCase();
  return field.type === "email" || name.includes("email") || label.includes("email");
}

function isInstitutionalEmailField(field = {}) {
  const name = String(field.name || "").toLowerCase();
  const label = String(field.label || "").toLowerCase();
  return (
    name.includes("iitp") ||
    name.includes("instituteemail") ||
    label.includes("iitp") ||
    label.includes("institute e-mail") ||
    label.includes("institute email")
  );
}

function isPhoneField(field = {}) {
  const name = String(field.name || "").toLowerCase();
  const label = String(field.label || "").toLowerCase();
  return (
    name.includes("mobile") ||
    name.includes("phone") ||
    label.includes("mobile") ||
    label.includes("phone")
  );
}

function isAadhaarField(field = {}) {
  const name = String(field.name || "").toLowerCase();
  const label = String(field.label || "").toLowerCase();
  return name.includes("aadhar") || label.includes("aadhar");
}

function isRollNumberField(field = {}) {
  const name = String(field.name || "").toLowerCase();
  return [
    "rollno",
    "studentrollno",
    "companion1rollno",
    "companion2rollno",
  ].includes(name);
}

function isValidDateInput(value) {
  if (typeof value !== "string" || !DATE_INPUT_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

function getFieldMaxLength(field = {}) {
  if (field.type === "table") {
    return Number.MAX_SAFE_INTEGER;
  }

  if (field.type === "textarea") {
    return 4000;
  }

  if (field.type === "email") {
    return 254;
  }

  if (field.type === "date") {
    return 10;
  }

  if (field.type === "select" || field.type === "radio") {
    return 100;
  }

  return 500;
}

function sanitizeValueForField(field = {}, value) {
  const parsedValue = typeof value === "string" ? maybeParseStructuredValue(value) : value;

  if (typeof parsedValue === "string") {
    if (isEmailField(field)) {
      return normalizeEmail(parsedValue);
    }

    if (isRollNumberField(field)) {
      return normalizeRollNumber(parsedValue);
    }

    return sanitizeString(parsedValue, {
      preserveNewlines: field.type === "textarea",
    });
  }

  if (Array.isArray(parsedValue) || isPlainObject(parsedValue)) {
    return sanitizeDeep(parsedValue);
  }

  return parsedValue;
}

function sanitizeUnknownResponseValue(fieldName, value) {
  const pseudoField = { name: fieldName, label: fieldName, type: "text" };
  return sanitizeValueForField(pseudoField, value);
}

function validateFieldValue(field = {}, value) {
  const errors = [];

  if (isBlankValue(value)) {
    return errors;
  }

  if (typeof value === "string" && value.length > getFieldMaxLength(field)) {
    errors.push(`${field.label || field.name} is too long.`);
    return errors;
  }

  if ((field.type === "select" || field.type === "radio") && Array.isArray(field.options) && field.options.length > 0) {
    const matchedOption = field.options.find(
      (option) => normalizeComparable(option) === normalizeComparable(value)
    );

    if (!matchedOption) {
      errors.push(`${field.label || field.name} contains an invalid selection.`);
    }
  }

  if (isEmailField(field)) {
    if (!EMAIL_REGEX.test(String(value))) {
      errors.push(`${field.label || field.name} must be a valid email address.`);
    } else if (isInstitutionalEmailField(field) && !IITP_EMAIL_REGEX.test(String(value))) {
      errors.push(`${field.label || field.name} must use an @iitp.ac.in email address.`);
    }
  }

  if (field.type === "date" && !isValidDateInput(String(value))) {
    errors.push(`${field.label || field.name} must be a valid date.`);
  }

  if (field.type === "number" && !Number.isFinite(Number(value))) {
    errors.push(`${field.label || field.name} must be a valid number.`);
  }

  if (isPhoneField(field) && !PHONE_REGEX.test(String(value))) {
    errors.push(`${field.label || field.name} must be a valid phone number.`);
  }

  if (isAadhaarField(field)) {
    const digits = String(value).replace(/\D/g, "");
    if (digits.length !== 12) {
      errors.push(`${field.label || field.name} must be a valid 12-digit Aadhaar number.`);
    }
  }

  if (isRollNumberField(field) && !ROLL_NUMBER_REGEX.test(String(value))) {
    errors.push(
      `${field.label || field.name} must match the format 2XYZaiPQ(ex-2301ai20).`
    );
  }

  return errors;
}

function sanitizeAndValidateResponses(template, responses) {
  const rawResponses = isPlainObject(responses) ? responses : {};
  const sanitizedResponses = Object.fromEntries(
    Object.entries(rawResponses).map(([key, value]) => [key, sanitizeUnknownResponseValue(key, value)])
  );
  const errors = [];

  const fields = Array.isArray(template?.fields) ? template.fields : [];
  const submittedKeys = new Set(Object.keys(rawResponses));

  fields.forEach((field) => {
    if (!submittedKeys.has(field.name)) {
      return;
    }

    const sanitizedValue = sanitizeValueForField(field, rawResponses[field.name]);
    sanitizedResponses[field.name] = sanitizedValue;

    if (field.required && isBlankValue(sanitizedValue)) {
      errors.push(`${field.label || field.name} is required.`);
      return;
    }

    const fieldErrors = validateFieldValue(field, sanitizedValue);
    errors.push(...fieldErrors);

    if (
      (field.type === "select" || field.type === "radio") &&
      !isBlankValue(sanitizedValue) &&
      Array.isArray(field.options)
    ) {
      const matchedOption = field.options.find(
        (option) => normalizeComparable(option) === normalizeComparable(sanitizedValue)
      );
      if (matchedOption) {
        sanitizedResponses[field.name] = matchedOption;
      }
    }
  });

  return {
    sanitizedResponses,
    errors,
  };
}

function validateUploadedImage(file) {
  if (!file) {
    return [];
  }

  const errors = [];

  if (!ALLOWED_IMAGE_MIME_TYPES.has(String(file.mimetype || "").toLowerCase())) {
    errors.push("Only JPG, PNG, and WEBP image uploads are allowed.");
  }

  if (file.size && file.size > 5 * 1024 * 1024) {
    errors.push("Uploaded image must be 5 MB or smaller.");
  }

  return errors;
}

function sanitizeComment(comment, maxLength = 1000) {
  const sanitized = sanitizeString(comment, { preserveNewlines: true });

  if (sanitized.length > maxLength) {
    return {
      value: sanitized.slice(0, maxLength),
      error: `Comment must be ${maxLength} characters or fewer.`,
    };
  }

  return { value: sanitized, error: null };
}

function sanitizeTemplatePayload(payload = {}) {
  const fields = Array.isArray(payload.fields)
    ? payload.fields
        .map((field) => ({
          label: sanitizeString(field?.label, { preserveNewlines: false }),
          name: sanitizeString(field?.name, { preserveNewlines: false }),
          type: sanitizeString(field?.type, { preserveNewlines: false }),
          required: Boolean(field?.required),
          section: sanitizeString(field?.section, { preserveNewlines: false }),
          placeholder: sanitizeString(field?.placeholder, { preserveNewlines: false }),
          helperText: sanitizeString(field?.helperText, { preserveNewlines: true }),
          minRows: Number.isInteger(field?.minRows) ? field.minRows : 0,
          defaultRows: Number.isInteger(field?.defaultRows) ? field.defaultRows : 0,
          options: Array.isArray(field?.options)
            ? field.options
                .map((option) => sanitizeString(option, { preserveNewlines: false }))
                .filter(Boolean)
            : [],
          columns: Array.isArray(field?.columns)
            ? field.columns
                .map((column) => ({
                  label: sanitizeString(column?.label, { preserveNewlines: false }),
                  name: sanitizeString(column?.name, { preserveNewlines: false }),
                  type: sanitizeString(column?.type, { preserveNewlines: false }),
                  required: Boolean(column?.required),
                  width: sanitizeString(column?.width, { preserveNewlines: false }),
                  options: Array.isArray(column?.options)
                    ? column.options
                        .map((option) => sanitizeString(option, { preserveNewlines: false }))
                        .filter(Boolean)
                    : [],
                }))
                .filter((column) => column.label && column.name)
            : [],
        }))
        .filter((field) => field.label && field.name)
    : [];

  return {
    title: sanitizeString(payload.title, { preserveNewlines: false }),
    description: sanitizeString(payload.description, { preserveNewlines: true }),
    section: sanitizeString(payload.section, { preserveNewlines: false }),
    fields,
    approvalStages: Array.isArray(payload.approvalStages)
      ? payload.approvalStages
          .map((stage) => sanitizeString(stage, { preserveNewlines: false }))
          .filter(Boolean)
      : [],
  };
}

module.exports = {
  ALLOWED_IMAGE_MIME_TYPES,
  DATE_INPUT_REGEX,
  EMAIL_REGEX,
  IITP_EMAIL_REGEX,
  OBJECT_ID_REGEX,
  ROLL_NUMBER_REGEX,
  isBlankValue,
  isPlainObject,
  isValidDateInput,
  extractSubmissionPayload,
  normalizeComparable,
  normalizeEmail,
  normalizeRollNumber,
  sanitizeAndValidateResponses,
  sanitizeComment,
  sanitizeDeep,
  sanitizeString,
  sanitizeTemplatePayload,
  validateUploadedImage,
};

import API from "../services/api";
import {
  DATE_INPUT_REGEX,
  EMAIL_REGEX,
  IITP_EMAIL_REGEX,
  PHONE_REGEX,
  ROLL_NUMBER_REGEX,
  isBlankValue,
  isPlainObject,
  isValidDateInput,
  maybeParseStructuredValue,
  normalizeComparable,
  normalizeEmail,
  normalizeRollNumber,
  sanitizeDeep,
  sanitizeString,
} from "./inputSanitizers";

const ALLOWED_ROLES = ["Faculty", "HOD", "Dean", "Director", "Admin"];
const PASSWORD_MIN_LENGTH = 6;
const TEMPLATE_CACHE = new Map();
let templatesIndexPromise = null;

function createValidationError(messages) {
  const validationMessages = Array.isArray(messages) ? messages : [messages];
  const error = new Error(validationMessages[0] || "Validation failed.");
  error.validationErrors = validationMessages;
  return error;
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

function getFieldMaxLength(field = {}) {
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

function validateFieldValue(field = {}, value) {
  const errors = [];

  if (isBlankValue(value)) {
    return errors;
  }

  if (typeof value === "string" && value.length > getFieldMaxLength(field)) {
    errors.push(`${field.label || field.name} is too long.`);
    return errors;
  }

  if (
    (field.type === "select" || field.type === "radio") &&
    Array.isArray(field.options) &&
    field.options.length > 0
  ) {
    const match = field.options.find(
      (option) => normalizeComparable(option) === normalizeComparable(value)
    );

    if (!match) {
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
    errors.push(`${field.label || field.name} must match the format 2XYZaiPQ(ex-2301MC20).`);
  }

  return errors;
}

function sanitizeUnknownFieldValue(fieldName, value) {
  return sanitizeValueForField({ name: fieldName, label: fieldName, type: "text" }, value);
}

function validateTemplateResponses(template, responses) {
  const rawResponses = isPlainObject(responses) ? responses : {};
  const sanitizedResponses = Object.fromEntries(
    Object.entries(rawResponses).map(([key, value]) => [
      key,
      sanitizeUnknownFieldValue(key, value),
    ])
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

    errors.push(...validateFieldValue(field, sanitizedValue));

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

  return { sanitizedResponses, errors };
}

async function getTemplatesIndex() {
  if (!templatesIndexPromise) {
    templatesIndexPromise = API.get("/forms/templates")
      .then((response) => response.data || [])
      .catch((error) => {
        templatesIndexPromise = null;
        throw error;
      });
  }

  return templatesIndexPromise;
}

async function resolveTemplate({ template, templateId, templateSlug }) {
  if (template?.fields) {
    return template;
  }

  if (templateSlug) {
    if (TEMPLATE_CACHE.has(templateSlug)) {
      return TEMPLATE_CACHE.get(templateSlug);
    }

    const response = await API.get(templateSlug);
    TEMPLATE_CACHE.set(templateSlug, response.data);
    return response.data;
  }

  if (!templateId) {
    return null;
  }

  const templates = await getTemplatesIndex();
  return (
    templates.find((item) => item?._id === templateId || item?.code === templateId) || null
  );
}

export function getErrorMessage(error, fallbackMessage = "Something went wrong.") {
  if (Array.isArray(error?.validationErrors) && error.validationErrors.length > 0) {
    return error.validationErrors[0];
  }

  return error?.response?.data?.message || error?.message || fallbackMessage;
}

export function validateLoginForm(form) {
  const sanitized = {
    email: normalizeEmail(form?.email),
    password: sanitizeString(form?.password, { preserveNewlines: false }),
  };

  if (!sanitized.email || !sanitized.password) {
    throw createValidationError("Email and password are required.");
  }

  if (!EMAIL_REGEX.test(sanitized.email)) {
    throw createValidationError("Please enter a valid email address.");
  }

  if (!IITP_EMAIL_REGEX.test(sanitized.email)) {
    throw createValidationError("Only @iitp.ac.in email addresses are allowed.");
  }

  return sanitized;
}

export function validateRegisterForm(form) {
  const sanitized = {
    name: sanitizeString(form?.name, { preserveNewlines: false }),
    email: normalizeEmail(form?.email),
    password: sanitizeString(form?.password, { preserveNewlines: false }),
  };

  if (!sanitized.name || !sanitized.email || !sanitized.password) {
    throw createValidationError("Name, email, and password are required.");
  }

  if (!EMAIL_REGEX.test(sanitized.email)) {
    throw createValidationError("Please enter a valid email address.");
  }

  if (!IITP_EMAIL_REGEX.test(sanitized.email)) {
    throw createValidationError("Only @iitp.ac.in email addresses are allowed.");
  }

  if (sanitized.password.length < PASSWORD_MIN_LENGTH) {
    throw createValidationError(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
    );
  }

  return sanitized;
}

export function validateForgotPasswordForm(email) {
  const sanitizedEmail = normalizeEmail(email);

  if (!sanitizedEmail) {
    throw createValidationError("Email is required.");
  }

  if (!EMAIL_REGEX.test(sanitizedEmail)) {
    throw createValidationError("Please enter a valid email address.");
  }

  if (!IITP_EMAIL_REGEX.test(sanitizedEmail)) {
    throw createValidationError("Only @iitp.ac.in email addresses are allowed.");
  }

  return { email: sanitizedEmail };
}

export function validateResetPasswordForm(form) {
  const password = sanitizeString(form?.password, { preserveNewlines: false });
  const confirmPassword = sanitizeString(form?.confirmPassword, {
    preserveNewlines: false,
  });

  if (!password || !confirmPassword) {
    throw createValidationError("Both password fields are required.");
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw createValidationError(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
    );
  }

  if (password !== confirmPassword) {
    throw createValidationError("Passwords do not match.");
  }

  return { password };
}

export function validateChangePasswordForm(form) {
  const sanitized = {
    currentPassword: sanitizeString(form?.currentPassword, {
      preserveNewlines: false,
    }),
    newPassword: sanitizeString(form?.newPassword, { preserveNewlines: false }),
    confirmPassword: sanitizeString(form?.confirmPassword, {
      preserveNewlines: false,
    }),
  };

  if (!sanitized.currentPassword || !sanitized.newPassword || !sanitized.confirmPassword) {
    throw createValidationError("All fields are required.");
  }

  if (sanitized.newPassword.length < PASSWORD_MIN_LENGTH) {
    throw createValidationError(
      `New password must be at least ${PASSWORD_MIN_LENGTH} characters.`
    );
  }

  if (sanitized.newPassword !== sanitized.confirmPassword) {
    throw createValidationError("New passwords do not match.");
  }

  if (sanitized.currentPassword === sanitized.newPassword) {
    throw createValidationError("New password must be different from the current one.");
  }

  return {
    currentPassword: sanitized.currentPassword,
    newPassword: sanitized.newPassword,
  };
}

export function validateChangeRoleForm({ email, role }) {
  const sanitized = {
    email: normalizeEmail(email),
    role: sanitizeString(role, { preserveNewlines: false }),
  };

  if (!sanitized.email || !sanitized.role) {
    throw createValidationError("Email and role are required.");
  }

  if (!EMAIL_REGEX.test(sanitized.email)) {
    throw createValidationError("Please enter a valid email address.");
  }

  if (!IITP_EMAIL_REGEX.test(sanitized.email)) {
    throw createValidationError("Only @iitp.ac.in email addresses are allowed.");
  }

  if (!ALLOWED_ROLES.includes(sanitized.role)) {
    throw createValidationError(`Role must be one of: ${ALLOWED_ROLES.join(", ")}`);
  }

  return sanitized;
}

export function validateApprovalPayload({ action, comment }) {
  const sanitizedAction = sanitizeString(action, { preserveNewlines: false });
  const sanitizedComment = sanitizeString(comment, { preserveNewlines: true });

  if (!["approved", "rejected"].includes(sanitizedAction)) {
    throw createValidationError("Invalid action.");
  }

  if (sanitizedComment.length > 1000) {
    throw createValidationError("Comment must be 1000 characters or fewer.");
  }

  return { action: sanitizedAction, comment: sanitizedComment };
}

export function validateCsvFile(file) {
  if (!file) {
    throw createValidationError("Please select a CSV file.");
  }

  const sanitizedName = sanitizeString(file.name, { preserveNewlines: false });
  if (!sanitizedName.toLowerCase().endsWith(".csv")) {
    throw createValidationError("Only CSV files are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw createValidationError("CSV files must be 5 MB or smaller.");
  }

  return file;
}

export function validateImageFile(file) {
  if (!file) {
    return null;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(String(file.type || "").toLowerCase())) {
    throw createValidationError("Only JPG, PNG, and WEBP image uploads are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw createValidationError("Uploaded image must be 5 MB or smaller.");
  }

  return file;
}

export async function prepareSubmissionPayload({
  template,
  templateId,
  templateSlug,
  responses,
  parentSubmissionId,
}) {
  const resolvedTemplate = await resolveTemplate({ template, templateId, templateSlug }).catch(
    () => null
  );

  const sanitizedResponses = sanitizeDeep(responses);
  const { sanitizedResponses: normalizedResponses, errors } = resolvedTemplate
    ? validateTemplateResponses(resolvedTemplate, sanitizedResponses)
    : { sanitizedResponses, errors: [] };

  if (errors.length > 0) {
    throw createValidationError(errors);
  }

  const resolvedTemplateId =
    resolvedTemplate?._id || templateId || resolvedTemplate?.code || "";

  if (!resolvedTemplateId) {
    throw createValidationError("Form template is not ready. Please refresh and try again.");
  }

  return {
    payload: {
      templateId: resolvedTemplateId,
      responses: normalizedResponses,
      ...(parentSubmissionId
        ? {
            parentSubmissionId: sanitizeString(parentSubmissionId, {
              preserveNewlines: false,
            }),
          }
        : {}),
    },
    template: resolvedTemplate,
    sanitizedResponses: normalizedResponses,
  };
}

export async function prepareMultipartSubmission({
  template,
  templateId,
  templateSlug,
  responses,
  parentSubmissionId,
  fileFields = {},
}) {
  Object.values(fileFields).forEach((file) => validateImageFile(file));

  const { payload, template: resolvedTemplate, sanitizedResponses } =
    await prepareSubmissionPayload({
      template,
      templateId,
      templateSlug,
      responses,
      parentSubmissionId,
    });

  const formData = new FormData();
  formData.append("templateId", payload.templateId);

  if (payload.parentSubmissionId) {
    formData.append("parentSubmissionId", payload.parentSubmissionId);
  }

  const responsePayload = { ...payload.responses };
  Object.keys(fileFields).forEach((fieldName) => {
    delete responsePayload[fieldName];
  });

  Object.entries(responsePayload).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      formData.append(`responses[${key}]`, "");
      return;
    }

    if (Array.isArray(value) || isPlainObject(value)) {
      formData.append(`responses[${key}]`, JSON.stringify(value));
      return;
    }

    formData.append(`responses[${key}]`, String(value));
  });

  Object.entries(fileFields).forEach(([fieldName, file]) => {
    if (file) {
      formData.append(`responses[${fieldName}]`, file);
    }
  });

  return {
    formData,
    template: resolvedTemplate,
    sanitizedResponses,
  };
}

export function isDateInputValue(value) {
  return typeof value === "string" && DATE_INPUT_REGEX.test(value) && isValidDateInput(value);
}

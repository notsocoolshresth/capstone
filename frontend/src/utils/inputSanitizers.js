const MULTISPACE_REGEX = /[ \t]+/g;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const IITP_EMAIL_REGEX = /^[^\s@]+@iitp\.ac\.in$/i;
export const PHONE_REGEX = /^\+?[0-9][0-9()\s-]{6,20}$/;
export const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const ROLL_NUMBER_REGEX = /^\d{4}[a-z]{2}\d{2}$/;

export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function sanitizeString(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }

  const {
    lowercase = false,
    preserveNewlines = true,
    trim = true,
  } = options;

  let next = Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return !(
        (code >= 0 && code <= 8) ||
        code === 11 ||
        code === 12 ||
        (code >= 14 && code <= 31) ||
        code === 127
      );
    })
    .join("")
    .replace(/\r\n?/g, "\n");

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

export function sanitizeDeep(value, options = {}) {
  if (
    (typeof File !== "undefined" && value instanceof File) ||
    (typeof Blob !== "undefined" && value instanceof Blob)
  ) {
    return value;
  }

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

export function normalizeEmail(value) {
  return sanitizeString(value, {
    lowercase: true,
    preserveNewlines: false,
  });
}

export function normalizeComparable(value) {
  return sanitizeString(String(value || ""), {
    lowercase: true,
    preserveNewlines: false,
  }).replace(/[\s_-]+/g, "");
}

export function normalizeRollNumber(value) {
  return sanitizeString(String(value || ""), {
    lowercase: true,
    preserveNewlines: false,
  }).replace(/[\s-]+/g, "");
}

export function isBlankValue(value) {
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

export function looksLikeJsonString(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

export function maybeParseStructuredValue(value) {
  if (!looksLikeJsonString(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function isValidDateInput(value) {
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

export function sanitizeRequestData(data) {
  return sanitizeDeep(data);
}

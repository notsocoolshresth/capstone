const { parse } = require("csv-parse/sync");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const {
  EMAIL_REGEX,
  IITP_EMAIL_REGEX,
  normalizeEmail,
  sanitizeString,
} = require("../utils/inputValidation");

const ALLOWED_ROLES = ["Faculty", "HOD", "Dean", "Director", "Admin"];
const PASSWORD_MIN_LENGTH = 6;
const jobs = new Map();

const bulkImport = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CSV file uploaded" });
  }

  let rows;
  try {
    rows = parse(req.file.buffer.toString("utf8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (err) {
    return res.status(400).json({ message: `Invalid CSV format: ${err.message}` });
  }

  if (!rows || rows.length === 0) {
    return res.status(400).json({ message: "CSV file is empty or has no data rows" });
  }

  const jobId = crypto.randomUUID();
  jobs.set(jobId, {
    total: rows.length,
    processed: 0,
    results: [],
    done: false,
    listeners: new Set(),
  });

  setImmediate(() => processRows(jobId, rows));
  res.status(202).json({ jobId, total: rows.length });
};

const bulkImportStream = (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found or has expired" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  for (const result of job.results) {
    send({ type: "row", ...result, total: job.total });
  }

  if (job.done) {
    const created = job.results.filter((result) => result.status === "success").length;
    const failed = job.results.filter((result) => result.status === "failed").length;
    send({ type: "complete", created, failed, total: job.total });
    return res.end();
  }

  const listener = (result) => {
    if (result === null) {
      const created = job.results.filter((item) => item.status === "success").length;
      const failed = job.results.filter((item) => item.status === "failed").length;
      send({ type: "complete", created, failed, total: job.total });
      res.end();
      return;
    }

    send({ type: "row", ...result, total: job.total });
  };

  job.listeners.add(listener);
  req.on("close", () => job.listeners.delete(listener));
};

const changeRole = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const role = sanitizeString(req.body?.role, { preserveNewlines: false });

  if (!email || !role) {
    return res.status(400).json({ message: "Both email and role are required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  if (!IITP_EMAIL_REGEX.test(email)) {
    return res.status(403).json({ message: "Only @iitp.ac.in email addresses are allowed." });
  }

  const normalizedRole = ALLOWED_ROLES.find(
    (allowedRole) => allowedRole.toLowerCase() === role.toLowerCase()
  );

  if (!normalizedRole) {
    return res.status(400).json({
      message: `Invalid role "${role}". Allowed values: ${ALLOWED_ROLES.join(", ")}`,
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: `No user found with email "${email}"` });
  }

  if (user.role === normalizedRole) {
    return res.status(400).json({
      message: `User already has the role "${normalizedRole}"`,
    });
  }

  user.role = normalizedRole;
  await user.save();

  res.json({
    message: `Role updated to "${normalizedRole}" for ${user.email}`,
    user: { name: user.name, email: user.email, role: user.role },
  });
};

async function processRows(jobId, rows) {
  const job = jobs.get(jobId);
  if (!job) return;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const rowNum = i + 1;
    const name = sanitizeString(row?.name, { preserveNewlines: false });
    const email = normalizeEmail(row?.email);
    const role = sanitizeString(row?.role, { preserveNewlines: false });
    const password =
      sanitizeString(row?.password, { preserveNewlines: false }) || "password";
    const result = {
      row: rowNum,
      name: name || "",
      email: email || "",
    };

    try {
      if (!name || !email) {
        throw new Error("Missing required fields - CSV columns must be: name, email, role");
      }

      if (!EMAIL_REGEX.test(email)) {
        throw new Error("Invalid email format");
      }

      if (!IITP_EMAIL_REGEX.test(email)) {
        throw new Error("Only @iitp.ac.in email addresses are allowed");
      }

      const normalizedRole = role
        ? ALLOWED_ROLES.find(
            (allowedRole) => allowedRole.toLowerCase() === role.toLowerCase()
          )
        : "Faculty";

      if (role && !normalizedRole) {
        throw new Error(`Invalid role "${role}". Allowed values: ${ALLOWED_ROLES.join(", ")}`);
      }

      if (password.length < PASSWORD_MIN_LENGTH) {
        throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      }

      const existing = await User.findOne({ email });
      if (existing) {
        throw new Error("A user with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: normalizedRole || "Faculty",
      });

      result.status = "success";
    } catch (err) {
      result.status = "failed";
      result.reason = err.message;
    }

    job.results.push(result);
    job.processed += 1;

    for (const listener of job.listeners) {
      listener(result);
    }
  }

  job.done = true;
  for (const listener of job.listeners) {
    listener(null);
  }

  setTimeout(() => jobs.delete(jobId), 10 * 60 * 1000);
}

module.exports = {
  bulkImport,
  bulkImportStream,
  changeRole,
};

const { formatDate, getResponseValue } = require("../../utils/pdfUtils");

const sanitizeText = (value, type = "text") => {
  if (value === undefined || value === null) {
    return "";
  }

  if (type === "date") {
    return formatDate(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeText(item, "text"))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => sanitizeText(item, "text"))
      .filter(Boolean)
      .join(" ");
  }

  return String(value).replace(/\s+/g, " ").trim();
};

const ensureSpace = (doc, requiredHeight) => {
  const bottom = doc.page.height - doc.page.margins.bottom - 12;
  if (doc.y + requiredHeight > bottom) {
    doc.addPage();
  }
};

const drawSectionHeading = (doc, title) => {
  ensureSpace(doc, 28);
  doc.moveDown(0.4);
  doc.font("Helvetica-Bold").fontSize(12.5).text(title);
  doc.moveDown(0.15);
};

const drawFieldValue = (doc, field, value) => {
  const label = field?.label || field?.name || "Field";
  const type = field?.type || "text";
  const displayValue = sanitizeText(value, type) || "-";
  const minHeight = type === "textarea" ? 44 : 24;

  ensureSpace(doc, minHeight);
  doc.font("Helvetica-Bold").fontSize(10.5).text(`${label}:`, {
    continued: true,
  });
  doc.font("Helvetica").fontSize(10.5).text(` ${displayValue}`);
  doc.moveDown(type === "textarea" ? 0.35 : 0.2);
};

const drawTable = (doc, field, rows) => {
  const columns = Array.isArray(field?.columns) ? field.columns : [];
  if (columns.length === 0) {
    return;
  }

  const safeRows = rows.length > 0 ? rows : [{}];
  const left = doc.page.margins.left;
  const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columnWidth = availableWidth / columns.length;
  const headerHeight = 24;
  const rowHeight = 28;

  const drawHeader = (y) => {
    let x = left;

    columns.forEach((column, index) => {
      doc.rect(x, y, columnWidth, headerHeight).lineWidth(0.6).stroke();
      doc.font("Helvetica-Bold").fontSize(8.5).text(column.label, x + 4, y + 6, {
        width: columnWidth - 8,
        align: "center",
      });
      x += columnWidth;

      if (index === columns.length - 1) {
        doc.x = left;
      }
    });

    return y + headerHeight;
  };

  ensureSpace(doc, headerHeight + rowHeight + 12);
  let y = drawHeader(doc.y);

  safeRows.forEach((row) => {
    if (y + rowHeight > doc.page.height - doc.page.margins.bottom - 12) {
      doc.addPage();
      y = drawHeader(doc.page.margins.top);
    }

    let x = left;
    columns.forEach((column) => {
      const cellValue = sanitizeText(row?.[column.name], column.type);
      doc.rect(x, y, columnWidth, rowHeight).lineWidth(0.5).stroke();
      doc.font("Helvetica").fontSize(8.5).text(cellValue || "-", x + 4, y + 5, {
        width: columnWidth - 8,
        align: column.type === "number" ? "right" : "left",
      });
      x += columnWidth;
    });

    y += rowHeight;
  });

  doc.y = y + 8;
};

const renderStructuredTemplatePdf = (doc, submission) => {
  const template = submission.template || {};
  const responses = submission.responses;
  const fields = Array.isArray(template.fields) ? template.fields : [];

  doc.font("Helvetica-Bold").fontSize(15).text("INDIAN INSTITUTE OF TECHNOLOGY PATNA", {
    align: "center",
  });
  doc.moveDown(0.2);
  doc.font("Helvetica-Bold").fontSize(13).text(template.title || "Form Submission", {
    align: "center",
  });

  if (template.description) {
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(10).text(template.description, {
      align: "center",
    });
  }

  doc.moveDown(0.8);
  doc.font("Helvetica").fontSize(10).text(`Submitted by: ${submission.submittedBy?.name || "-"}`);
  doc.text(`Submitted at: ${new Date(submission.createdAt).toLocaleString()}`);
  doc.text(`Status: ${submission.status || "-"}`);
  doc.moveDown(0.6);

  let lastSection = "";

  fields.forEach((field) => {
    const section = String(field?.section || "").trim();
    if (section && section !== lastSection) {
      drawSectionHeading(doc, section);
      lastSection = section;
    }

    const value = getResponseValue(responses, field.name);

    if (field.type === "table") {
      doc.font("Helvetica-Bold").fontSize(10.5).text(field.label || field.name || "Table");
      doc.moveDown(0.2);
      const rows = Array.isArray(value) ? value : [];
      drawTable(doc, field, rows);
      return;
    }

    drawFieldValue(doc, field, value);
  });
};

module.exports = { renderStructuredTemplatePdf };

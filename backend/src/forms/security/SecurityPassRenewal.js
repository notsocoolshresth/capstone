const { getResponseValue } = require("../../utils/pdfUtils");

const renderPassRenewalSlip = (doc, responses, startY) => {
  const leftMargin  = doc.page.margins.left;
  const rightMargin = doc.page.margins.right;
  const pageWidth   = doc.page.width - leftMargin - rightMargin;

  const applicantName      = String(getResponseValue(responses, "applicantName")      || "").trim();
  const date               = String(getResponseValue(responses, "date")               || "").trim();
  const flatNo             = String(getResponseValue(responses, "flatNo")             || "").trim();
  const mobileNo           = String(getResponseValue(responses, "mobileNo")           || "").trim();
  const passNumber         = String(getResponseValue(responses, "passNumber")         || "").trim();
  const passHolderNameMobile = String(getResponseValue(responses, "passHolderNameMobile") || "").trim();

  const tableL = leftMargin;
  const tableR = leftMargin + pageWidth;
  const col1W  = pageWidth * 0.45;   // left column
  const col2W  = pageWidth * 0.35;   // middle column
  const midX   = tableL + col1W;
  const col3X  = midX + col2W;

  const cellPad   = 5;
  const lineH     = doc.currentLineHeight(true);
  const rowH1     = 40;   // Name & Date row
  const rowH2     = 45;   // Flat No row (sub-label wraps)
  const rowH3     = 22;   // Pass Number
  const rowH4     = 22;   // Pass Holder
  const rowH5     = 55;   // Please renew + sig
  const rowH6     = 50;   // Security Officer / PIC Security

  // ── Title ─────────────────────────────────────────────────────────────────
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(
      "Requisition for Renewal of Entry Pass: Domestic Help/Tutor/Driver/Supplier",
      tableL,
      startY,
      { align: "center", width: pageWidth, underline: true }
    );

  let y = startY + 18;

  // ── Helper: draw a rectangle border ──────────────────────────────────────
  const rect = (x, yy, w, h) => doc.rect(x, yy, w, h).lineWidth(0.5).stroke();

  // ── Row 1: Name | (empty value area) | Date ──────────────────────────────
  rect(tableL, y, pageWidth, rowH1);
  // inner vertical lines
  doc.moveTo(midX, y).lineTo(midX, y + rowH1).lineWidth(0.5).stroke();
  doc.moveTo(col3X, y).lineTo(col3X, y + rowH1).lineWidth(0.5).stroke();

  doc.font("Helvetica-Bold").fontSize(9)
     .text("Name of the Applicant", tableL + cellPad, y + cellPad, { width: col1W - cellPad * 2 });
  doc.font("Helvetica").fontSize(8)
     .text("(To be filled by the applicant of the pass)", tableL + cellPad, y + cellPad + 11, { width: col1W - cellPad * 2 });
  // value in middle col
  doc.font("Helvetica").fontSize(9)
     .text(applicantName, midX + cellPad, y + cellPad + 4, { width: col2W - cellPad * 2 });
  // Date col
  doc.font("Helvetica").fontSize(9)
     .text(`Date: - ${date}`, col3X + cellPad, y + cellPad + 4, { width: pageWidth - col1W - col2W - cellPad * 2 });

  y += rowH1;

  // ── Row 2: Flat No | Mobile No (split right half) ────────────────────────
  rect(tableL, y, pageWidth, rowH2);
  // vertical lines
  doc.moveTo(midX, y).lineTo(midX, y + rowH2).lineWidth(0.5).stroke();
  const mobileColX = midX + col2W * 0.45;
  doc.moveTo(mobileColX, y).lineTo(mobileColX, y + rowH2).lineWidth(0.5).stroke();

  doc.font("Helvetica-Bold").fontSize(9)
     .text("Flat No.(s)", tableL + cellPad, y + cellPad, { width: col1W - cellPad * 2 });
  doc.font("Helvetica").fontSize(8)
     .text("(if working more than One Flat, all Flat Number to be mentioned)", tableL + cellPad, y + cellPad + 11, { width: col1W - cellPad * 2 });
  // flat value
  doc.font("Helvetica").fontSize(9)
     .text(flatNo, midX + cellPad, y + cellPad + 4, { width: col2W * 0.45 - cellPad * 2 });
  // Mobile No label + value
  doc.font("Helvetica").fontSize(9)
     .text("Mobile No.", mobileColX + cellPad, y + cellPad + 4);
  doc.font("Helvetica").fontSize(9)
     .text(mobileNo, mobileColX + cellPad, y + cellPad + 16, { width: pageWidth - col1W - col2W * 0.45 - cellPad * 2 });

  y += rowH2;

  // ── Row 3: Pass Number ───────────────────────────────────────────────────
  rect(tableL, y, pageWidth, rowH3);
  doc.moveTo(midX, y).lineTo(midX, y + rowH3).lineWidth(0.5).stroke();

  doc.font("Helvetica-Bold").fontSize(9)
     .text("Pass Number", tableL + cellPad, y + 6, { width: col1W - cellPad * 2 });
  doc.font("Helvetica").fontSize(9)
     .text(passNumber, midX + cellPad, y + 6, { width: pageWidth - col1W - cellPad * 2 });

  y += rowH3;

  // ── Row 4: Name & Mobile No. of the Pass Holder ──────────────────────────
  rect(tableL, y, pageWidth, rowH4);
  doc.moveTo(midX, y).lineTo(midX, y + rowH4).lineWidth(0.5).stroke();

  doc.font("Helvetica-Bold").fontSize(9)
     .text("Name & Mobile No. of the Pass Holder", tableL + cellPad, y + 6, { width: col1W - cellPad * 2 });
  doc.font("Helvetica").fontSize(9)
     .text(passHolderNameMobile, midX + cellPad, y + 6, { width: pageWidth - col1W - cellPad * 2 });

  y += rowH4;

  // ── Row 5: Please renew / Signature ──────────────────────────────────────
  rect(tableL, y, pageWidth, rowH5);

  doc.font("Helvetica-Bold").fontSize(10).fillColor("black")
     .text("Please renew/further extend the above-mentioned pass.", tableL + cellPad, y + 10, { width: pageWidth - cellPad * 2 });
  doc.font("Helvetica").fontSize(9)
     .text("Signature of applicant with date", tableR - 175, y + rowH5 - 20);

  y += rowH5;

  // ── Row 6: Security Officer | PIC Security (two columns) ─────────────────
  const halfW = pageWidth / 2;
  rect(tableL, y, halfW, rowH6);
  rect(tableL + halfW, y, halfW, rowH6);

  doc.font("Helvetica-Bold").fontSize(10).font("Helvetica-BoldOblique")
     .text("Security Officer", tableL + halfW * 0.5 - 40, y + rowH6 - 22);
  doc.font("Helvetica-BoldOblique")
     .text("PIC Security", tableL + halfW + halfW * 0.5 - 35, y + rowH6 - 22);
};

// ─────────────────────────────────────────────────────────────────────────────

const renderSecurityPassRenewalPdf = (doc, submission) => {
  const responses = submission.responses;

  const topMargin = doc.page.margins.top;
  const pageHeight = doc.page.height;

  // Two copies on one A4 page
  const slipH = (pageHeight - topMargin - doc.page.margins.bottom - 30) / 2;

  renderPassRenewalSlip(doc, responses, topMargin);

  // Separator line
  const sepY = topMargin + slipH + 5;
  doc
    .moveTo(doc.page.margins.left, sepY)
    .lineTo(doc.page.width - doc.page.margins.right, sepY)
    .lineWidth(0.5)
    .dash(4, { space: 4 })
    .stroke()
    .undash();

  renderPassRenewalSlip(doc, responses, sepY + 10);
};

module.exports = { renderSecurityPassRenewalPdf };

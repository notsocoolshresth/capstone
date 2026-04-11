const { getResponseValue } = require("../../utils/pdfUtils");

const renderSecurityRequisitionForEntryPassPdf = (doc, submission) => {
  const responses = submission.responses;

  const applicantName = String(getResponseValue(responses, "applicantName")            || "").trim();
  const employeeNo    = String(getResponseValue(responses, "employeeNo")               || "").trim();
  const designation   = String(getResponseValue(responses, "designation")              || "").trim();
  const department    = String(getResponseValue(responses, "department")               || "").trim();
  const emailId       = String(getResponseValue(responses, "emailId")                  || "").trim();
  const flatNo        = String(getResponseValue(responses, "flatNo")                   || "").trim();
  const mobileNo      = String(getResponseValue(responses, "mobileNo")                 || "").trim();
  const helperName    = String(getResponseValue(responses, "helperName")               || "").trim();
  const helperAadhar  = String(getResponseValue(responses, "helperAadhar")             || "").trim();
  const helperMobile  = String(getResponseValue(responses, "helperMobileNo")           || "").trim();
  const identMark     = String(getResponseValue(responses, "visibleIdentificationMark")|| "").trim();
  const employedAs    = String(getResponseValue(responses, "employedAs")               || "").trim();
  const entryExitTime = String(getResponseValue(responses, "campusEntryExitTime")      || "").trim();

  const L  = doc.page.margins.left;
  const PW = doc.page.width - L - doc.page.margins.right;
  const lw = 0.5;
  const pad = 5;
  const fs  = 9;

  // ── drawRow: each cell is { text, w, bold, italic, color }
  // Renders one horizontal row of bordered cells; returns next Y.
  const drawRow = (y, h, cells) => {
    let x = L;
    cells.forEach(({ text, w, bold, italic, color }) => {
      const cw = PW * w;
      doc.rect(x, y, cw, h).lineWidth(lw).stroke();

      const font = (bold && italic) ? "Helvetica-BoldOblique"
                 : bold  ? "Helvetica-Bold"
                 : italic ? "Helvetica-Oblique"
                 : "Helvetica";

      if (color) doc.fillColor(color);
      doc.font(font).fontSize(fs)
         .text(text || "", x + pad, y + pad, {
           width: cw - pad * 2,
           continued: false,
         });
      if (color) doc.fillColor("black");

      x += cw;
    });
    return y + h;
  };

  // ── Header band ──────────────────────────────────────────────────────────
  const bandH = 36;
  let y = doc.y;
  doc.rect(L, y, PW, bandH).fillColor("#e8e8e8").fill();
  doc.rect(L, y, PW, bandH).lineWidth(lw).strokeColor("#aaa").stroke();
  doc.fillColor("black");

  // Helvetica cannot render Devanagari — use romanised transliteration
  doc.font("Helvetica-Bold").fontSize(13)
     .text("Bhartiya Praudyogiki Sansthan, Patna", L, y + 4, { align: "center", width: PW });
  doc.font("Helvetica-Bold").fontSize(10)
     .text("INDIAN INSTITUTE OF TECHNOLOGY PATNA", L, y + 20, { align: "center", width: PW });

  y += bandH + 8;

  // ── Form title ───────────────────────────────────────────────────────────
  doc.font("Helvetica-Bold").fontSize(11)
     .text("Form for Entry Pass: Domestic Help/Tutor/Driver/Supplier", L, y, {
       align: "center", width: PW, underline: true,
     });
  y += 22;

  // ── Pass No. box (top-right) ─────────────────────────────────────────────
  const boxW = 200;
  const boxH = 32;
  const boxX = L + PW - boxW;
  doc.rect(boxX, y, boxW, boxH).lineWidth(lw).stroke();
  doc.font("Helvetica-Bold").fontSize(8).fillColor("red")
     .text("Pass No. & issue date (for office use)", boxX + 4, y + 3, { width: boxW - 8 });
  doc.fillColor("black");
  doc.moveTo(boxX, y + 14).lineTo(boxX + boxW, y + 14).lineWidth(lw).stroke();
  doc.font("Helvetica").fontSize(8)
     .text("IITP/DH/202\u2026/        dated-", boxX + 4, y + 17, { width: boxW - 8 });

  y += boxH + 6;

  // ── Table 1: Applicant details ───────────────────────────────────────────
  // Column widths: label1=0.27, value1=0.28, label2=0.21, value2=0.24
  const rh = 20;

  // Row 1 – Name of the Applicant (label spans 0.27, value spans rest)
  y = drawRow(y, rh, [
    { text: "Name of the Applicant", w: 0.27 },
    { text: applicantName,            w: 0.73 },
  ]);

  // Row 2 – Employee No. | value | Designation | value
  y = drawRow(y, rh, [
    { text: "Employee No.",  w: 0.27 },
    { text: employeeNo,      w: 0.25 },
    { text: "Designation",   w: 0.21 },
    { text: designation,     w: 0.27 },
  ]);

  // Row 3 – Department/Section | value | Email id | value
  y = drawRow(y, rh, [
    { text: "Department /Section", w: 0.27 },
    { text: department,            w: 0.25 },
    { text: "Email id",            w: 0.21 },
    { text: emailId,               w: 0.27 },
  ]);

  // Row 4 – Flat No. | value | Mobile No. | value
  y = drawRow(y, rh, [
    { text: "Flat No.",   w: 0.27 },
    { text: flatNo,       w: 0.25 },
    { text: "Mobile No.", w: 0.21 },
    { text: mobileNo,     w: 0.27 },
  ]);

  y += 5;

  // ── Table 2: Domestic help details ──────────────────────────────────────
  const rh2 = 20;

  // Row 1 – Name of DH (label bold | value)
  y = drawRow(y, rh2, [
    { text: "Name of the Domestic Help/Tutor/Driver/Supplier", w: 0.48, bold: true },
    { text: helperName, w: 0.52 },
  ]);

  // Row 2 – Aadhar | value | Mobile No. | value
  y = drawRow(y, rh2, [
    { text: "Aadhar Card/ Photo Id No.", w: 0.28, bold: true },
    { text: helperAadhar,                w: 0.25 },
    { text: "Mobile No.",                w: 0.21, bold: true },
    { text: helperMobile,                w: 0.26 },
  ]);

  // Row 3 – Visible identification mark | value
  y = drawRow(y, rh2, [
    { text: "Visible identification mark", w: 0.35, bold: true },
    { text: identMark, w: 0.65 },
  ]);

  // Row 4 – Employed as | value
  y = drawRow(y, rh2, [
    { text: "Employed as", w: 0.35, bold: true },
    { text: employedAs,   w: 0.65 },
  ]);

  // Row 5 – Campus entry & exit time | value
  y = drawRow(y, rh2, [
    { text: "Campus entry & exit time", w: 0.35, bold: true },
    { text: entryExitTime, w: 0.65 },
  ]);

  // ── Enclosure note box ───────────────────────────────────────────────────
  const noteH = 72;
  doc.rect(L, y, PW, noteH).lineWidth(lw).stroke();

  doc.font("Helvetica-Oblique").fontSize(fs)
     .text("Please find the ", L + pad, y + pad, { continued: true });
  doc.font("Helvetica-BoldOblique").fontSize(fs)
     .text("enclosed attested Copy", { continued: true });
  doc.font("Helvetica-Oblique").fontSize(fs)
     .text(
       " of Photo Id /Aadhar card & 02 passport size photographs of Domestic Help/Tutor/Driver/Supplier.",
       { continued: false, width: PW - pad * 2 }
     );

  doc.font("Helvetica").fontSize(fs)
     .text("Signature of applicant with date", L + PW - 168, y + noteH - 18);

  y += noteH + 12;

  // ── Office Note ──────────────────────────────────────────────────────────
  doc.font("Helvetica").fontSize(fs).text("Office Note:", L, y, { underline: true });
  y += 60;

  doc.font("Helvetica").fontSize(fs)
     .text("Signature of Security Officer", L, y, { align: "right", width: PW });

  y += 20;

  // ── Remarks by PIC Security ──────────────────────────────────────────────
  doc.font("Helvetica").fontSize(fs).text("Remarks by PIC Security: -", L, y, { underline: true });
  y += 60;

  doc.font("Helvetica").fontSize(fs)
     .text("Signature of PIC Security", L, y, { align: "right", width: PW });
};

module.exports = { renderSecurityRequisitionForEntryPassPdf };

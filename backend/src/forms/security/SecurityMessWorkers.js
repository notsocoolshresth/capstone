const { getResponseValue } = require("../../utils/pdfUtils");

const renderSecurityMessWorkersPdf = (doc, submission) => {
  const responses = submission.responses;

  const hostelName  = String(getResponseValue(responses, "hostelName") || "").trim();
  const vendorName  = String(getResponseValue(responses, "vendorName") || "").trim();

  // Collect workers 1–20; keep only those with a name filled in
  const workers = [];
  for (let i = 1; i <= 20; i++) {
    const name   = String(getResponseValue(responses, `worker${i}Name`)   || "").trim();
    const aadhar = String(getResponseValue(responses, `worker${i}Aadhar`) || "").trim();
    if (name) workers.push({ name, aadhar });
  }

  const leftMargin = doc.page.margins.left;
  const pageWidth  = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // ── Title ─────────────────────────────────────────────────────────────────
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Indian Institute of Technology Patna", leftMargin, doc.y, {
      align: "center",
      width: pageWidth,
      underline: true,
    });

  doc.moveDown(0.3);

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("(Mess Worker Initial Entry Form)", leftMargin, doc.y, {
      align: "center",
      width: pageWidth,
    });

  doc.moveDown(1.5);

  // ── To block ──────────────────────────────────────────────────────────────
  doc.font("Helvetica-Bold").fontSize(11).text("To,", leftMargin, doc.y);
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(11).text("The Warden", leftMargin, doc.y);
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(11).text(`${hostelName ? hostelName + " Hostel" : "………………….Hostel"}`, leftMargin, doc.y);
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(11).text("IIT Patna", leftMargin, doc.y);

  doc.moveDown(1.2);

  // ── Subject ───────────────────────────────────────────────────────────────
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Subject: Request for Entry of Mess Vendor/Workers", leftMargin, doc.y);

  doc.moveDown(0.8);

  // ── Body ──────────────────────────────────────────────────────────────────
  doc
    .font("Helvetica")
    .fontSize(11)
    .text(
      "In accordance with the procedures for the entry and stay of workers deployed by the mess vendor for " +
      "catering services, we hereby submit the following details for approval of entry for our workers:",
      leftMargin,
      doc.y,
      { width: pageWidth, align: "justify" }
    );

  doc.moveDown(1);

  // ── Worker Details header ─────────────────────────────────────────────────
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Worker Details: ", leftMargin, doc.y, { continued: true, underline: true });
  doc
    .font("Helvetica")
    .fontSize(11)
    .text("(Enclose a copy of photo Id of each worker)", { continued: false, underline: false, italics: true });

  doc.moveDown(0.6);

  // Column headers
  const col1X = leftMargin + 20;
  const col2X = leftMargin + pageWidth * 0.5;

  doc.font("Helvetica-Bold").fontSize(11);
  doc.text("Name of Worker", col1X, doc.y, { continued: false });
  doc.text("Aadhar Number",  col2X, doc.y - doc.currentLineHeight(true));

  doc.moveDown(0.5);

  // Worker rows — only filled entries
  doc.font("Helvetica").fontSize(11);
  workers.forEach((w, i) => {
    const rowY = doc.y;
    doc.text(`${i + 1}.  ${w.name}`, col1X, rowY, { continued: false });
    doc.text(w.aadhar || "", col2X, rowY);
    doc.moveDown(0.55);
  });

  doc.moveDown(0.8);

  // ── Undertaking ───────────────────────────────────────────────────────────
  doc.font("Helvetica-Bold").fontSize(11).text("Undertaking:", leftMargin, doc.y);
  doc.moveDown(0.4);

  doc
    .font("Helvetica")
    .fontSize(11)
    .text("We, the undersigned, hereby undertake that:", leftMargin, doc.y);

  doc.moveDown(0.4);

  const undertakings = [
    "All workers listed above will follow the rules and regulations set forth by IIT Patna for security and campus safety.",
    "We will ensure the workers have valid Aadhar Cards and relevant documents for identification purposes.",
    "We will submit updated records for new workers as required and promptly inform the authorities of any changes to the worker list.",
    "We will comply with all IIT Patna campus regulations, including those regarding the use of vehicles for work-related purposes.",
    "We agree to provide timely exit details and remove any worker from the campus once their deployment ends.",
    "We will ensure that the workers maintain proper decorum and behave responsibly during their stay.",
  ];

  undertakings.forEach((point, idx) => {
    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`${idx + 1}.  ${point}`, leftMargin + 16, doc.y, {
        width: pageWidth - 16,
        align: "justify",
      });
    doc.moveDown(0.45);
  });

  doc.moveDown(1);

  // ── Vendor Signature ──────────────────────────────────────────────────────
  const sigLineW = 160;
  const sigX = leftMargin + pageWidth * 0.42;

  doc
    .font("Helvetica")
    .fontSize(11)
    .text(`Signature: ……………………   Name: ${vendorName || "………………"}`, sigX, doc.y, {
      width: pageWidth - (sigX - leftMargin),
      align: "left",
    });
  doc.moveDown(0.3);
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("(Authorized representative of the Mess Vendor)", sigX, doc.y, {
      width: pageWidth - (sigX - leftMargin),
      align: "left",
    });

  doc.moveDown(1.5);

  // ── Recommendation by the Warden ─────────────────────────────────────────
  doc.font("Helvetica-Bold").fontSize(11).text("Recommendation by the Warden:", leftMargin, doc.y);

  doc.moveDown(2.5);

  // Bottom: Hostel Office Stamp (left) + Signature of Warden (right) + Date
  const bottomY = doc.y;

  doc.font("Helvetica").fontSize(11).text("Hostel Office Stamp", leftMargin, bottomY);
  doc
    .font("Helvetica")
    .fontSize(11)
    .text("Signature of Warden", leftMargin + pageWidth - 120, bottomY);

  doc.moveDown(1.2);
  doc.font("Helvetica").fontSize(11).text("Date:……………...", leftMargin, doc.y);
};

module.exports = { renderSecurityMessWorkersPdf };

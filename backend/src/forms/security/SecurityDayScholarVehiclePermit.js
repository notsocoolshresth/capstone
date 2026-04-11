const { getResponseValue, formatDate } = require("../../utils/pdfUtils");

const renderSecurityDayScholarVehiclePermitPdf = (doc, submission) => {
  const responses = submission.responses;

  // Day Scholar Details
  const nameRollNumber   = String(getResponseValue(responses, "nameRollNumber") || "").trim();
  const mobileNumber     = String(getResponseValue(responses, "mobileNumber") || "").trim();
  const instituteEmail   = String(getResponseValue(responses, "instituteEmail") || "").trim();
  const department       = String(getResponseValue(responses, "department") || "").trim();

  // Vehicle Details
  const ownerName        = String(getResponseValue(responses, "ownerName") || "").trim();
  const ownerRelationship = String(getResponseValue(responses, "ownerRelationship") || "").trim();
  const vehicleRegNo     = String(getResponseValue(responses, "vehicleRegNo") || "").trim();
  const engineNumber     = String(getResponseValue(responses, "engineNumber") || "").trim();
  const chassisNumber    = String(getResponseValue(responses, "chassisNumber") || "").trim();
  const vehicleType      = String(getResponseValue(responses, "vehicleType") || "").trim();

  // Residential Address
  const residentialAddress = String(getResponseValue(responses, "residentialAddress") || "").trim();

  const leftMargin  = doc.page.margins.left;
  const rightMargin = doc.page.margins.right;
  const pageWidth   = doc.page.width - leftMargin - rightMargin;

  // ── Title ─────────────────────────────────────────────────────────────────
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(
      "IIT PATNA – DAY SCHOLAR VEHICLE PERMIT & PARKING PERMISSION FORM",
      leftMargin,
      doc.y,
      { align: "center", width: pageWidth }
    );

  doc.moveDown(1.2);

  // ── Day Scholar Details (left) + Passport photo box (right) ───────────────
  const photoBoxW  = 100;
  const photoBoxH  = 110;
  const photoBoxX  = doc.page.width - rightMargin - photoBoxW;
  const detailsStartY = doc.y;

  doc.font("Helvetica-Bold").fontSize(11).text("Day Scholar Details:", leftMargin, detailsStartY);
  doc.moveDown(0.5);

  // Dotted-line helper (value + trailing dots)
  const dottedLine = (label, value, indent = 8) => {
    const y = doc.y;
    const text = `${label}${value ? " " + value : ""}`;
    doc.font("Helvetica").fontSize(10).text(text, leftMargin + indent, y, {
      width: photoBoxX - leftMargin - indent - 10,
      continued: false,
    });
    doc.moveDown(0.55);
  };

  dottedLine("1.  Name & Roll Number:", nameRollNumber);
  dottedLine("2.  Mobile Number:", `${mobileNumber}${mobileNumber && instituteEmail ? "  &  Institute Email: " + instituteEmail : ""}`);
  dottedLine("3.  Department:", department);

  // Passport photo box
  doc
    .rect(photoBoxX, detailsStartY, photoBoxW, photoBoxH)
    .lineWidth(0.8)
    .stroke();
  doc
    .font("Helvetica")
    .fontSize(8)
    .text(
      "Affix passport size\nphotograph\n(1 extra photo to be\nsubmitted along\nwith the form)",
      photoBoxX + 4,
      detailsStartY + 22,
      { width: photoBoxW - 8, align: "center" }
    );

  doc.moveDown(1.2);

  // ── Vehicle Details ────────────────────────────────────────────────────────
  doc.font("Helvetica-Bold").fontSize(11).text("Vehicle Details", leftMargin, doc.y);
  doc.moveDown(0.5);

  const vdottedLine = (label, value) => {
    doc.font("Helvetica").fontSize(10).text(
      `${label}${value ? " " + value : ""}`,
      leftMargin + 8,
      doc.y,
      { width: pageWidth - 8, continued: false }
    );
    doc.moveDown(0.55);
  };

  vdottedLine("1.  Owner Name:", ownerName);
  vdottedLine("2.  Relationship (if not owned by student):", ownerRelationship);
  vdottedLine("3.  Vehicle Registration Number (RC):", vehicleRegNo);
  vdottedLine(
    "4.  Engine Number:",
    `${engineNumber}${engineNumber && chassisNumber ? "  &  Chassis Number: " + chassisNumber : ""}`
  );
  vdottedLine("5.  Type of Vehicle (Car/Bike/Scooter):", vehicleType);

  doc.moveDown(0.8);

  // ── Residential Address ────────────────────────────────────────────────────
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Residential Address (Daily Commute From):", leftMargin, doc.y);

  doc.moveDown(0.4);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(residentialAddress || " ", leftMargin + 8, doc.y, { width: pageWidth - 8 });

  // Underline(s) for address area
  const addrY1 = doc.y + 4;
  doc.moveTo(leftMargin, addrY1).lineTo(leftMargin + pageWidth, addrY1).lineWidth(0.5).stroke();
  const addrY2 = addrY1 + 16;
  doc.moveTo(leftMargin, addrY2).lineTo(leftMargin + pageWidth, addrY2).lineWidth(0.5).stroke();
  doc.y = addrY2 + 10;

  doc.moveDown(1);

  // ── Undertaking divider ────────────────────────────────────────────────────
  doc.moveTo(leftMargin, doc.y).lineTo(leftMargin + pageWidth, doc.y).lineWidth(0.5).stroke();
  doc.moveDown(0.6);

  doc.font("Helvetica-Bold").fontSize(11).text("Undertaking by the Student", leftMargin, doc.y);
  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "I hereby declare that the above-mentioned vehicle will be used exclusively for commuting between my " +
      "residence and the IIT Patna campus. I agree to park my vehicle only at the ",
      leftMargin,
      doc.y,
      { width: pageWidth, continued: true }
    );
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("designated parking area adjacent to Block-IX,", { continued: true });
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      " allocated by IIT Patna for Day Scholars. For commuting within the campus, I will use other permissible " +
      "modes of conveyance as per institute guidelines. Violation of the parking or conveyance rules will result " +
      "a penalty as per the Office Order IITP/R/OO/2023/1527.",
      { continued: false, width: pageWidth }
    );

  doc.moveDown(0.8);

  doc
    .font("Helvetica")
    .fontSize(10)
    .text("I have enclosed the following self-attested documents:", leftMargin, doc.y);
  doc.moveDown(0.4);
  doc.text("1.  Copy of Registration Certificate (RC) of the vehicle", leftMargin + 16, doc.y);
  doc.moveDown(0.35);
  doc.text("2.  Copy of Driving Licence", leftMargin + 16, doc.y);
  doc.moveDown(0.35);
  doc.text("3.  Copy of IIT Patna Identity Card", leftMargin + 16, doc.y);

  doc.moveDown(1.2);

  // Signature line – Day Scholar
  const dateLineW = 140;
  const dateLabelX = leftMargin + pageWidth * 0.58;   // Date column (original position)
  const sigY = doc.y;

  doc.font("Helvetica").fontSize(10).text("Signature of the Day Scholar:", leftMargin, sigY);
  const sigLineStartX = leftMargin + doc.widthOfString("Signature of the Day Scholar: ") + 4;
  // Underline ends 10pt before the Date label – never overlaps
  const sigLineW = dateLabelX - sigLineStartX - 10;
  doc.moveTo(sigLineStartX, sigY + 10).lineTo(sigLineStartX + sigLineW, sigY + 10).lineWidth(0.5).stroke();

  doc.font("Helvetica").fontSize(10).text("Date:", dateLabelX, sigY);
  const dateLineX = dateLabelX + doc.widthOfString("Date: ") + 4;
  doc.moveTo(dateLineX, sigY + 10).lineTo(dateLineX + dateLineW, sigY + 10).lineWidth(0.5).stroke();

  doc.moveDown(1.2);

  // ── Supervisor / PI Certification ──────────────────────────────────────────
  doc.moveTo(leftMargin, doc.y).lineTo(leftMargin + pageWidth, doc.y).lineWidth(0.5).stroke();
  doc.moveDown(0.6);

  doc.font("Helvetica-Bold").fontSize(11).text("Supervisor/PI Certification", leftMargin, doc.y);
  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "I hereby certify that the above student is a day scholar and is not residing in any hostel of IIT Patna.",
      leftMargin,
      doc.y,
      { width: pageWidth }
    );

  doc.moveDown(0.9);

  const supY = doc.y;
  doc.font("Helvetica").fontSize(10).text("Name & Signature of Supervisor/PI", leftMargin, supY);
  const supLineX = leftMargin + doc.widthOfString("Name & Signature of Supervisor/PI") + 6;
  doc.moveTo(supLineX, supY + 10).lineTo(supLineX + 100, supY + 10).lineWidth(0.5).stroke();

  const supDateX = leftMargin + pageWidth * 0.65;
  doc.font("Helvetica").fontSize(10).text("Date:", supDateX, supY);
  const supDateLineX = supDateX + doc.widthOfString("Date: ") + 4;
  doc.moveTo(supDateLineX, supY + 10).lineTo(supDateLineX + 110, supY + 10).lineWidth(0.5).stroke();

  doc.moveDown(1.2);

  // ── Verification by Office of the Dean ────────────────────────────────────
  doc.moveTo(leftMargin, doc.y).lineTo(leftMargin + pageWidth, doc.y).lineWidth(2).strokeColor("#888").stroke();
  doc.strokeColor("black");
  doc.moveDown(0.6);

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Verification by Office of the Dean of Student Affairs", leftMargin, doc.y);
  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "This is to confirm that the details provided above have been checked, verified and found correct.",
      leftMargin,
      doc.y,
      { width: pageWidth }
    );

  doc.moveDown(0.9);

  const verY = doc.y;
  doc.font("Helvetica").fontSize(10).text("Verified by (Seal and Signature)", leftMargin, verY);
  const verLineX = leftMargin + doc.widthOfString("Verified by (Seal and Signature)") + 6;
  doc.moveTo(verLineX, verY + 10).lineTo(verLineX + 100, verY + 10).lineWidth(0.5).stroke();

  const verDateX = leftMargin + pageWidth * 0.65;
  doc.font("Helvetica").fontSize(10).text("Date:", verDateX, verY);
  const verDateLineX = verDateX + doc.widthOfString("Date: ") + 4;
  doc.moveTo(verDateLineX, verY + 10).lineTo(verDateLineX + 110, verY + 10).lineWidth(0.5).stroke();

  doc.moveDown(1);

  // ── For Office Use Only ────────────────────────────────────────────────────
  doc.font("Helvetica-Bold").fontSize(11).text("For Office Use Only", leftMargin, doc.y);

  doc.moveDown(1);
  doc
    .font("Helvetica")
    .fontSize(11)
    .text("Security Officer", { align: "center", width: pageWidth });

  doc.moveDown(1.5);
  doc
    .font("Helvetica")
    .fontSize(11)
    .text("PIC Security", { align: "right", width: pageWidth });
};

module.exports = { renderSecurityDayScholarVehiclePermitPdf };

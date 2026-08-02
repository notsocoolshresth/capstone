const { formatDate, getResponseValue } = require("../../utils/pdfUtils");

const sanitize = (value) => String(value || "").replace(/\s+/g, " ").trim();

const normalizeJourney = (journey = {}) => ({
  departureStation: sanitize(journey.departureStation),
  departureDate: formatDate(journey.departureDate),
  departureTime: sanitize(journey.departureTime),
  arrivalStation: sanitize(journey.arrivalStation),
  arrivalDate: formatDate(journey.arrivalDate),
  arrivalTime: sanitize(journey.arrivalTime),
  modeOfJourney: sanitize(journey.modeOfJourney),
  fare: sanitize(journey.fare),
  distanceTravelled: sanitize(journey.distanceTravelled),
  ticketNosRemarks: sanitize(journey.ticketNosRemarks),
});

const normalizeLocalConveyance = (item = {}) => ({
  dateFrom: formatDate(item.dateFrom),
  dateTo: formatDate(item.dateTo),
  modeOfJourney: sanitize(item.modeOfJourney),
  fare: sanitize(item.fare),
  voucherAttached: sanitize(item.voucherAttached),
  remarks: sanitize(item.remarks),
});

const hasJourneyContent = (journey) =>
  Object.values(normalizeJourney(journey)).some((value) => String(value || "").trim() !== "");

const hasLocalConveyanceContent = (item) =>
  Object.values(normalizeLocalConveyance(item)).some((value) => String(value || "").trim() !== "");

const ensureSpace = (doc, requiredHeight) => {
  const bottomLimit = doc.page.height - doc.page.margins.bottom - 12;
  if (doc.y + requiredHeight <= bottomLimit) {
    return;
  }
  doc.addPage();
};

const resetCursor = (doc) => {
  doc.x = doc.page.margins.left;
};

const drawSectionHeading = (doc, title) => {
  ensureSpace(doc, 28);
  resetCursor(doc);
  doc.moveDown(0.25);
  resetCursor(doc);
  doc.font("Helvetica-Bold").fontSize(12).text(title, doc.page.margins.left, doc.y);
  doc.moveDown(0.25);
  resetCursor(doc);
};

const drawTwoColumnRow = (doc, leftText, rightText = "") => {
  ensureSpace(doc, 24);
  const left = doc.page.margins.left;
  const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const gap = 16;
  const columnWidth = (availableWidth - gap) / 2;
  const y = doc.y;
  const options = { width: columnWidth, lineGap: 1 };

  resetCursor(doc);
  doc.font("Helvetica").fontSize(10.5).text(leftText, left, y, options);
  doc.text(rightText, left + columnWidth + gap, y, options);

  const leftHeight = doc.heightOfString(leftText, options);
  const rightHeight = doc.heightOfString(rightText, options);
  doc.y = y + Math.max(leftHeight, rightHeight) + 5;
  resetCursor(doc);
};

const drawParagraph = (doc, text) => {
  ensureSpace(doc, 36);
  resetCursor(doc);
  doc.font("Helvetica").fontSize(10.5).text(text, doc.page.margins.left, doc.y, {
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: "justify",
    lineGap: 1,
  });
  doc.moveDown(0.25);
  resetCursor(doc);
};

const drawTable = (doc, columns, rows, options = {}) => {
  const left = doc.page.margins.left;
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);
  const headerHeight = options.headerHeight || 24;
  const rowHeight = options.rowHeight || 28;
  const fontSize = options.fontSize || 8.5;
  const headerFontSize = options.headerFontSize || 8.5;
  const bottomLimit = () => doc.page.height - doc.page.margins.bottom - 12;

  const drawHeader = (y) => {
    let x = left;
    columns.forEach((column) => {
      doc.rect(x, y, column.width, headerHeight).lineWidth(0.6).stroke();
      doc.font("Helvetica-Bold").fontSize(headerFontSize).text(column.label, x + 3, y + 6, {
        width: column.width - 6,
        align: column.align || "center",
        ellipsis: true,
      });
      x += column.width;
    });
    return y + headerHeight;
  };

  let y = doc.y;
  ensureSpace(doc, headerHeight + rowHeight + 8);
  resetCursor(doc);
  y = drawHeader(doc.y);

  rows.forEach((row) => {
    if (y + rowHeight > bottomLimit()) {
      doc.addPage();
      y = drawHeader(doc.page.margins.top);
    }

    let x = left;
    columns.forEach((column) => {
      const value = row[column.key] || "";
      doc.rect(x, y, column.width, rowHeight).lineWidth(0.5).stroke();
      doc.font("Helvetica").fontSize(fontSize).text(value, x + 3, y + 5, {
        width: column.width - 6,
        align: column.align || "left",
        ellipsis: true,
      });
      x += column.width;
    });

    y += rowHeight;
  });

  doc.rect(left, y, tableWidth, 0).stroke();
  doc.y = y + 10;
  resetCursor(doc);
};

const renderFinanceTravellingAllowanceBillPdf = (doc, submission) => {
  const responses = submission.responses;

  const claimantName = sanitize(getResponseValue(responses, "claimantName"));
  const empNo = sanitize(getResponseValue(responses, "empNo"));
  const designation = sanitize(getResponseValue(responses, "designation"));
  const accountHead = sanitize(getResponseValue(responses, "accountHead"));
  const departmentSection = sanitize(getResponseValue(responses, "departmentSection"));
  const bankAccountNo = sanitize(getResponseValue(responses, "bankAccountNo"));
  const gradePay = sanitize(getResponseValue(responses, "gradePay"));
  const contactNo = sanitize(getResponseValue(responses, "contactNo"));
  const ifsc = sanitize(getResponseValue(responses, "ifsc"));
  const purposeOfJourney = sanitize(getResponseValue(responses, "purposeOfJourney"));
  const totalAmountClaimed = sanitize(getResponseValue(responses, "totalAmountClaimed"));
  const claimDate = formatDate(getResponseValue(responses, "claimDate"));

  const registrationFee = sanitize(getResponseValue(responses, "registrationFee"));
  const hotelLodgingCharges = sanitize(getResponseValue(responses, "hotelLodgingCharges"));
  const visaFee = sanitize(getResponseValue(responses, "visaFee"));
  const foodCharges = sanitize(getResponseValue(responses, "foodCharges"));
  const insurancePremium = sanitize(getResponseValue(responses, "insurancePremium"));
  const otherCharges = sanitize(getResponseValue(responses, "otherCharges"));

  const advanceTaken = sanitize(getResponseValue(responses, "advanceTaken"));
  const officeNetAmountClaimed = sanitize(getResponseValue(responses, "officeNetAmountClaimed"));
  const officeRailFare = sanitize(getResponseValue(responses, "officeRailFare"));
  const officeRoadMileage = sanitize(getResponseValue(responses, "officeRoadMileage"));
  const officeLocalConveyance = sanitize(getResponseValue(responses, "officeLocalConveyance"));
  const officeFoodCharges = sanitize(getResponseValue(responses, "officeFoodCharges"));
  const officeAccommodationCharges = sanitize(getResponseValue(responses, "officeAccommodationCharges"));
  const officeOtherCharges = sanitize(getResponseValue(responses, "officeOtherCharges"));
  const officeTotalAdmissibleAmount = sanitize(getResponseValue(responses, "officeTotalAdmissibleAmount"));
  const lessAdvanceDta = sanitize(getResponseValue(responses, "lessAdvanceDta"));
  const lessAdvanceClaimant = sanitize(getResponseValue(responses, "lessAdvanceClaimant"));
  const netAmountWords = sanitize(getResponseValue(responses, "netAmountWords"));

  const treatedAsGuest = sanitize(getResponseValue(responses, "treatedAsGuest"));
  const freeBoardingLodging = sanitize(getResponseValue(responses, "freeBoardingLodging"));
  const availedFreeTransport = sanitize(getResponseValue(responses, "availedFreeTransport"));

  const journeys = Array.isArray(getResponseValue(responses, "journeys"))
    ? getResponseValue(responses, "journeys")
        .map((journey) => normalizeJourney(journey))
        .filter(hasJourneyContent)
    : [];

  const localConveyances = Array.isArray(getResponseValue(responses, "localConveyances"))
    ? getResponseValue(responses, "localConveyances")
        .map((item) => normalizeLocalConveyance(item))
        .filter(hasLocalConveyanceContent)
    : [];

  doc.font("Helvetica-Bold").fontSize(14).text("INDIAN INSTITUTE OF TECHNOLOGY PATNA", {
    align: "center",
  });
  doc.moveDown(0.2);
  doc.font("Helvetica-Bold").fontSize(13).text(
    "TRAVELLING ALLOWANCE BILL (OFFICIAL VISIT / SEMINAR & CONFERENCE ATTENDED)",
    {
      align: "center",
    }
  );
  doc.moveDown(0.6);

  drawSectionHeading(doc, "Claimant Details");
  drawTwoColumnRow(doc, `Name: ${claimantName}`, `Emp No.: ${empNo}`);
  drawTwoColumnRow(doc, `Designation: ${designation}`, `Account Head: ${accountHead}`);
  drawTwoColumnRow(doc, `Department / Section: ${departmentSection}`, `Bank Account No.: ${bankAccountNo}`);
  drawTwoColumnRow(doc, `Grade Pay: ${gradePay}`, `Contact No.: ${contactNo}`);
  drawTwoColumnRow(doc, `IFSC: ${ifsc}`, `Date: ${claimDate}`);

  drawSectionHeading(doc, "1. Particulars of Journey");
  drawTable(
    doc,
    [
      { key: "departureStation", label: "From Station", width: 54 },
      { key: "departureDate", label: "Date", width: 50, align: "center" },
      { key: "departureTime", label: "Time", width: 32, align: "center" },
      { key: "arrivalStation", label: "To Station", width: 54 },
      { key: "arrivalDate", label: "Date", width: 50, align: "center" },
      { key: "arrivalTime", label: "Time", width: 32, align: "center" },
      { key: "modeOfJourney", label: "Mode", width: 44, align: "center" },
      { key: "fare", label: "Fare (Rs.)", width: 40, align: "right" },
      { key: "distanceTravelled", label: "Distance", width: 40, align: "right" },
      { key: "ticketNosRemarks", label: "Ticket Nos. / Remarks", width: 109 },
    ],
    journeys.length > 0 ? journeys : [normalizeJourney()],
    {
      rowHeight: 30,
      fontSize: 7.2,
      headerFontSize: 7.3,
    }
  );

  drawSectionHeading(doc, "2. Particulars of Local Conveyance Used");
  drawTable(
    doc,
    [
      { key: "dateFrom", label: "From", width: 70, align: "center" },
      { key: "dateTo", label: "To", width: 70, align: "center" },
      { key: "modeOfJourney", label: "Mode", width: 80, align: "center" },
      { key: "fare", label: "Fare (Rs.)", width: 60, align: "right" },
      { key: "voucherAttached", label: "Voucher Attached", width: 70, align: "center" },
      { key: "remarks", label: "Remarks", width: 155 },
    ],
    localConveyances.length > 0 ? localConveyances : [normalizeLocalConveyance()],
    {
      rowHeight: 28,
      fontSize: 8.2,
      headerFontSize: 8.2,
    }
  );

  drawSectionHeading(doc, "3. Particulars of Other Expenses Incurred");
  drawTwoColumnRow(doc, `Registration Fee: ${registrationFee}`, `Hotel / Lodging Charges: ${hotelLodgingCharges}`);
  drawTwoColumnRow(doc, `VISA Fee: ${visaFee}`, `Food Charges: ${foodCharges}`);
  drawTwoColumnRow(doc, `Insurance Premium: ${insurancePremium}`, `Other Charges: ${otherCharges}`);
  drawTwoColumnRow(doc, `Total Amount Claimed (in Rs.): ${totalAmountClaimed}`, "");

  drawSectionHeading(doc, "4. Purpose of Journey");
  drawParagraph(doc, purposeOfJourney || "-");

  drawSectionHeading(doc, "Declaration");
  drawParagraph(
    doc,
    "I do hereby certify that the distances for road journeys shown in this bill are correct to the best of my knowledge, the journeys were performed by the shortest routes, and the claims mentioned here have neither been preferred nor paid from any other source."
  );
  drawTwoColumnRow(doc, `Treated as a guest of a Government / Institution: ${treatedAsGuest || "-"}`, `Allowed free boarding / lodging: ${freeBoardingLodging || "-"}`);
  drawTwoColumnRow(doc, `Availed any free transport: ${availedFreeTransport || "-"}`, `Claim Date: ${claimDate || "-"}`);

  drawSectionHeading(doc, "For Office Use Only (Finance & Accounts)");
  drawTwoColumnRow(doc, `Advance taken (in Rs.): ${advanceTaken}`, `Net amount claimed (in Rs.): ${officeNetAmountClaimed}`);
  drawTwoColumnRow(doc, `Rail / Air / Bus Fare (in Rs.): ${officeRailFare}`, `Road Mileages (in Rs.): ${officeRoadMileage}`);
  drawTwoColumnRow(doc, `Local Conveyance (in Rs.): ${officeLocalConveyance}`, `Food Charges (in Rs.): ${officeFoodCharges}`);
  drawTwoColumnRow(doc, `Accommodation Charges (in Rs.): ${officeAccommodationCharges}`, `Other Charges (in Rs.): ${officeOtherCharges}`);
  drawTwoColumnRow(doc, `Total Admissible Amount (in Rs.): ${officeTotalAdmissibleAmount}`, `Less Advance: DTA ${lessAdvanceDta} | Claimant ${lessAdvanceClaimant}`);
  drawParagraph(doc, `Net Amount (Rupees): ${netAmountWords || "-"}`);

  ensureSpace(doc, 72);
  resetCursor(doc);
  doc.moveDown(0.6);

  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const signatureY = doc.y + 10;

  doc.moveTo(left, signatureY).lineTo(left + 150, signatureY).stroke();
  doc.moveTo(right - 150, signatureY).lineTo(right, signatureY).stroke();

  doc.font("Helvetica").fontSize(10.5).text("Signature of the Claimant", left, signatureY + 4, {
    width: 150,
    align: "center",
  });
  doc.text("A.O. / A.R. (F&A)", right - 150, signatureY + 4, {
    width: 150,
    align: "center",
  });

  doc.moveDown(2.4);
  const finalLineY = doc.y + 8;
  doc.moveTo(right - 150, finalLineY).lineTo(right, finalLineY).stroke();
  doc.font("Helvetica-Bold").fontSize(10.5).text("REGISTRAR", right - 150, finalLineY + 4, {
    width: 150,
    align: "center",
  });
};

module.exports = { renderFinanceTravellingAllowanceBillPdf };

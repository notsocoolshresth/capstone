const { getResponseValue, formatDate } = require("../../utils/pdfUtils");

/**
 * Renders the CC R&D cum CC Recommendation for Two-Bid Purchase through GeM PDF.
 * Form No. P004 — Format for procurement in INR using Double Bid Tendering process.
 * Page: A4 (595 x 842 pt). PDFKit top-left origin (y increases downward).
 * Coordinates derived from exact pdfplumber extraction of the original PDF.
 */
const renderCCRDRecommendationTwoBidPurchaseGeMPdf = (doc, submission) => {
  const responses = submission.responses;

  const projectNo        = String(getResponseValue(responses, "projectNo")        || "").trim();
  const date             = formatDate(getResponseValue(responses, "date"));
  const purchaseOf       = String(getResponseValue(responses, "purchaseOf")       || "").trim();
  const supplyItem       = String(getResponseValue(responses, "supplyItem")        || "").trim();
  const gemBidRef        = String(getResponseValue(responses, "gemBidRef")         || "").trim();
  const gemBidDate       = formatDate(getResponseValue(responses, "gemBidDate"));
  const vendorCount      = String(getResponseValue(responses, "vendorCount")       || "").trim();
  const techFirmsCount   = String(getResponseValue(responses, "techFirmsCount")    || "").trim();
  const openedOnDate     = formatDate(getResponseValue(responses, "openedOnDate"));
  const annexureNo       = String(getResponseValue(responses, "annexureNo")        || "").trim();
  const orderForItem     = String(getResponseValue(responses, "orderForItem")       || "").trim();
  const vendorMsName     = String(getResponseValue(responses, "vendorMsName")       || "").trim();
  const fileNo           = String(getResponseValue(responses, "fileNo")             || "").trim();
  const yearOfSanction   = String(getResponseValue(responses, "yearOfSanction")     || "").trim();
  const department       = String(getResponseValue(responses, "department")          || "").trim();
  const category         = String(getResponseValue(responses, "category")            || "").trim();
  const vendorLabel      = String(getResponseValue(responses, "vendorLabel")         || "").trim();
  const vendorName       = String(getResponseValue(responses, "vendorName")          || "").trim();
  const vendorAddr1      = String(getResponseValue(responses, "vendorAddr1")         || "").trim();
  const vendorAddr2      = String(getResponseValue(responses, "vendorAddr2")         || "").trim();

  // Items (up to 3 rows matching the original PDF)
  const item1Desc        = String(getResponseValue(responses, "item1Desc")           || "").trim();
  const item1Rate        = String(getResponseValue(responses, "item1Rate")            || "").trim();
  const item1Qty         = String(getResponseValue(responses, "item1Qty")             || "").trim();
  const item1Amount      = String(getResponseValue(responses, "item1Amount")          || "").trim();
  const item2Desc        = String(getResponseValue(responses, "item2Desc")            || "").trim();
  const item2Rate        = String(getResponseValue(responses, "item2Rate")            || "").trim();
  const item2Qty         = String(getResponseValue(responses, "item2Qty")             || "").trim();
  const item2Amount      = String(getResponseValue(responses, "item2Amount")          || "").trim();
  const item3Desc        = String(getResponseValue(responses, "item3Desc")            || "").trim();
  const item3Rate        = String(getResponseValue(responses, "item3Rate")            || "").trim();
  const item3Qty         = String(getResponseValue(responses, "item3Qty")             || "").trim();
  const item3Amount      = String(getResponseValue(responses, "item3Amount")          || "").trim();

  const extraRow1Label   = String(getResponseValue(responses, "extraRow1Label")      || "").trim();
  const extraRow1Amount  = String(getResponseValue(responses, "extraRow1Amount")      || "").trim();
  const extraRow2Label   = String(getResponseValue(responses, "extraRow2Label")      || "").trim();
  const extraRow2Amount  = String(getResponseValue(responses, "extraRow2Amount")      || "").trim();
  const gstPercent       = String(getResponseValue(responses, "gstPercent")           || "").trim();
  const gstAmount        = String(getResponseValue(responses, "gstAmount")            || "").trim();
  const totalAmount      = String(getResponseValue(responses, "totalAmount")          || "").trim();

  const member1Name      = String(getResponseValue(responses, "member1Name")         || "").trim();
  const member2Name      = String(getResponseValue(responses, "member2Name")         || "").trim();
  const member3Name      = String(getResponseValue(responses, "member3Name")         || "").trim();
  const member4Name      = String(getResponseValue(responses, "member4Name")         || "").trim();
  const jtsName          = String(getResponseValue(responses, "jtsName")             || "").trim();
  const hodCCName        = String(getResponseValue(responses, "hodCCName")            || "").trim();
  const investigatorName = String(getResponseValue(responses, "investigatorName")    || "").trim();
  const arRDName         = String(getResponseValue(responses, "arRDName")             || "").trim();
  const drRDName         = String(getResponseValue(responses, "drRDName")             || "").trim();
  const aDeanRDName      = String(getResponseValue(responses, "aDeanRDName")          || "").trim();
  const directorName     = String(getResponseValue(responses, "directorName")         || "").trim();

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const T = (text, x, y, size, font) => {
    doc.fontSize(size).font(font).text(String(text), x, y, { lineBreak: false });
  };

  const hLine = (x0, x1, y, lw = 0.5) => {
    doc.moveTo(x0, y).lineTo(x1, y).lineWidth(lw).stroke();
  };

  const vLine = (x, y0, y1, lw = 0.5) => {
    doc.moveTo(x, y0).lineTo(x, y1).lineWidth(lw).stroke();
  };

  // ─── HEADER ────────────────────────────────────────────────────────────────
  T("Form No. P004", 458.3, 37.0, 10, "Helvetica-Bold");
  T("Project No\u2026\u2026\u2026.(If applicable)", 376.7, 51.8, 9, "Helvetica");
  if (projectNo) T(projectNo, 420, 51.8, 9, "Helvetica");

  T("Format for procurement in INR using Double Bid Tendering process", 99.4, 66.2, 10.5, "Helvetica-Bold");

  // Title with underline
  T("Recommendation cum Sanction Sheet for the purchase of", 143.5, 81.8, 9.5, "Helvetica");
  T("-------------------", 415.6, 81.8, 9.5, "Helvetica");
  if (purchaseOf) T(purchaseOf, 415.6, 81.8, 9.5, "Helvetica");
  // underline
  hLine(143.5, 485.0, 92.8, 0.8);

  // Date
  T("Date:", 454.7, 106.9, 9.5, "Helvetica-Bold");
  if (date) {
    T(date, 481.3, 106.9, 9.5, "Helvetica");
  } else {
    T("dd-mm-yyyy", 481.3, 106.9, 9, "Helvetica");
  }

  // ─── BODY PARAGRAPHS ───────────────────────────────────────────────────────
  // Para 1
  const supplyStr = supplyItem || "___________________________";
  T(`Quotations for the supply of ${supplyStr} were invited, through GeM bid.`, 108.0, 119.5, 9.5, "Helvetica");

  const gemRefStr  = gemBidRef  || "___________________";
  const gemDateStr = gemBidDate || "dd/mm/yyyy";
  const vendCntStr = vendorCount || "????";
  T(`${gemRefStr}; dated ${gemDateStr}. Responses were received from ${vendCntStr} vendors as given in the`, 72.0, 132.1, 9.5, "Helvetica");
  T("quotation opening report.", 72.0, 144.8, 9.5, "Helvetica");

  const techStr    = techFirmsCount || "---";
  const openedStr  = openedOnDate   || "dd.mm.yyyy";
  const annexStr   = annexureNo     || "?";
  T(`The price bids of ${techStr} nos. of technically satisfied firms were opened on ${openedStr}, in the`, 108.0, 157.4, 9.5, "Helvetica");
  T(`presence of purchase committee members. The item wise details of rate are given in Annexure-${annexStr}.`, 72.0, 170.1, 9.5, "Helvetica");

  const orderStr  = orderForItem || "--------------";
  const vendorStr = vendorMsName || "M/s---------------";
  T(`The purchase committee recommends to place the order for ${orderStr} with ${vendorStr}, the`, 108.0, 182.7, 9.5, "Helvetica");
  T("lowest quoter, as per details given in the next page/below.", 72.0, 195.3, 9.5, "Helvetica");

  // ─── FILE / DEPT BLOCK ─────────────────────────────────────────────────────
  T("File No.:", 108.0, 220.9, 9.5, "Helvetica-Bold");
  if (fileNo) T(fileNo, 165, 220.9, 9.5, "Helvetica");

  T("Year of Sanction:", 108.0, 233.6, 9.5, "Helvetica-Bold");
  if (yearOfSanction) T(yearOfSanction, 205, 233.6, 9.5, "Helvetica");

  T("Department:", 108.0, 246.2, 9.5, "Helvetica-Bold");
  if (department) T(department, 175, 246.2, 9.5, "Helvetica");

  T("Category:", 108.0, 258.8, 9.5, "Helvetica-Bold");
  if (category) T(category, 162, 258.8, 9.5, "Helvetica");

  // ─── VENDOR BLOCK ──────────────────────────────────────────────────────────
  // Always show Vendor label properly
  T("Vendor:", 72.0, 271.5, 9.5, "Helvetica-Bold");

  const vendorLabelStr = vendorLabel || "??";
  T(`Vendor-${vendorLabelStr}:`, 72.0, 271.5, 9.5, "Helvetica-Bold");

  // M/s line
  T("M/s", 180.0, 271.5, 9.5, "Helvetica");

  if (vendorName) {
    T(vendorName, 200.5, 271.5, 9.5, "Helvetica");
  } else {
    T("--------------", 200.5, 271.5, 9.5, "Helvetica");
  }

  if (vendorAddr1) T(vendorAddr1, 180.0, 284.1, 9.5, "Helvetica");
  else T("--------------------", 180.0, 284.1, 9.5, "Helvetica");

  if (vendorAddr2) T(vendorAddr2, 180.0, 296.9, 9.5, "Helvetica");
  else T("--------------------", 180.0, 296.9, 9.5, "Helvetica");

  // ─── ITEMS TABLE ───────────────────────────────────────────────────────────
  // Table bounds from pdfplumber rects:
  // Left=66.4, Right=543.8
  // Columns: 66.4 | 111.0 | 369.5 | 426.1 | 484.9 | 543.8
  // Header row: top=307.9, bot=321.1
  // 3 item rows: 321.1->334.2, 334.2->347.4(wait, PDF has 3+2 extra+3 sub rows+total)
  // Let's map all rows from rects

  const tblL  = 66.4;
  const tblR  = 544.3;
  const colSl = 111.0;  // end of Sl.No
  const colIt = 369.5;  // end of Item desc
  const colRt = 426.1;  // end of Rate
  const colQt = 484.9;  // end of Qty
  // colAm = tblR

  // Row y positions (from rects):
  const r0t = 307.9; // header top
  const r0b = 321.1; // header bot / row1 top
  const r1b = 334.2; // row1 bot / row2 top
  const r2b = 347.4; // row2 bot / row3 top
  const r3b = 360.5; // row3 bot / row4 top (extra 1)
  const r4b = 373.7; // row4 bot / row5 top (extra 2)
  const r5b = 386.9; // row5 bot / gst row top
  const r6b = 400.0; // gst row bot (only right cols)
  const r7b = 413.2; // next sub-row bot
  const r8b = 426.2; // next
  const r9b = 439.4; // next
  const r10b = 453.1; // total row bot

  // Draw all outer border lines
  hLine(tblL, tblR, r0t, 0.8);
  hLine(tblL, tblR, r0b, 0.5);
  hLine(tblL, tblR, r1b, 0.5);
  hLine(tblL, tblR, r2b, 0.5);
  hLine(tblL, tblR, r3b, 0.5);
  hLine(tblL, tblR, r4b, 0.5);
  hLine(tblL, tblR, r5b, 0.5);
  // GST area rows — only right portion col split
  hLine(tblL, tblR, r6b, 0.5);
  hLine(tblL, tblR, r7b, 0.5);
  hLine(tblL, tblR, r8b, 0.5);
  hLine(tblL, tblR, r9b, 0.5);
  hLine(tblL, tblR, r10b, 0.8);

  // Vertical lines for header + item rows (rows 0–5)
  vLine(tblL,  r0t, r5b, 0.5);
  vLine(colSl, r0t, r5b, 0.5);
  vLine(colIt, r0t, r5b, 0.5);
  vLine(colRt, r0t, r5b, 0.5);
  vLine(colQt, r0t, r5b, 0.5);
  vLine(tblR,  r0t, r5b, 0.5);

  // For GST / extra rows: only left border, right-col border, and outer right
  vLine(tblL,  r5b, r10b, 0.5);
  vLine(colRt, r5b, r10b, 0.5);
  vLine(tblR,  r5b, r10b, 0.5);

  // Header text
  T("Sl. No.", 73.4, 309.9, 9.5, "Helvetica-Bold");
  T("Item description (with product code, if any)", 138.2, 309.9, 9.5, "Helvetica-Bold");
  T("Rate", 387.0, 309.9, 9.5, "Helvetica-Bold");
  T("Quantity", 434.7, 309.9, 9.5, "Helvetica-Bold");
  T("Amount", 495.3, 309.9, 9.5, "Helvetica-Bold");

  // Item rows
  const items = [
    { sn: "1.", desc: item1Desc, rate: item1Rate, qty: item1Qty, amt: item1Amount, y: r0b + 2 },
    { sn: "2.", desc: item2Desc, rate: item2Rate, qty: item2Qty, amt: item2Amount, y: r1b + 2 },
    { sn: "3.", desc: item3Desc, rate: item3Rate, qty: item3Qty, amt: item3Amount, y: r2b + 2 },
  ];
  items.forEach(({ sn, desc, rate, qty, amt, y }) => {
    T(sn, 85.9, y, 9, "Helvetica");
    if (desc) T(desc, 116, y, 9, "Helvetica");
    if (rate) T(rate, 375, y, 9, "Helvetica");
    if (qty)  T(qty,  432, y, 9, "Helvetica");
    if (amt)  T(amt,  490, y, 9, "Helvetica");
  });

  // Extra label rows (rows 4 and 5 in original — blank or user-defined)
  if (extraRow1Label) T(extraRow1Label, 116, r3b + 2, 9, "Helvetica");
  if (extraRow1Amount) T(extraRow1Amount, 490, r3b + 2, 9, "Helvetica");
  if (extraRow2Label) T(extraRow2Label, 116, r4b + 2, 9, "Helvetica");
  if (extraRow2Amount) T(extraRow2Amount, 490, r4b + 2, 9, "Helvetica");

  // GST row
  const gstLabel = gstPercent ? `GST @${gstPercent}%` : "GST @??%";
  T(gstLabel, 368.4, r5b + 2, 9, "Helvetica");
  if (gstAmount) T(gstAmount, 490, r5b + 2, 9, "Helvetica");

  // Sub-rows after GST (dashes in original)
  // row r6b..r7b, r7b..r8b, r8b..r9b — filler lines in original
  T("------------", 377.0, r6b + 2, 9, "Helvetica");
  T("------------", 377.0, r7b + 2, 9, "Helvetica");
  T("------------", 377.0, r8b + 2, 9, "Helvetica");

  // Total Amount row
  T("Total Amount", 358.9, r9b + 2, 9.5, "Helvetica-Bold");
  if (totalAmount) T(totalAmount, 490, r9b + 2, 9, "Helvetica");

  // ─── SANCTION LINE ─────────────────────────────────────────
T("Amount as per details given in the above table may be sanctioned.", 108.0, 467.0, 9.5, "Helvetica");

// ─── MEMBER SIGNATURES ─────────────────────────────────────
const memY = 500;

// Signature lines
hLine(50,  160, memY, 0.5);
hLine(180, 290, memY, 0.5);
hLine(300, 410, memY, 0.5);
hLine(420, 530, memY, 0.5);

// Names BELOW line
if (member1Name) T(member1Name, 60,  memY + 5, 8, "Helvetica");
if (member2Name) T(member2Name, 190, memY + 5, 8, "Helvetica");
if (member3Name) T(member3Name, 310, memY + 5, 8, "Helvetica");
if (member4Name) T(member4Name, 430, memY + 5, 8, "Helvetica");

// Labels BELOW names
T("(Member 1)", 60,  memY + 18, 9, "Helvetica");
T("(Member 2)", 190, memY + 18, 9, "Helvetica");
T("(Member 3)", 310, memY + 18, 9, "Helvetica");
T("(Member 4)", 430, memY + 18, 9, "Helvetica");


// ─── GeM ACCOUNT SIGNATURES ─────────────────────────────────
const gemY = 560;

T("For GeM Account:", 60, gemY, 9.5, "Helvetica-Bold");

// JTS
hLine(180, 300, gemY + 15, 0.5);
if (jtsName) T(jtsName, 190, gemY + 18, 8, "Helvetica");
T("JTS/TS (CC)", 190, gemY + 30, 9, "Helvetica");

// HoD
hLine(320, 440, gemY + 15, 0.5);
if (hodCCName) T(hodCCName, 330, gemY + 18, 8, "Helvetica");
T("HoD (CC)", 330, gemY + 30, 9, "Helvetica");


// ─── INVESTIGATOR SIGNATURES ───────────────────────────────
const invY = 610;

// Investigator
hLine(60, 180, invY + 15, 0.5);
if (investigatorName) T(investigatorName, 70, invY + 18, 8, "Helvetica");
T("Investigator(s)", 70, invY + 30, 9, "Helvetica");

// AR
hLine(200, 320, invY + 15, 0.5);
if (arRDName) T(arRDName, 210, invY + 18, 8, "Helvetica");
T("AR(R&D)", 210, invY + 30, 9, "Helvetica");

// DR
hLine(340, 460, invY + 15, 0.5);
if (drRDName) T(drRDName, 350, invY + 18, 8, "Helvetica");
T("DR(R&D)", 350, invY + 30, 9, "Helvetica");


// ─── A DEAN + DIRECTOR ─────────────────────────────────────
const deanY = 670;

// A Dean
hLine(140, 280, deanY + 15, 0.5);
if (aDeanRDName) T(aDeanRDName, 150, deanY + 18, 8, "Helvetica");
T("A Dean(R&D)", 150, deanY + 30, 9, "Helvetica");

// Director
hLine(360, 520, deanY + 15, 0.5);
if (directorName) T(directorName, 380, deanY + 18, 8, "Helvetica");

T("Director", 380, deanY + 30, 9.5, "Helvetica-Bold");
T("IIT Patna", 380, deanY + 42, 9.5, "Helvetica-Bold");

  // ─── NOTE TABLE FINAL ─────────────────────────────────────
const noteY = 720;

T("Note:", 72.0, noteY, 9.5, "Helvetica-Bold");

// Table positions
const dL = 80;
const dR = 520;
const dC1 = 150;
const dC2 = 330;

const rowH = 16;
const startY = noteY + 15;

// Outer border
hLine(dL, dR, startY);
hLine(dL, dR, startY + rowH * 5);

// Horizontal lines
for (let i = 1; i <= 4; i++) {
  hLine(dL, dR, startY + rowH * i);
}

// Vertical lines (NO split on title row)
vLine(dL, startY + rowH, startY + rowH * 5);
vLine(dC1, startY + rowH, startY + rowH * 5);
vLine(dC2, startY + rowH, startY + rowH * 5);
vLine(dR, startY + rowH, startY + rowH * 5);

// Title (CENTERED)
T(
  "Delegation of Financial Power",
  (dL + dR) / 2 - 90,
  startY + 3,
  9.5,
  "Helvetica-Bold"
);

// Column headers
T("Sl No.", dL + 5, startY + rowH + 3, 9, "Helvetica-Bold");
T("Functionaries", dC1 + 5, startY + rowH + 3, 9, "Helvetica-Bold");
T("Amount (Rs.)", dC2 + 5, startY + rowH + 3, 9, "Helvetica-Bold");

// Row 1
T("I", dL + 5, startY + rowH * 2 + 3, 9, "Helvetica");
T("Investigator(s)", dC1 + 5, startY + rowH * 2 + 3, 9, "Helvetica");
T("Upto 01 Lakh", dC2 + 5, startY + rowH * 2 + 3, 9, "Helvetica");

// Row 2
T("Associate Dean (R&D)", dC1 + 5, startY + rowH * 3 + 3, 9, "Helvetica");
T("> 01 Lakh ≤ 02 Lakh", dC2 + 5, startY + rowH * 3 + 3, 9, "Helvetica");

// Row 3
T("II", dL + 5, startY + rowH * 4 + 3, 9, "Helvetica");
T("Director", dC1 + 5, startY + rowH * 4 + 3, 9, "Helvetica");
T("> 02 Lakh", dC2 + 5, startY + rowH * 4 + 3, 9, "Helvetica");

  // ─── PAGE FOOTER ───────────────────────────────────────────────────────────
  T("Page 1 of 1", 278.2, 825.1, 9, "Helvetica");
};

module.exports = { renderCCRDRecommendationTwoBidPurchaseGeMPdf };
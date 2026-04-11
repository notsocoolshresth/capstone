const { getResponseValue, formatDate } = require("../../utils/pdfUtils");

/**
 * Renders the Computer Center R&D cum CC Recommendation for Direct Purchase through GeM PDF.
 * Form No. P002 — Format for procurement by Local Purchase Committee.
 * Page: A4 (595 x 842 pt). PDFKit top-left origin (y increases downward).
 * Coordinates derived from exact pdfplumber extraction of the original PDF.
 */
const renderCCRDRecommendationDirectPurchaseGeMPdf = (doc, submission) => {
  const responses = submission.responses;

  const projectNo = String(getResponseValue(responses, "projectNo") || "").trim();
  const date = formatDate(getResponseValue(responses, "date"));
  const itemDescription = String(getResponseValue(responses, "itemDescription") || "").trim();
  const indentDate = formatDate(getResponseValue(responses, "indentDate"));
  const indentItemName = String(getResponseValue(responses, "indentItemName") || "").trim();

  const srNo_1 = String(getResponseValue(responses, "srNo_1") || "").trim();
  const itemDesc_1 = String(getResponseValue(responses, "itemDesc_1") || "").trim();
  const rate_1 = String(getResponseValue(responses, "rate_1") || "").trim();
  const qty_1 = String(getResponseValue(responses, "qty_1") || "").trim();
  const totalPrice_1 = String(getResponseValue(responses, "totalPrice_1") || "").trim();

  const srNo_2 = String(getResponseValue(responses, "srNo_2") || "").trim();
  const itemDesc_2 = String(getResponseValue(responses, "itemDesc_2") || "").trim();
  const rate_2 = String(getResponseValue(responses, "rate_2") || "").trim();
  const qty_2 = String(getResponseValue(responses, "qty_2") || "").trim();
  const totalPrice_2 = String(getResponseValue(responses, "totalPrice_2") || "").trim();

  const amountInWords = String(getResponseValue(responses, "amountInWords") || "").trim();
  const recommendedItemName = String(getResponseValue(responses, "recommendedItemName") || "").trim();

  const member1Name = String(getResponseValue(responses, "member1Name") || "").trim();
  const member2Name = String(getResponseValue(responses, "member2Name") || "").trim();
  const member3Name = String(getResponseValue(responses, "member3Name") || "").trim();
  const member4Name = String(getResponseValue(responses, "member4Name") || "").trim();

  const jtsName = String(getResponseValue(responses, "jtsName") || "").trim();
  const hodCCName = String(getResponseValue(responses, "hodCCName") || "").trim();
  const investigatorName = String(getResponseValue(responses, "investigatorName") || "").trim();
  const arRDName = String(getResponseValue(responses, "arRDName") || "").trim();
  const drRDName = String(getResponseValue(responses, "drRDName") || "").trim();
  const aDeanRDName = String(getResponseValue(responses, "aDeanRDName") || "").trim();
  const directorName = String(getResponseValue(responses, "directorName") || "").trim();

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const drawText = (text, x, y, fontSize, font) => {
    doc.fontSize(fontSize).font(font).text(text, x, y, { lineBreak: false });
  };

  const hLine = (x0, x1, y, lineWidth = 0.5) => {
    doc.moveTo(x0, y).lineTo(x1, y).lineWidth(lineWidth).stroke();
  };

  const vLine = (x, y0, y1, lineWidth = 0.5) => {
    doc.moveTo(x, y0).lineTo(x, y1).lineWidth(lineWidth).stroke();
  };

  const fillRect = (x, y, w, h, r, g, b) => {
    doc.save().rect(x, y, w, h).fillColor([r, g, b]).fill().restore();
    doc.fillColor("black");
  };

  // ─── TOP-RIGHT HEADER ───────────────────────────────────────────────────────
  drawText("Form No. P002", 447.4, 72.4, 10, "Helvetica-Bold");
  drawText("Project No\u2026\u2026\u2026.(If applicable)", 367.9, 86.7, 9.5, "Helvetica");
  if (projectNo) drawText(projectNo, 427, 86.7, 9.5, "Helvetica");

  // ─── FORMAT TITLE ───────────────────────────────────────────────────────────
  drawText("Format for procurement by Local Purchase Committee", 136.7, 100.8, 11, "Helvetica-Bold");

  // ─── PAGE LABEL ─────────────────────────────────────────────────────────────
  drawText("Page 1 of 1", 271.3, 115, 9, "Helvetica");

  // ─── DATE ───────────────────────────────────────────────────────────────────
  drawText("Date:", 443.9, 127.9, 9.5, "Helvetica-Bold");
  if (date) {
    drawText(date, 469.8, 127.9, 9.5, "Helvetica");
  } else {
    drawText("dd-mm-yyyy", 469.8, 127.9, 9.5, "Helvetica");
  }

  // ─── RECOMMENDATION TITLE LINE ──────────────────────────────────────────────
  drawText("Recommendation cum Sanction Sheet for the purchase of", 136.8, 152.9, 9.5, "Helvetica");
  drawText("______________", 401.5, 152.9, 9.5, "Helvetica");
  if (itemDescription) drawText(itemDescription, 402, 152.9, 9.5, "Helvetica");

  // ─── BODY PARAGRAPH ─────────────────────────────────────────────────────────
  const indentDateStr = indentDate || "dd/mm/yyyy";
  const indentItemStr = indentItemName || "_____________________";
  drawText(
    `An indent dated ${indentDateStr} for the purchase of \u201C${indentItemStr}\u201D has been approved`,
    70.1, 177.4, 9.5, "Helvetica"
  );
  drawText(
    "by the competent authority. The specification was compared on GeM portal by Computer Centre,",
    70.1, 190.9, 9.5, "Helvetica"
  );
  drawText(
    "and a comparison sheet for three different items is generated (attached). Based on the",
    70.1, 204.2, 9.5, "Helvetica"
  );
  drawText(
    "comparison sheet, the L1 item matching the required specification is as follows: -",
    70.1, 217.6, 9.5, "Helvetica"
  );

  // ─── ITEMS TABLE ────────────────────────────────────────────────────────────
  // Column boundaries (from pdfplumber rect analysis)
  const tblLeft = 64.6;
  const tblRight = 555.7;
  const col1 = 116.2;   // end of Sr.No col
  const col2 = 275.6;   // end of Item Desc col
  const col3 = 373.4;   // end of Rate col
  const col4 = 457.0;   // end of Qty col

  const headerTop = 243.7;
  const headerBot = 257.4;
  const row1Bot = 271.7;
  const row2Bot = 285.5;
  const amtTop = row2Bot;
  const amtBot = 300.7;

  // Header background (light peach #FDE9D9 approx)
  fillRect(tblLeft, headerTop, tblRight - tblLeft, headerBot - headerTop, 253, 232, 217);

  // All horizontal lines
  hLine(tblLeft, tblRight, headerTop, 0.8);
  hLine(tblLeft, tblRight, headerBot, 0.8);
  hLine(tblLeft, tblRight, row1Bot, 0.5);
  hLine(tblLeft, tblRight, row2Bot, 0.5);
  hLine(tblLeft, tblRight, amtBot, 0.5);

  // Vertical lines spanning full table height
  vLine(tblLeft, headerTop, amtBot, 0.8);
  vLine(col1, headerTop, amtBot, 0.8);
  vLine(col2, headerTop, amtBot, 0.8);
  vLine(col3, headerTop, amtBot, 0.8);
  vLine(col4, headerTop, amtBot, 0.8);
  vLine(tblRight, headerTop, amtBot, 0.8);

  // Header labels
  drawText("Sr. No.", 70.1, 245.4, 9.5, "Helvetica-Bold");
  drawText("Item Description", 121.2, 245.4, 9.5, "Helvetica-Bold");
  drawText("Rate", 281.2, 245.4, 9.5, "Helvetica-Bold");
  drawText("Qty.", 404.5, 245.4, 9.5, "Helvetica-Bold");
  drawText("Total Price in \u20B9", 462.4, 245.4, 9.5, "Helvetica-Bold");

  // Row 1 data
  if (srNo_1) drawText(srNo_1, 82, 259, 9, "Helvetica");
  if (itemDesc_1) drawText(itemDesc_1, 121, 259, 9, "Helvetica");
  if (rate_1) drawText(rate_1, 281, 259, 9, "Helvetica");
  if (qty_1) drawText(qty_1, 404, 259, 9, "Helvetica");
  if (totalPrice_1) drawText(totalPrice_1, 462, 259, 9, "Helvetica");

  // Row 2 data
  if (srNo_2) drawText(srNo_2, 82, 273, 9, "Helvetica");
  if (itemDesc_2) drawText(itemDesc_2, 121, 273, 9, "Helvetica");
  if (rate_2) drawText(rate_2, 281, 273, 9, "Helvetica");
  if (qty_2) drawText(qty_2, 404, 273, 9, "Helvetica");
  if (totalPrice_2) drawText(totalPrice_2, 462, 273, 9, "Helvetica");

  // Amount in words row
  drawText("(Amount in words)", 227.8, 305, 9.5, "Helvetica");
  if (amountInWords) drawText(amountInWords, 122, 305, 9.5, "Helvetica");

  // ─── CERTIFIED PARAGRAPH ────────────────────────────────────────────────────
  drawText(
    "Certified that we, members of the purchase committee are jointly and individually satisfied that",
    105.1, 315, 9, "Helvetica"
  );
  drawText(
    "the goods recommended for purchase are of the requisite specification and quality, priced at the prevailing",
    70.1, 328, 9, "Helvetica"
  );
  drawText("market rate.", 70.1, 341, 9, "Helvetica");

  // ─── RECOMMENDATION PARAGRAPH ───────────────────────────────────────────────
  drawText(
    "Keeping above point in view, the committee recommends that procurement of",
    70.1, 354, 9.5, "Helvetica"
  );
  const recItem = recommendedItemName || "_______________________";
  drawText(
    `\u201C${recItem}\u201D may be placed for the L1 item on GeM portal.`,
    70.1, 367, 9.5, "Helvetica"
  );
  drawText(
    "Amount as per details given in the above table may be sanctioned.",
    126.6, 380, 9, "Helvetica"
  );

  // ─── MEMBER SIGNATURE LINES ─────────────────────────────────────────────────
  const memLineY = 428;
  hLine(75, 162, memLineY, 0.5);
  hLine(205, 292, memLineY, 0.5);
  hLine(312, 419, memLineY, 0.5);
  hLine(430, 530, memLineY, 0.5);

  if (member1Name) drawText(member1Name, 77, memLineY - 13, 8, "Helvetica");
  if (member2Name) drawText(member2Name, 207, memLineY - 13, 8, "Helvetica");
  if (member3Name) drawText(member3Name, 314, memLineY - 13, 8, "Helvetica");
  if (member4Name) drawText(member4Name, 432, memLineY - 13, 8, "Helvetica");

  drawText("(Member 1)", 102.6, memLineY + 4, 9, "Helvetica");
  drawText("(Member 2)", 235.2, memLineY + 4, 9, "Helvetica");
  drawText("(Member3)", 340.3, memLineY + 4, 9, "Helvetica");
  drawText("(Member4)", 445.4, memLineY + 4, 9, "Helvetica");

  // ─── GEM ACCOUNT ROW ────────────────────────────────────────────────────────
  const gemY = 462;
  drawText("For GeM Account:", 69.3, gemY, 9.5, "Helvetica-Bold");
  drawText("JTS/TS (CC)", 182.8, gemY, 9, "Helvetica");
  drawText("HoD (CC)", 306.1, gemY, 9, "Helvetica");

  hLine(168, 258, gemY + 16, 0.5);
  hLine(294, 380, gemY + 16, 0.5);

  if (jtsName) drawText(jtsName, 182.8, gemY - 12, 8, "Helvetica");
  if (hodCCName) drawText(hodCCName, 306.1, gemY - 12, 8, "Helvetica");

  // ─── INVESTIGATOR / AR / DR ROW ─────────────────────────────────────────────
  const invY = 504;
  drawText("Investigator (s)", 69.5, invY, 9, "Helvetica");
  drawText("AR(R&D)", 172.4, invY, 9, "Helvetica");
  drawText("DR(R&D)", 260.4, invY, 9, "Helvetica");

  hLine(155, 243, invY + 16, 0.5);
  hLine(248, 330, invY + 16, 0.5);

  if (investigatorName) drawText(investigatorName, 70, invY - 12, 8, "Helvetica");
  if (arRDName) drawText(arRDName, 172, invY - 12, 8, "Helvetica");
  if (drRDName) drawText(drRDName, 260, invY - 12, 8, "Helvetica");

  // ─── ASSOCIATE DEAN ROW ─────────────────────────────────────────────────────
  const deanY = 533;
  drawText("A", 314.4, deanY, 9, "Helvetica");
  drawText("Dean(R&D)", 324.8, deanY, 9, "Helvetica");

  hLine(302, 402, deanY + 16, 0.5);
  if (aDeanRDName) drawText(aDeanRDName, 315, deanY - 12, 8, "Helvetica");

  // ─── DIRECTOR ───────────────────────────────────────────────────────────────
  const dirY = 546;
  drawText("Director", 487.0, dirY, 9.5, "Helvetica");
  drawText("IIT Patna", 480.6, dirY + 12.4, 9.5, "Helvetica");

  hLine(462, 556, dirY + 26, 0.5);
  if (directorName) drawText(directorName, 468, dirY - 12, 8, "Helvetica");

  // ─── NOTE SECTION ───────────────────────────────────────────────────────────
  const noteY = 590;
  drawText("Note:", 70.1, noteY, 9.5, "Helvetica-Bold");
  drawText("Delegation of Financial Power", 70.1, noteY + 13, 9.5, "Helvetica-Bold");

  // ─── DELEGATION TABLE ───────────────────────────────────────────────────────
  const delTop = noteY + 28;
  const delLeft = 64.6;
  const delRight = 495.6;
  const delCol1 = 109.3;
  const delCol2 = 236.3;
  const rowH = 12.4;

  const delRows = [delTop, delTop + rowH, delTop + rowH * 2, delTop + rowH * 3, delTop + rowH * 4];

  // Header background
  fillRect(delLeft, delRows[0], delRight - delLeft, rowH, 220, 220, 220);

  // All horizontal lines
  delRows.forEach((rowY) => hLine(delLeft, delRight, rowY, 0.5));
  hLine(delLeft, delRight, delRows[delRows.length - 1], 0.5);

  // Vertical lines
  vLine(delLeft, delRows[0], delRows[delRows.length - 1], 0.5);
  vLine(delCol1, delRows[0], delRows[delRows.length - 1], 0.5);
  vLine(delCol2, delRows[0], delRows[delRows.length - 1], 0.5);
  vLine(delRight, delRows[0], delRows[delRows.length - 1], 0.5);

  // Header labels
  drawText("Sl No.", 70.1, delRows[0] + 2, 9, "Helvetica-Bold");
  drawText("Functionaries", 114.7, delRows[0] + 2, 9, "Helvetica-Bold");
  drawText("Amount (Rs.)", 241.8, delRows[0] + 2, 9, "Helvetica-Bold");

  // Row I – Investigator(s)
  drawText("I", 70.1, delRows[1] + 2, 8, "Helvetica");
  drawText("Investigator(s)", 114.7, delRows[1] + 2, 9, "Helvetica");
  drawText("Upto 01 Lakh", 241.8, delRows[1] + 2, 9, "Helvetica");

  // Row II – Associate Dean (R&D)
  drawText("II", 70.1, delRows[2] + 2, 8, "Helvetica");
  drawText("Associate Dean (R&D)", 114.7, delRows[2] + 2, 9, "Helvetica");
  drawText("> 01 Lakh \u2264 02 Lakh", 241.8, delRows[2] + 2, 9, "Helvetica");

  // Row II – Director
  drawText("II", 70.1, delRows[3] + 2, 8, "Helvetica");
  drawText("Director", 114.7, delRows[3] + 2, 9, "Helvetica");
  drawText("> 02 Lakh", 241.8, delRows[3] + 2, 9, "Helvetica");
};

module.exports = { renderCCRDRecommendationDirectPurchaseGeMPdf };
const { getResponseValue, formatDate } = require("../../utils/pdfUtils");

const renderStoresStationeryIndentPdf = (doc, submission) => {
  const responses = submission.responses;

  const g = (key) => String(getResponseValue(responses, key) || "").trim();
  const fd = (key) => {
    const v = getResponseValue(responses, key);
    return v ? formatDate(v) : "";
  };

  const employeeName = g("employeeName");
  const empNo = g("empNo");
  const designation = g("designation");
  const deptSection = g("deptSection");
  const date = fd("date") || g("date");
  const hodSignature = g("hodSignature");
  const employeeSignature = g("employeeSignature");
  const stationaryIncharge = g("stationaryIncharge");

  let items = [];
  try {
    const raw = g("itemsJson");
    if (raw) items = JSON.parse(raw);
  } catch {}
  if (!Array.isArray(items) || items.length === 0) {
    items = [{ particulars: "", quantity: "", remarks: "" }];
  }

  // helper
  const dots = (len = 30) => "_".repeat(len);

  const L = 50;
  const R = 545;
  const W = R - L;

  const drawText = (text, x, y, fontSize = 9, font = "Helvetica", opts = {}) => {
    doc.fontSize(fontSize).font(font).text(text, x, y, { lineBreak: false, ...opts });
  };

  const hLine = (x0, x1, y, lw = 0.5) =>
    doc.moveTo(x0, y).lineTo(x1, y).lineWidth(lw).stroke();

  const vLine = (x, y0, y1, lw = 0.5) =>
    doc.moveTo(x, y0).lineTo(x, y1).lineWidth(lw).stroke();

  // HEADER (FIXED)

  doc.font("Helvetica-Bold").fontSize(15).text(
    "Indian Institute of Technology Patna",
    L,
    58,
    { width: W, align: "center" }
  );

  hLine(L, R, 80, 1);

  doc.font("Helvetica-Bold").fontSize(13).text(
    "STATIONARY INDENT FORM",
    L,
    92,
    { width: W, align: "center" }
  );

  const titleWidth = doc.widthOfString("STATIONARY INDENT FORM");
  const titleX = L + (W - titleWidth) / 2;
  hLine(titleX, titleX + titleWidth, 107, 0.8);

  // DATE
  const dateY = 122;
  drawText("Date:", 380, dateY);
  drawText(date || dots(20), 402, dateY);

  // NAME
  const line1Y = 145;
  drawText("Name of the employee", L, line1Y);
  drawText(employeeName || dots(45), L + 108, line1Y);

  drawText("Emp. No.", 390, line1Y);
  drawText(empNo || dots(10), 430, line1Y);

  // DESIGNATION
  const line2Y = 162;
  drawText("Designation", L, line2Y);
  drawText(designation || dots(35), L + 60, line2Y);

  drawText("Dept./Section/Centre", 310, line2Y);
  drawText(deptSection || dots(20), 415, line2Y);

  // TABLE
  const tableTop = 185;
  const colSlNo = L;
  const colParticulars = L + 45;
  const colQty = L + 330;
  const colRemarks = L + 420;
  const colEnd = R;

  const headerH = 24;
  const rowH = 22;

  doc.rect(colSlNo, tableTop, colEnd - colSlNo, headerH).stroke();
  vLine(colParticulars, tableTop, tableTop + headerH);
  vLine(colQty, tableTop, tableTop + headerH);
  vLine(colRemarks, tableTop, tableTop + headerH);

  drawText("Sl.", colSlNo + 3, tableTop + 4, 9, "Helvetica-Bold");
  drawText("No.", colSlNo + 3, tableTop + 13, 9, "Helvetica-Bold");
  drawText("PARTICULARS", colParticulars + 120, tableTop + 8, 9, "Helvetica-Bold");
  drawText("QUANTITY", colQty + 4, tableTop + 8, 9, "Helvetica-Bold");
  drawText("REMARKS", colRemarks + 4, tableTop + 8, 9, "Helvetica-Bold");

  items.forEach((item, idx) => {
    const rowY = tableTop + headerH + idx * rowH;

    doc.rect(colSlNo, rowY, colEnd - colSlNo, rowH).stroke();
    vLine(colParticulars, rowY, rowY + rowH);
    vLine(colQty, rowY, rowY + rowH);
    vLine(colRemarks, rowY, rowY + rowH);

    drawText(`${idx + 1}.`, colSlNo + 3, rowY + 7);

    drawText(item.particulars || "", colParticulars + 3, rowY + 7);
    drawText(item.quantity || "", colQty + 3, rowY + 7);
    drawText(item.remarks || "", colRemarks + 3, rowY + 7);
  });

  const tableBottom = tableTop + headerH + items.length * rowH;

  // SIGNATURES
  const sigY = tableBottom + 32;

  drawText("Signature of HOD/HOS/DEAN", L, sigY);
  drawText(hodSignature || dots(20), L, sigY + 14);

  drawText("Signature of the employee", 360, sigY);
  drawText(employeeSignature || dots(20), 360, sigY + 14);

  const sinchargeY = sigY + 44;
  drawText("Stationary In-charge", L, sinchargeY);
  drawText(stationaryIncharge || dots(20), L, sinchargeY + 14);
};

module.exports = { renderStoresStationeryIndentPdf };
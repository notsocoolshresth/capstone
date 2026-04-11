const path = require("path");
const fs = require("fs");
const { getResponseValue, formatDate } = require("../../utils/pdfUtils");

const renderEstbDepartureRejoiningReportPdf = (doc, submission) => {
  const responses = submission.responses;

  // --- 1. ASSETS ---
  const assetsPath = path.join(__dirname, "../../assets");
  const FONT_PATH = path.join(assetsPath, "NotoSansDevanagari.ttf"); 
  // logoPath is no longer needed

  const fontExists = fs.existsSync(FONT_PATH);

  if (fontExists) {
    doc.registerFont("HindiFont", FONT_PATH);
  }

  const getVal = (key) => String(getResponseValue(responses, key) || "").trim();
  const leftMargin = 50;
  const pageWidth = doc.page.width - 100;
  
  const fontSize = 11;
  const rowSpacing = 20; 
  const startLineIndent = 30;

  // --- 2. HELPERS ---
  const drawInput = (label, value, x, y, width) => {
    doc.font("Helvetica").fontSize(fontSize).text(label, x, y);
    const labelWidth = doc.widthOfString(label);
    const underlineX = x + labelWidth + 2;
    const underlineWidth = width - (underlineX - x);

    if (value && value !== "undefined" && value !== "") {
      doc.text(value, underlineX + 2, y - 1, { 
        width: underlineWidth - 5, 
        ellipsis: true 
      });
    }
    
    doc.moveTo(underlineX, y + 10).lineTo(x + width, y + 10).lineWidth(0.5).stroke("#333333");
    doc.strokeColor("black").lineWidth(0.7); 
  };

  const drawHeader = (y, title) => {
    // --- LOGO CODE REMOVED PER INSTRUCTION ---
    
    if (fontExists) {
      doc.font("HindiFont").fontSize(14)
         .text("भारतीय प्रौद्योगिकी संस्थान पटना", leftMargin, y + 5, { width: pageWidth, align: "center" });
    }
    doc.font("Helvetica-Bold").fontSize(14)
       .text("INDIAN INSTITUTE OF TECHNOLOGY PATNA", leftMargin, y + 23, { width: pageWidth, align: "center" });
    
    doc.font("Helvetica-Bold").fontSize(12)
       .text(title.toUpperCase(), leftMargin, y + 42, { width: pageWidth, align: "center", underline: true });

    return y + 65; 
  };

  // --- 3. SECTIONS ---

  // SECTION 1: DEPARTURE REPORT
  let curY = 40;
  const firstBoxHeight = 360;
  doc.rect(leftMargin - 5, curY - 5, pageWidth + 10, firstBoxHeight).lineWidth(1.5).stroke("black");
  curY = drawHeader(curY, "Departure Report");

  curY += 15;
  doc.font("Helvetica").fontSize(fontSize).text("This is to inform you that I am proceeding on station leave w.e.f.", leftMargin + startLineIndent, curY);
  drawInput("", getVal("departureFromDate"), leftMargin + startLineIndent + 310, curY, 80);
  doc.text("(FN / AN)", leftMargin + startLineIndent + 395, curY);

  curY += rowSpacing;
  drawInput("and will be out of station till", getVal("departureOutOfStationTill"), leftMargin + 10, curY, 280);
  
  curY += rowSpacing;
  drawInput("Address during leave:", getVal("departureAddress"), leftMargin + 10, curY, pageWidth - 20);
  
  curY += rowSpacing;
  drawInput("Contact Phone No. (if any):", getVal("departureContactPhone"), leftMargin + 10, curY, 320);

  curY += 35; 
  drawInput("Date:", formatDate(getResponseValue(responses, "departureDate")), leftMargin + 10, curY, 130);
  
  const signX = leftMargin + 195;
  doc.font("Helvetica").text("Signature of the employee:", signX, curY);
  doc.moveTo(signX + 135, curY + 10).lineTo(leftMargin + pageWidth, curY + 10).lineWidth(0.5).stroke();
  
  curY += 28;
  drawInput("Name:", getVal("departureName"), signX, curY, 210);
  drawInput("Emp. No.:", getVal("departureEmpNo"), signX + 220, curY, pageWidth - (signX - leftMargin + 220));
  
  curY += 20;
  drawInput("Designation:", getVal("departureDesignation"), signX, curY, pageWidth - (signX - leftMargin));
  
  curY += 20;
  drawInput("Department / Section:", getVal("departureDepartment"), signX, curY, pageWidth - (signX - leftMargin));

  curY += 50;
  doc.font("Helvetica-Bold").fontSize(fontSize).text("To", leftMargin + 10, curY - 18);
  doc.text("      Administration", leftMargin + 10, curY);

  const approvalWidth = 260;
  const approvalX = leftMargin + pageWidth - approvalWidth;
  doc.moveTo(approvalX, curY).lineTo(leftMargin + pageWidth, curY).lineWidth(0.5).stroke();
  doc.font("Helvetica").fontSize(10).text("Signature of the Coordinator / HOD", approvalX, curY + 5, { width: approvalWidth, align: "right" });

  curY += 38; 
  doc.moveTo(approvalX, curY).lineTo(leftMargin + pageWidth, curY).lineWidth(0.5).stroke();
  doc.font("Helvetica").fontSize(10).text("Signature of the HOS/Registrar/Dean/Director", approvalX, curY + 5, { width: approvalWidth, align: "right" });

  // --- 4. CENTERED DOTTED DIVIDER ---
  const dividerGap = 40; 
  const dividerY = 40 + firstBoxHeight + (dividerGap / 2); 

  doc.moveTo(leftMargin - 15, dividerY)
     .lineTo(leftMargin + pageWidth + 15, dividerY)
     .dash(5, { space: 3 })
     .lineWidth(1.5)
     .stroke()
     .undash();

  // SECTION 2: RE-JOINING REPORT
  curY = dividerY + (dividerGap / 2); 
  doc.rect(leftMargin - 5, curY, pageWidth + 10, 315).lineWidth(1.5).stroke("black");
  curY = drawHeader(curY + 5, "Re-joining Report");

  curY += 15;
  doc.font("Helvetica").fontSize(fontSize).text("This is to inform you that I have re-joined duty on", leftMargin + startLineIndent, curY);
  drawInput("", getVal("rejoiningDate"), leftMargin + startLineIndent + 245, curY, 80);
  doc.text("(FN / AN) after availing leave", leftMargin + startLineIndent + 330, curY);

  curY += rowSpacing;
  drawInput("from", getVal("rejoiningLeaveFrom"), leftMargin + 10, curY, 120);
  drawInput("to", getVal("rejoiningLeaveTo"), leftMargin + 150, curY, 120);

  curY += 38; 
  drawInput("Date:", formatDate(getResponseValue(responses, "rejoiningSignDate")), leftMargin + 10, curY, 130);
  
  doc.font("Helvetica").text("Signature of the employee:", signX, curY);
  doc.moveTo(signX + 135, curY + 10).lineTo(leftMargin + pageWidth, curY + 10).lineWidth(0.5).stroke();

  curY += 28;
  drawInput("Name:", getVal("rejoiningName"), signX, curY, 210);
  drawInput("Emp. No.:", getVal("rejoiningEmpNo"), signX + 220, curY, pageWidth - (signX - leftMargin + 220));
  curY += 20;
  drawInput("Designation:", getVal("rejoiningDesignation"), signX, curY, pageWidth - (signX - leftMargin));
  curY += 20;
  drawInput("Department / Section:", getVal("rejoiningDepartment"), signX, curY, pageWidth - (signX - leftMargin));

  curY += 50;
  doc.font("Helvetica-Bold").fontSize(fontSize).text("To", leftMargin + 10, curY - 18);
  doc.text("      Administration", leftMargin + 10, curY);

  doc.moveTo(approvalX, curY).lineTo(leftMargin + pageWidth, curY).lineWidth(0.5).stroke();
  doc.font("Helvetica").fontSize(10).text("Signature of the Coordinator / HOD", approvalX, curY + 5, { width: approvalWidth, align: "right" });

  curY += 38; 
  doc.moveTo(approvalX, curY).lineTo(leftMargin + pageWidth, curY).lineWidth(0.5).stroke();
  doc.font("Helvetica").fontSize(10).text("Signature of the HOS/Registrar/Dean/Director", approvalX, curY + 5, { width: approvalWidth, align: "right" });
};

module.exports = { renderEstbDepartureRejoiningReportPdf };
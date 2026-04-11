const { getResponseValue, formatDate } = require("../../utils/pdfUtils");

const renderEstbHouseAllotmentDTypePdf = (doc, submission) => {
  const responses = submission.responses;

  // --- Extract Data ---
  const circularNo = String(getResponseValue(responses, "circularNo") || "3").trim();
  const name = String(getResponseValue(responses, "name") || "").trim();
  const employeeId = String(getResponseValue(responses, "employeeId") || "").trim();
  const designation = String(getResponseValue(responses, "designation") || "").trim();
  const payMatrixLevel = String(getResponseValue(responses, "payMatrixLevel") || "").trim();
  const deptSection = String(getResponseValue(responses, "deptSection") || "").trim();
  const dateOfJoining = formatDate(getResponseValue(responses, "dateOfJoining"));
  const email = String(getResponseValue(responses, "email") || "").trim();
  const maritalStatus = String(getResponseValue(responses, "maritalStatus") || "").trim();
  const bachelorAccommodation = String(getResponseValue(responses, "bachelorAccommodation") || "").trim();
  const presentQuarterAddress = String(getResponseValue(responses, "presentQuarterAddress") || "").trim();

  // --- Quarter Preferences ---
  const rawPrefs = String(getResponseValue(responses, "quarterPreferences") || "");
  const quarterPreferences = {};
  if (rawPrefs) {
    rawPrefs.split(",").forEach(item => {
      const match = item.match(/(\d+)\((.*?)\)/);
      if (match) {
        quarterPreferences[match[1]] = match[2];
      }
    });
  }

  const LM = 50;
  const PW = doc.page.width - 100; 
  const colonX = 350;
  const valueX = 370;
  const FONT_REG = "Times-Roman";
  const FONT_BOLD = "Times-Bold";
  const FS = 12;

  // --- 1. HEADER ---
  doc.font(FONT_BOLD).fontSize(11).text("FORM NO: HAC 02", { align: "right" });
  doc.moveDown(1);
  doc.font(FONT_BOLD).fontSize(13).text("INDIAN INSTITUTE OF TECHNOLOGY PATNA", { align: "center" });
  doc.moveDown(1.5);

  // --- 2. TO ---
  doc.font(FONT_REG).fontSize(FS);
  doc.text("To,", LM);
  doc.text("The chairman HAC,", LM);
  doc.moveDown(1);

  // --- 3. PARAGRAPH (Selective Underline & Spacing) ---
  const introWs = 5.0; // High word spacing for first sentence
  
  doc.font(FONT_REG).fontSize(FS).text(
    "I  would  like  to  be  considered  for  allotment  of  the  quarter(s)  as  per  circular  no.  ", 
    { continued: true, wordSpacing: introWs } 
  );

  // Underline ONLY the circular number
  doc.text(` ${circularNo}`, { underline: true, continued: true });

  // Reset to regular formatting for the rest of the text
  doc.text(
    ". I hereby declare that no Government provided accommodation is in the name of my spouse within 8 KM of radius from IIT Patna Campus. I hereby also undertake to shift in a quarter as per entitlement in future subject to availability, in case a quarter higher than my eligibility is allotted for the present.",
    { 
      width: PW, 
      align: "justify", 
      lineGap: 4, 
      wordSpacing: 1.2, 
      underline: false 
    }
  );

  doc.moveDown(1.5);

  // --- 4. FIELDS ---
  let y = doc.y;
  const drawField = (num, label, value = "") => {
    doc.font(FONT_REG).fontSize(FS).text(`${num}. ${label}`, LM, y);
    doc.text(":", colonX, y);
    doc.text(value, valueX, y);
    y += 24; 
  };

  drawField("1", "Name", name);
  drawField("2", "Employee ID", employeeId);
  drawField("3", "Designation", designation);
  drawField("4", "Present Level in Pay Matrix (As per 7th CPC)", payMatrixLevel);
  drawField("5", "Deptt./Section", deptSection);
  drawField("6", "Date of joining", dateOfJoining);
  drawField("7", "E-mail", email);
  drawField("8", "Marital Status", maritalStatus || "Single/ Married");

  doc.text("9. If single, whether bachelor (shared)", LM, y);
  doc.text(":", colonX, y);
  doc.text(bachelorAccommodation || "(Y/N)", valueX, y);
  y += 15;
  doc.text("   accommodation is preferred", LM, y);
  y += 30;

  // --- 5. GRID ---
  doc.text("10. Type & No. of quarter applied for", LM, y);
  doc.text(":", colonX, y);
  y += 20;

  const cellW = 58;
  const cellH = 16;
  const startX = LM + 10;
  const gridRows = [
    [1, 7, 13, 19, 25, 31, 37, 43], [2, 8, 14, 20, 26, 32, 38, 44],
    [3, 9, 15, 21, 27, 33, 39, 45], [4, 10, 16, 22, 28, 34, 40, 46],
    [5, 11, 17, 23, 29, 35, 41, null], [6, 12, 18, 24, 30, 36, 42, null]
  ];

  gridRows.forEach((row, i) => {
    row.forEach((num, j) => {
      const x = startX + j * cellW;
      const yy = y + i * cellH;
      doc.rect(x, yy, cellW, cellH).stroke();
      if (num) {
        doc.font(FONT_REG).fontSize(8).text(`${num}.`, x + 2, yy + 3);
        const val = quarterPreferences[String(num)];
        if (val) {
          doc.font(FONT_BOLD).fontSize(10).text(val, x, yy + 3, { width: cellW, align: "center" });
        }
      }
    });
  });

  y += gridRows.length * cellH + 10;
  doc.font(FONT_REG).fontSize(9).text("(Please indicate your preferences in the above boxes.)", startX, y);
  y += 35;

  // --- 6. SIGNATURE ---
  drawField("11", "Present quarter No./Present address", presentQuarterAddress);
  doc.text("12. Signature", LM, y);
  doc.text(":", colonX, y);
  
  y += 40; // Extra spacing (2-3 lines) before Acknowledgment

  // --- 7. ACKNOWLEDGMENT ---
  doc.font(FONT_BOLD).fontSize(11).text("ACKNOWLEDGMENT", LM, y, { align: "center", width: PW });
  doc.moveDown(2); 

  doc.font(FONT_REG).fontSize(10);
  const ackLine1 = `Received an application against circular No. ............................................... From Shri/Smt`;
  const ackLine2 = `.................................... Emp. ID ............................ Department .............................`;
  
  doc.text(ackLine1, LM, doc.y, { align: "left", lineGap: 10, wordSpacing: 1.5 });
  doc.text(ackLine2, LM, doc.y, { align: "left", wordSpacing: 1.5 });
};

module.exports = { renderEstbHouseAllotmentDTypePdf };

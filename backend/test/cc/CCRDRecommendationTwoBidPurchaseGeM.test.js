const { renderCCRDRecommendationTwoBidPurchaseGeMPdf } = require("../../src/forms/cc/CCRDRecommendationTwoBidPurchaseGeM");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const sampleResponses = {
  projectNo: "2025/CC/0123",
  date: "2025-04-01T00:00:00.000Z",
  purchaseOf: "Scientific Instruments",
  supplyItem: "Digital Oscilloscope",
  gemBidRef: "GeM Bid 7654321",
  gemBidDate: "2025-03-15T00:00:00.000Z",
  vendorCount: "6",
  techFirmsCount: "4",
  openedOnDate: "2025-03-20T00:00:00.000Z",
  annexureNo: "A-7",
  orderForItem: "Digital Oscilloscope (Model DSO-X)",
  vendorMsName: "M/s TechWave Instruments",
  fileNo: "CC/2025/88",
  yearOfSanction: "2025-26",
  department: "Central Computer Centre",
  category: "Capital",
  vendorLabel: "1",
  vendorName: "TechWave Instruments Pvt Ltd",
  vendorAddr1: "Plot 42, Industrial Area",
  vendorAddr2: "Patna, Bihar 800001",
  item1Desc: "Digital Oscilloscope 200 MHz",
  item1Rate: "85000",
  item1Qty: "2",
  item1Amount: "170000",
  item2Desc: "Probe Set 500 MHz",
  item2Rate: "5000",
  item2Qty: "4",
  item2Amount: "20000",
  item3Desc: "Calibration Certificate",
  item3Rate: "2000",
  item3Qty: "2",
  item3Amount: "4000",
  extraRow1Label: "Freight and Insurance",
  extraRow1Amount: "5000",
  extraRow2Label: "Installation Charges",
  extraRow2Amount: "3000",
  gstPercent: "18",
  gstAmount: "36036",
  totalAmount: "236236",
  member1Name: "Dr. Ramesh Kumar",
  member2Name: "Dr. Sunita Sharma",
  member3Name: "Dr. Anil Gupta",
  member4Name: "Dr. Kavita Rao",
  jtsName: "Shri P. K. Singh",
  hodCCName: "Prof. A. K. Verma",
  investigatorName: "Dr. Meena Joshi",
  arRDName: "Shri D. K. Prasad",
  drRDName: "Dr. S. N. Tiwari",
  aDeanRDName: "Prof. R. K. Singh",
  directorName: "Prof. T. N. Singh",
};

describe("CCRDRecommendationTwoBidPurchaseGeMPdf", () => {
  it("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: {} })).not.toThrow();
  });

  it("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: undefined })).not.toThrow();
  });

  it("renders without throwing when submission has no responses key", () => {
    const { doc } = createMockDoc();
    expect(() => renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, {})).not.toThrow();
  });

  it("renders the form header and title text", () => {
    const { doc } = createMockDoc();
    renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: {} });
    expect(hasText(doc, "Form No. P004")).toBe(true);
    expect(hasText(doc, "Format for procurement in INR using Double Bid Tendering process")).toBe(true);
    expect(hasText(doc, "Recommendation cum Sanction Sheet for the purchase of")).toBe(true);
    expect(hasText(doc, "Delegation of Financial Power")).toBe(true);
    expect(hasText(doc, "IIT Patna")).toBe(true);
    expect(hasText(doc, "Page 1 of 1")).toBe(true);
  });

  it("renders every user-facing response field value", () => {
    const { doc } = createMockDoc();
    renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: sampleResponses });
    const expectations = {
      projectNo: "2025/CC/0123",
      purchaseOf: "Scientific Instruments",
      supplyItem: "Digital Oscilloscope",
      gemBidRef: "GeM Bid 7654321",
      vendorCount: "6",
      techFirmsCount: "4",
      annexureNo: "A-7",
      orderForItem: "Digital Oscilloscope (Model DSO-X)",
      vendorMsName: "M/s TechWave Instruments",
      fileNo: "CC/2025/88",
      yearOfSanction: "2025-26",
      department: "Central Computer Centre",
      category: "Capital",
      vendorLabel: "1",
      vendorName: "TechWave Instruments Pvt Ltd",
      vendorAddr1: "Plot 42, Industrial Area",
      vendorAddr2: "Patna, Bihar 800001",
      item1Desc: "Digital Oscilloscope 200 MHz",
      item1Rate: "85000",
      item1Qty: "2",
      item1Amount: "170000",
      item2Desc: "Probe Set 500 MHz",
      item2Rate: "5000",
      item2Qty: "4",
      item2Amount: "20000",
      item3Desc: "Calibration Certificate",
      item3Rate: "2000",
      item3Qty: "2",
      item3Amount: "4000",
      extraRow1Label: "Freight and Insurance",
      extraRow1Amount: "5000",
      extraRow2Label: "Installation Charges",
      extraRow2Amount: "3000",
      gstPercent: "18",
      gstAmount: "36036",
      totalAmount: "236236",
      member1Name: "Dr. Ramesh Kumar",
      member2Name: "Dr. Sunita Sharma",
      member3Name: "Dr. Anil Gupta",
      member4Name: "Dr. Kavita Rao",
      jtsName: "Shri P. K. Singh",
      hodCCName: "Prof. A. K. Verma",
      investigatorName: "Dr. Meena Joshi",
      arRDName: "Shri D. K. Prasad",
      drRDName: "Dr. S. N. Tiwari",
      aDeanRDName: "Prof. R. K. Singh",
      directorName: "Prof. T. N. Singh",
    };
    const missing = Object.entries(expectations)
      .filter(([field, value]) => !hasText(doc, value))
      .map(([field, value]) => `${field}=${value}`);
    expect(missing).toEqual([]);
  });

  it("formats date fields in en-GB dd/mm/yyyy format", () => {
    const { doc } = createMockDoc();
    renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "15/03/2025")).toBe(true);
    expect(hasText(doc, "20/03/2025")).toBe(true);
  });

  it("does not crash with invalid or empty date values", () => {
    const responses = {
      date: "not-a-date",
      gemBidDate: "",
      openedOnDate: "garbage",
    };
    const { doc, texts } = createMockDoc();
    expect(() => renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "dd-mm-yyyy")).toBe(true);
    expect(hasText(doc, "dd/mm/yyyy")).toBe(true);
    expect(hasText(doc, "dd.mm.yyyy")).toBe(true);
    expect(texts.some((t) => t.includes("NaN"))).toBe(false);
  });

  it("does not render any undefined text when fields are missing", () => {
    const { doc } = createMockDoc();
    renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: {} });
    expect(getAllText(doc).includes("undefined")).toBe(false);
    expect(getAllText(doc).includes("null")).toBe(false);
    expect(getAllText(doc).includes("NaN")).toBe(false);
  });

  it("renders table header, labels and amounts", () => {
    const { doc } = createMockDoc();
    renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "Item description (with product code, if any)")).toBe(true);
    expect(hasText(doc, "Sl. No.")).toBe(true);
    expect(hasText(doc, "Rate")).toBe(true);
    expect(hasText(doc, "Quantity")).toBe(true);
    expect(hasText(doc, "Amount")).toBe(true);
    expect(hasText(doc, "Total Amount")).toBe(true);
    expect(hasText(doc, "GST @18%")).toBe(true);
    expect(hasText(doc, "236236")).toBe(true);
    expect(hasText(doc, "Amount (Rs.)")).toBe(true);
    expect(hasText(doc, "Upto 01 Lakh")).toBe(true);
    expect(hasText(doc, "> 02 Lakh")).toBe(true);
  });

  it("renders signature section labels", () => {
    const { doc } = createMockDoc();
    renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: {} });
    expect(hasText(doc, "(Member 1)")).toBe(true);
    expect(hasText(doc, "(Member 2)")).toBe(true);
    expect(hasText(doc, "(Member 3)")).toBe(true);
    expect(hasText(doc, "(Member 4)")).toBe(true);
    expect(hasText(doc, "JTS/TS (CC)")).toBe(true);
    expect(hasText(doc, "HoD (CC)")).toBe(true);
    expect(hasText(doc, "Investigator(s)")).toBe(true);
    expect(hasText(doc, "AR(R&D)")).toBe(true);
    expect(hasText(doc, "DR(R&D)")).toBe(true);
    expect(hasText(doc, "A Dean(R&D)")).toBe(true);
    expect(hasText(doc, "Director")).toBe(true);
  });

  it("handles a Map-based responses object", () => {
    const map = new Map([
      ["projectNo", "MAP/001"],
      ["purchaseOf", "Map Purchased Item"],
      ["supplyItem", "Map Supply Item"],
      ["vendorName", "Map Vendor Pvt Ltd"],
      ["totalAmount", "999999"],
    ]);
    const { doc } = createMockDoc();
    renderCCRDRecommendationTwoBidPurchaseGeMPdf(doc, { responses: map });
    expect(hasText(doc, "MAP/001")).toBe(true);
    expect(hasText(doc, "Map Purchased Item")).toBe(true);
    expect(hasText(doc, "Map Supply Item")).toBe(true);
    expect(hasText(doc, "Map Vendor Pvt Ltd")).toBe(true);
    expect(hasText(doc, "999999")).toBe(true);
  });
});

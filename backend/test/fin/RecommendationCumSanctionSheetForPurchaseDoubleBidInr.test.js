const { renderFinanceProcurementRecommendationSanctionPdf } = require("../../src/forms/fin/RecommendationCumSanctionSheetForPurchaseDoubleBidInr");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const sampleResponses = {
  purchaseOf: "Scientific Instruments",
  sheetDate: "2025-04-01T00:00:00.000Z",
  niqTenderNo: "NIQ/2025/042",
  niqTenderDate: "2025-03-15T00:00:00.000Z",
  vendorsRespondedCount: "6",
  priceBidsOpenedOn: "2025-03-20T00:00:00.000Z",
  purchaseCommitteeMembers: "Prof. A. K. Verma, Dr. R. K. Sinha",
  fileNo: "F/2025/1234",
  yearOfSanction: "2025-26",
  department: "Mechanical Engineering",
  category: "Capital",
  vendorName: "TechWave Instruments Pvt Ltd",
  vendorAddressLine1: "Plot 42, Industrial Area",
  vendorAddressLine2: "Patna, Bihar 800001",
  gstPercentage: "18",
  gstAmount: "36036",
  additionalCharge1Label: "Freight and Insurance",
  additionalCharge1Amount: "5000",
  additionalCharge2Label: "Installation Charges",
  additionalCharge2Amount: "3000",
  totalAmount: "236236",
  member1: "Dr. Ramesh Kumar",
  member2: "Dr. Sunita Sharma",
  member3: "Dr. Anil Gupta",
  member4: "Dr. Kavita Rao",
};

describe("RecommendationCumSanctionSheetForPurchaseDoubleBidInr", () => {
  it("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: {} })).not.toThrow();
  });

  it("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: undefined })).not.toThrow();
  });

  it("renders without throwing when submission has no responses key", () => {
    const { doc } = createMockDoc();
    expect(() => renderFinanceProcurementRecommendationSanctionPdf(doc, {})).not.toThrow();
  });

  it("renders the form title and header text", () => {
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: {} });
    expect(hasText(doc, "Format for procurement in INR using Double Bid Tendering process")).toBe(true);
    expect(hasText(doc, "Recommendation cum Sanction Sheet for the purchase of")).toBe(true);
    expect(hasText(doc, "Amount as per details given in the above table may be sanctioned.")).toBe(true);
    expect(hasText(doc, "IIT Patna")).toBe(true);
  });

  it("renders every user-facing response field value", () => {
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: sampleResponses });
    const expectations = {
      purchaseOf: "Scientific Instruments",
      niqTenderNo: "NIQ/2025/042",
      vendorsRespondedCount: "6",
      purchaseCommitteeMembers: "Prof. A. K. Verma, Dr. R. K. Sinha",
      fileNo: "F/2025/1234",
      yearOfSanction: "2025-26",
      department: "Mechanical Engineering",
      category: "Capital",
      vendorName: "TechWave Instruments Pvt Ltd",
      vendorAddressLine1: "Plot 42, Industrial Area",
      vendorAddressLine2: "Patna, Bihar 800001",
      gstPercentage: "18",
      gstAmount: "36036",
      additionalCharge1Label: "Freight and Insurance",
      additionalCharge1Amount: "5000",
      additionalCharge2Label: "Installation Charges",
      additionalCharge2Amount: "3000",
      totalAmount: "236236",
      member1: "Dr. Ramesh Kumar",
      member2: "Dr. Sunita Sharma",
      member3: "Dr. Anil Gupta",
      member4: "Dr. Kavita Rao",
    };
    const missing = Object.entries(expectations)
      .filter(([field, value]) => !hasText(doc, value))
      .map(([field, value]) => `${field}=${value}`);
    expect(missing).toEqual([]);
  });

  it("renders items provided via the items array", () => {
    const responses = {
      ...sampleResponses,
      items: [
        { description: "Digital Oscilloscope 200 MHz", rate: "85000", quantity: "2", amount: "170000" },
        { description: "Probe Set 500 MHz", rate: "5000", quantity: "4", amount: "20000" },
        { description: "Calibration Certificate", rate: "2000", quantity: "2", amount: "4000" },
      ],
    };
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses });
    expect(hasText(doc, "Digital Oscilloscope 200 MHz")).toBe(true);
    expect(hasText(doc, "85000")).toBe(true);
    expect(hasText(doc, "170000")).toBe(true);
    expect(hasText(doc, "Probe Set 500 MHz")).toBe(true);
    expect(hasText(doc, "20000")).toBe(true);
    expect(hasText(doc, "Calibration Certificate")).toBe(true);
    expect(hasText(doc, "4000")).toBe(true);
  });

  it("renders legacy item fields when items array is absent", () => {
    const responses = {
      ...sampleResponses,
      item1Description: "Digital Oscilloscope 200 MHz",
      item1Rate: "85000",
      item1Quantity: "2",
      item1Amount: "170000",
      item2Description: "Probe Set 500 MHz",
      item2Rate: "5000",
      item2Quantity: "4",
      item2Amount: "20000",
    };
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses });
    expect(hasText(doc, "Digital Oscilloscope 200 MHz")).toBe(true);
    expect(hasText(doc, "85000")).toBe(true);
    expect(hasText(doc, "170000")).toBe(true);
    expect(hasText(doc, "Probe Set 500 MHz")).toBe(true);
    expect(hasText(doc, "20000")).toBe(true);
  });

  it("formats date fields in en-GB dd/mm/yyyy format", () => {
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "15/03/2025")).toBe(true);
    expect(hasText(doc, "20/03/2025")).toBe(true);
  });

  it("does not crash with invalid or empty date values", () => {
    const responses = {
      sheetDate: "not-a-date",
      niqTenderDate: "",
      priceBidsOpenedOn: "garbage",
    };
    const { doc, texts } = createMockDoc();
    expect(() => renderFinanceProcurementRecommendationSanctionPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "dd-mm-yyyy")).toBe(true);
    expect(texts.some((t) => t.includes("NaN"))).toBe(false);
  });

  it("does not render any undefined text when fields are missing", () => {
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: {} });
    expect(getAllText(doc).includes("undefined")).toBe(false);
    expect(getAllText(doc).includes("null")).toBe(false);
    expect(getAllText(doc).includes("NaN")).toBe(false);
  });

  it("renders table header, labels and amounts", () => {
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "Sl. No.")).toBe(true);
    expect(hasText(doc, "Item description (with product code, if any)")).toBe(true);
    expect(hasText(doc, "Rate")).toBe(true);
    expect(hasText(doc, "Quantity")).toBe(true);
    expect(hasText(doc, "Amount")).toBe(true);
    expect(hasText(doc, "GST @18%")).toBe(true);
    expect(hasText(doc, "Freight and Insurance")).toBe(true);
    expect(hasText(doc, "Installation Charges")).toBe(true);
    expect(hasText(doc, "Total Amount")).toBe(true);
    expect(hasText(doc, "236236")).toBe(true);
  });

  it("renders signature section labels with member defaults when missing", () => {
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: {} });
    expect(hasText(doc, "(Member 1)")).toBe(true);
    expect(hasText(doc, "(Member 2)")).toBe(true);
    expect(hasText(doc, "(Member 3)")).toBe(true);
    expect(hasText(doc, "(Member 4)")).toBe(true);
    expect(hasText(doc, "(HoD)")).toBe(true);
    expect(hasText(doc, "Registrar")).toBe(true);
    expect(hasText(doc, "Director")).toBe(true);
  });

  it("renders member names in the signature section", () => {
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "(Dr. Ramesh Kumar)")).toBe(true);
    expect(hasText(doc, "(Dr. Sunita Sharma)")).toBe(true);
    expect(hasText(doc, "(Dr. Anil Gupta)")).toBe(true);
    expect(hasText(doc, "(Dr. Kavita Rao)")).toBe(true);
  });

  it("handles a Map-based responses object", () => {
    const map = new Map([
      ["purchaseOf", "Map Purchased Item"],
      ["niqTenderNo", "MAP/2025/001"],
      ["vendorName", "Map Vendor Pvt Ltd"],
      ["fileNo", "F/MAP/1"],
      ["totalAmount", "999999"],
    ]);
    const { doc } = createMockDoc();
    renderFinanceProcurementRecommendationSanctionPdf(doc, { responses: map });
    expect(hasText(doc, "Map Purchased Item")).toBe(true);
    expect(hasText(doc, "MAP/2025/001")).toBe(true);
    expect(hasText(doc, "Map Vendor Pvt Ltd")).toBe(true);
    expect(hasText(doc, "F/MAP/1")).toBe(true);
    expect(hasText(doc, "999999")).toBe(true);
  });
});

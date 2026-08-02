const {
  renderCCRDRecommendationDirectPurchaseGeMPdf,
} = require("../../src/forms/cc/CCRDRecommendationDirectPurchaseGeM");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const createDoc = () => {
  const { doc } = createMockDoc();
  doc.save = () => doc;
  doc.fillColor = () => doc;
  doc.fill = () => doc;
  doc.restore = () => doc;
  return doc;
};

const allFields = {
  projectNo: "PRJ-2025-014",
  date: "2025-04-01T00:00:00.000Z",
  itemDescription: "High Performance Computing Server",
  indentDate: "2025-04-01T00:00:00.000Z",
  indentItemName: "GPU Workstation",
  srNo_1: "1",
  itemDesc_1: "Dell PowerEdge R760",
  rate_1: "1500000",
  qty_1: "2",
  totalPrice_1: "3000000",
  srNo_2: "2",
  itemDesc_2: "HP Z8 G4",
  rate_2: "1200000",
  qty_2: "1",
  totalPrice_2: "1200000",
  amountInWords: "Rupees Forty Two Lakh Only",
  recommendedItemName: "Dell PowerEdge R760",
  member1Name: "Prof. Alok Kumar",
  member2Name: "Dr. Sunita Sharma",
  member3Name: "Er. Rajesh Singh",
  member4Name: "Mrs. Priya Verma",
  jtsName: "Sh. Anil Kumar JTS",
  hodCCName: "Prof. Manoj Tiwari",
  investigatorName: "Dr. Arjun Mehta",
  arRDName: "Dr. Neha Gupta",
  drRDName: "Dr. Rakesh Yadav",
  aDeanRDName: "Prof. Suresh Chandra",
  directorName: "Prof. T.N. Singh",
};

describe("renderCCRDRecommendationDirectPurchaseGeMPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const doc = createDoc();
    expect(() => renderCCRDRecommendationDirectPurchaseGeMPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const doc = createDoc();
    expect(() =>
      renderCCRDRecommendationDirectPurchaseGeMPdf(doc, { responses: undefined })
    ).not.toThrow();
  });

  test("renders without throwing when submission is empty", () => {
    const doc = createDoc();
    expect(() => renderCCRDRecommendationDirectPurchaseGeMPdf(doc, {})).not.toThrow();
  });

  test("renders static form headers and labels", () => {
    const doc = createDoc();
    renderCCRDRecommendationDirectPurchaseGeMPdf(doc, { responses: {} });
    expect(hasText(doc, "Form No. P002")).toBe(true);
    expect(hasText(doc, "Format for procurement by Local Purchase Committee")).toBe(true);
    expect(hasText(doc, "Recommendation cum Sanction Sheet for the purchase of")).toBe(true);
    expect(hasText(doc, "IIT Patna")).toBe(true);
    expect(hasText(doc, "Page 1 of 1")).toBe(true);
  });

  test("renders every user-facing response field with sample values", () => {
    const doc = createDoc();
    renderCCRDRecommendationDirectPurchaseGeMPdf(doc, { responses: allFields });
    const expectedText = {
      date: "01/04/2025",
      indentDate: "01/04/2025",
    };
    for (const [key, value] of Object.entries(allFields)) {
      expect(hasText(doc, expectedText[key] || value)).toBe(true);
    }
  });

  test("formats date fields as en-GB dd/mm/yyyy", () => {
    const doc = createDoc();
    renderCCRDRecommendationDirectPurchaseGeMPdf(doc, {
      responses: {
        date: "2025-04-01T00:00:00.000Z",
        indentDate: "2025-04-01T00:00:00.000Z",
      },
    });
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "An indent dated 01/04/2025")).toBe(true);
  });

  test("invalid and empty dates do not crash and render placeholders", () => {
    const doc = createDoc();
    expect(() =>
      renderCCRDRecommendationDirectPurchaseGeMPdf(doc, {
        responses: { date: "not-a-date", indentDate: "garbage" },
      })
    ).not.toThrow();
    expect(hasText(doc, "dd-mm-yyyy")).toBe(true);
    expect(hasText(doc, "An indent dated dd/mm/yyyy")).toBe(true);
    const doc2 = createDoc();
    expect(() =>
      renderCCRDRecommendationDirectPurchaseGeMPdf(doc2, {
        responses: { date: "", indentDate: "" },
      })
    ).not.toThrow();
  });

  test("renders table row and amount values", () => {
    const doc = createDoc();
    renderCCRDRecommendationDirectPurchaseGeMPdf(doc, {
      responses: {
        srNo_1: "1",
        itemDesc_1: "Dell PowerEdge R760",
        rate_1: "1500000",
        qty_1: "2",
        totalPrice_1: "3000000",
        srNo_2: "2",
        itemDesc_2: "HP Z8 G4",
        rate_2: "1200000",
        qty_2: "1",
        totalPrice_2: "1200000",
        amountInWords: "Rupees Forty Two Lakh Only",
      },
    });
    expect(hasText(doc, "Dell PowerEdge R760")).toBe(true);
    expect(hasText(doc, "1500000")).toBe(true);
    expect(hasText(doc, "3000000")).toBe(true);
    expect(hasText(doc, "HP Z8 G4")).toBe(true);
    expect(hasText(doc, "Rupees Forty Two Lakh Only")).toBe(true);
    expect(hasText(doc, "(Amount in words)")).toBe(true);
  });

  test("renders signature and office sections with names", () => {
    const doc = createDoc();
    renderCCRDRecommendationDirectPurchaseGeMPdf(doc, {
      responses: {
        member1Name: "Prof. Alok Kumar",
        member2Name: "Dr. Sunita Sharma",
        member3Name: "Er. Rajesh Singh",
        member4Name: "Mrs. Priya Verma",
        jtsName: "Sh. Anil Kumar JTS",
        hodCCName: "Prof. Manoj Tiwari",
        investigatorName: "Dr. Arjun Mehta",
        arRDName: "Dr. Neha Gupta",
        drRDName: "Dr. Rakesh Yadav",
        aDeanRDName: "Prof. Suresh Chandra",
        directorName: "Prof. T.N. Singh",
      },
    });
    expect(hasText(doc, "(Member 1)")).toBe(true);
    expect(hasText(doc, "(Member4)")).toBe(true);
    expect(hasText(doc, "For GeM Account:")).toBe(true);
    expect(hasText(doc, "Investigator (s)")).toBe(true);
    expect(hasText(doc, "Dean(R&D)")).toBe(true);
    expect(hasText(doc, "Director")).toBe(true);
    expect(hasText(doc, "Prof. Alok Kumar")).toBe(true);
    expect(hasText(doc, "Dr. Sunita Sharma")).toBe(true);
    expect(hasText(doc, "Er. Rajesh Singh")).toBe(true);
    expect(hasText(doc, "Mrs. Priya Verma")).toBe(true);
    expect(hasText(doc, "Sh. Anil Kumar JTS")).toBe(true);
    expect(hasText(doc, "Prof. Manoj Tiwari")).toBe(true);
    expect(hasText(doc, "Dr. Arjun Mehta")).toBe(true);
    expect(hasText(doc, "Dr. Neha Gupta")).toBe(true);
    expect(hasText(doc, "Dr. Rakesh Yadav")).toBe(true);
    expect(hasText(doc, "Prof. Suresh Chandra")).toBe(true);
    expect(hasText(doc, "Prof. T.N. Singh")).toBe(true);
  });

  test("supports Map-based responses", () => {
    const doc = createDoc();
    const responses = new Map(Object.entries(allFields));
    expect(() => renderCCRDRecommendationDirectPurchaseGeMPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "PRJ-2025-014")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "High Performance Computing Server")).toBe(true);
    expect(hasText(doc, "Prof. T.N. Singh")).toBe(true);
  });

  test("missing fields default to empty string, never 'undefined'", () => {
    const doc = createDoc();
    renderCCRDRecommendationDirectPurchaseGeMPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
  });

  test("missing fields default to empty string for undefined responses", () => {
    const doc = createDoc();
    renderCCRDRecommendationDirectPurchaseGeMPdf(doc, { responses: undefined });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
  });
});

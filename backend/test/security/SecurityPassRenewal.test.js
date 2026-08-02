const { renderSecurityPassRenewalPdf } = require("../../src/forms/security/SecurityPassRenewal");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const createDoc = () => {
  const { doc } = createMockDoc();
  doc.save = () => doc;
  return doc;
};

const allFields = {
  applicantName: "Ramesh Kumar",
  date: "2025-04-01T00:00:00.000Z",
  flatNo: "C-301, Tower B",
  mobileNo: "9876543210",
  passNumber: "SP-2025-1187",
  passHolderNameMobile: "Suresh Yadav - 9123456780",
};

describe("renderSecurityPassRenewalPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const doc = createDoc();
    expect(() => renderSecurityPassRenewalPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const doc = createDoc();
    expect(() =>
      renderSecurityPassRenewalPdf(doc, { responses: undefined })
    ).not.toThrow();
  });

  test("renders without throwing when submission is empty", () => {
    const doc = createDoc();
    expect(() => renderSecurityPassRenewalPdf(doc, {})).not.toThrow();
  });

  test("renders static form title and section labels", () => {
    const doc = createDoc();
    renderSecurityPassRenewalPdf(doc, { responses: {} });
    expect(hasText(doc, "Requisition for Renewal of Entry Pass: Domestic Help/Tutor/Driver/Supplier")).toBe(true);
    expect(hasText(doc, "Name of the Applicant")).toBe(true);
    expect(hasText(doc, "Flat No.(s)")).toBe(true);
    expect(hasText(doc, "Mobile No.")).toBe(true);
    expect(hasText(doc, "Pass Number")).toBe(true);
    expect(hasText(doc, "Name & Mobile No. of the Pass Holder")).toBe(true);
    expect(hasText(doc, "Please renew/further extend the above-mentioned pass.")).toBe(true);
    expect(hasText(doc, "Signature of applicant with date")).toBe(true);
    expect(hasText(doc, "Security Officer")).toBe(true);
    expect(hasText(doc, "PIC Security")).toBe(true);
  });

  test("renders every user-facing response field with sample values", () => {
    const doc = createDoc();
    renderSecurityPassRenewalPdf(doc, { responses: allFields });
    for (const [key, value] of Object.entries(allFields)) {
      expect(hasText(doc, value)).toBe(true);
    }
  });

  test("date is printed as provided", () => {
    const doc = createDoc();
    renderSecurityPassRenewalPdf(doc, {
      responses: { date: "2025-04-01T00:00:00.000Z" },
    });
    expect(hasText(doc, "2025-04-01T00:00:00.000Z")).toBe(true);
    expect(hasText(doc, "Date: - 2025-04-01T00:00:00.000Z")).toBe(true);
  });

  test("invalid and empty dates do not crash", () => {
    const doc = createDoc();
    expect(() =>
      renderSecurityPassRenewalPdf(doc, { responses: { date: "not-a-date" } })
    ).not.toThrow();
    const doc2 = createDoc();
    expect(() =>
      renderSecurityPassRenewalPdf(doc2, { responses: { date: "" } })
    ).not.toThrow();
  });

  test("missing fields default to empty string with no undefined/null/NaN", () => {
    const doc = createDoc();
    renderSecurityPassRenewalPdf(doc, { responses: {} });
    const text = getAllText(doc);
    expect(text).not.toContain("undefined");
    expect(text).not.toContain("null");
    expect(text).not.toContain("NaN");
  });

  test("renders both copies of the slip on one page", () => {
    const doc = createDoc();
    renderSecurityPassRenewalPdf(doc, { responses: allFields });
    const occurrences = doc.texts.filter((t) => t === "Ramesh Kumar").length;
    expect(occurrences).toBe(2);
    expect(hasText(doc, "Requisition for Renewal of Entry Pass: Domestic Help/Tutor/Driver/Supplier")).toBe(true);
  });

  test("handles Map-based responses", () => {
    const doc = createDoc();
    const responses = new Map([
      ["applicantName", "Map User"],
      ["date", "2025-04-01T00:00:00.000Z"],
      ["flatNo", "A-101"],
      ["mobileNo", "9000000000"],
      ["passNumber", "MP-001"],
      ["passHolderNameMobile", "Holder Map - 9111111111"],
    ]);
    renderSecurityPassRenewalPdf(doc, { responses });
    expect(hasText(doc, "Map User")).toBe(true);
    expect(hasText(doc, "A-101")).toBe(true);
    expect(hasText(doc, "9000000000")).toBe(true);
    expect(hasText(doc, "MP-001")).toBe(true);
    expect(hasText(doc, "Holder Map - 9111111111")).toBe(true);
  });
});

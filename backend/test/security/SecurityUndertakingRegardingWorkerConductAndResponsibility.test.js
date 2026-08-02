const { renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf } = require("../../src/forms/security/SecurityUndertakingRegardingWorkerConductAndResponsibility");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const createDoc = () => {
  const { doc } = createMockDoc();
  doc.save = () => doc;
  return doc;
};

const allFields = {
  name: "Ramesh Kumar",
  designation: "Mess Contractor",
  firmName: "Annapurna Catering Services",
  mobileNo: "9876543210",
  emailId: "ramesh.kumar@example.com",
};

describe("renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const doc = createDoc();
    expect(() =>
      renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses: {} })
    ).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const doc = createDoc();
    expect(() =>
      renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses: undefined })
    ).not.toThrow();
  });

  test("renders without throwing when submission is empty", () => {
    const doc = createDoc();
    expect(() =>
      renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, {})
    ).not.toThrow();
  });

  test("renders static form title and section labels", () => {
    const doc = createDoc();
    renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses: {} });
    expect(hasText(doc, "UNDERTAKING REGARDING WORKER CONDUCT AND RESPONSIBILITY")).toBe(true);
    expect(hasText(doc, "The Dean (Students Affairs)")).toBe(true);
    expect(hasText(doc, "IIT Patna")).toBe(true);
    expect(hasText(doc, "Subject: Undertaking regarding the Conduct & Responsibility of Mess Workers")).toBe(true);
    expect(hasText(doc, "Signature:")).toBe(true);
    expect(hasText(doc, "Name:")).toBe(true);
    expect(hasText(doc, "Designation:")).toBe(true);
    expect(hasText(doc, "Firm's Name:")).toBe(true);
    expect(hasText(doc, "Mobile No.:")).toBe(true);
    expect(hasText(doc, "Email id:")).toBe(true);
  });

  test("renders every user-facing response field with sample values", () => {
    const doc = createDoc();
    renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses: allFields });
    for (const [key, value] of Object.entries(allFields)) {
      expect(hasText(doc, value)).toBe(true);
    }
  });

  test("renders blank details when values are empty", () => {
    const doc = createDoc();
    renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses: {} });
    expect(hasText(doc, "Name:")).toBe(true);
    expect(hasText(doc, "Designation:")).toBe(true);
    expect(hasText(doc, "Firm's Name:")).toBe(true);
    expect(hasText(doc, "Mobile No.:")).toBe(true);
    expect(hasText(doc, "Email id:")).toBe(true);
  });

  test("invalid and empty date-like values do not crash", () => {
    const doc = createDoc();
    expect(() =>
      renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, {
        responses: {
          name: "not-a-date",
          designation: "2025-04-01T00:00:00.000Z",
          firmName: "",
          mobileNo: null,
          emailId: undefined,
        },
      })
    ).not.toThrow();
  });

  test("missing fields default to empty string with no undefined/null/NaN", () => {
    const doc = createDoc();
    renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses: {} });
    const text = getAllText(doc);
    expect(text).not.toContain("undefined");
    expect(text).not.toContain("null");
    expect(text).not.toContain("NaN");
  });

  test("handles Map-based responses", () => {
    const doc = createDoc();
    const responses = new Map([
      ["name", "Suresh Yadav"],
      ["designation", "Contractor"],
      ["firmName", "Yadav Caterers"],
      ["mobileNo", "9123456780"],
      ["emailId", "suresh.yadav@example.com"],
    ]);
    renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses });
    expect(hasText(doc, "Suresh Yadav")).toBe(true);
    expect(hasText(doc, "Contractor")).toBe(true);
    expect(hasText(doc, "Yadav Caterers")).toBe(true);
    expect(hasText(doc, "9123456780")).toBe(true);
    expect(hasText(doc, "suresh.yadav@example.com")).toBe(true);
  });

  test("handles Map-based responses with missing keys", () => {
    const doc = createDoc();
    const responses = new Map([["name", "Only Name"]]);
    expect(() =>
      renderSecurityUndertakingRegardingWorkerConductAndResponsibilityPdf(doc, { responses })
    ).not.toThrow();
    expect(hasText(doc, "Only Name")).toBe(true);
    const text = getAllText(doc);
    expect(text).not.toContain("undefined");
    expect(text).not.toContain("null");
    expect(text).not.toContain("NaN");
  });
});

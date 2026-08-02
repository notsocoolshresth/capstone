const { renderEstbDepartureRejoiningReportPdf } = require("../../src/forms/estb/renderEstbDepartureRejoiningReportPdf");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const sampleResponses = {
  departureFromDate: "01/04/2025 (FN)",
  departureOutOfStationTill: "05/04/2025",
  departureAddress: "Patna, Bihar",
  departureContactPhone: "9876543210",
  departureDate: "2025-04-01T00:00:00.000Z",
  departureName: "Rahul Kumar",
  departureEmpNo: "EMP12345",
  departureDesignation: "Junior Engineer",
  departureDepartment: "Civil Engineering",
  rejoiningDate: "05/04/2025",
  rejoiningLeaveFrom: "01/04/2025",
  rejoiningLeaveTo: "05/04/2025",
  rejoiningSignDate: "2025-04-05T00:00:00.000Z",
  rejoiningName: "Rahul Kumar",
  rejoiningEmpNo: "EMP12345",
  rejoiningDesignation: "Junior Engineer",
  rejoiningDepartment: "Civil Engineering",
};

describe("renderEstbDepartureRejoiningReportPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderEstbDepartureRejoiningReportPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderEstbDepartureRejoiningReportPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission has no responses key", () => {
    const { doc } = createMockDoc();
    expect(() => renderEstbDepartureRejoiningReportPdf(doc, {})).not.toThrow();
  });

  test("renders all departure section response fields", () => {
    const { doc } = createMockDoc();
    renderEstbDepartureRejoiningReportPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "01/04/2025 (FN)")).toBe(true);
    expect(hasText(doc, "05/04/2025")).toBe(true);
    expect(hasText(doc, "Patna, Bihar")).toBe(true);
    expect(hasText(doc, "9876543210")).toBe(true);
    expect(hasText(doc, "Rahul Kumar")).toBe(true);
    expect(hasText(doc, "EMP12345")).toBe(true);
    expect(hasText(doc, "Junior Engineer")).toBe(true);
    expect(hasText(doc, "Civil Engineering")).toBe(true);
  });

  test("renders all re-joining section response fields", () => {
    const { doc } = createMockDoc();
    renderEstbDepartureRejoiningReportPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "05/04/2025")).toBe(true);
    expect(hasText(doc, "Rahul Kumar")).toBe(true);
    expect(hasText(doc, "EMP12345")).toBe(true);
    expect(hasText(doc, "Junior Engineer")).toBe(true);
    expect(hasText(doc, "Civil Engineering")).toBe(true);
  });

  test("formats date fields to en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderEstbDepartureRejoiningReportPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "05/04/2025")).toBe(true);
  });

  test("does not crash on invalid or empty date fields", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderEstbDepartureRejoiningReportPdf(doc, {
        responses: {
          departureDate: "not-a-date",
          rejoiningSignDate: "",
          departureFromDate: undefined,
          rejoiningDate: null,
        },
      })
    ).not.toThrow();
  });

  test("missing fields default to empty string without undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderEstbDepartureRejoiningReportPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toMatch(/undefined/);
    expect(allText).not.toMatch(/null/);
    expect(allText).not.toMatch(/NaN/);
  });

  test("renders form title and section headers", () => {
    const { doc } = createMockDoc();
    renderEstbDepartureRejoiningReportPdf(doc, { responses: {} });
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "DEPARTURE REPORT")).toBe(true);
    expect(hasText(doc, "RE-JOINING REPORT")).toBe(true);
  });

  test("handles a Map-based responses object", () => {
    const { doc } = createMockDoc();
    const map = new Map([
      ["departureFromDate", "01/04/2025 (FN)"],
      ["departureOutOfStationTill", "05/04/2025"],
      ["departureAddress", "Patna, Bihar"],
      ["departureContactPhone", "9876543210"],
      ["departureDate", "2025-04-01T00:00:00.000Z"],
      ["departureName", "Rahul Kumar"],
      ["departureEmpNo", "EMP12345"],
      ["departureDesignation", "Junior Engineer"],
      ["departureDepartment", "Civil Engineering"],
      ["rejoiningDate", "05/04/2025"],
      ["rejoiningLeaveFrom", "01/04/2025"],
      ["rejoiningLeaveTo", "05/04/2025"],
      ["rejoiningSignDate", "2025-04-05T00:00:00.000Z"],
      ["rejoiningName", "Rahul Kumar"],
      ["rejoiningEmpNo", "EMP12345"],
      ["rejoiningDesignation", "Junior Engineer"],
      ["rejoiningDepartment", "Civil Engineering"],
    ]);
    renderEstbDepartureRejoiningReportPdf(doc, { responses: map });
    expect(hasText(doc, "Rahul Kumar")).toBe(true);
    expect(hasText(doc, "EMP12345")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });
});

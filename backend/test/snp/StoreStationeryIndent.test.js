const { renderStoresStationeryIndentPdf } = require("../../src/forms/snp/StoreStationeryIndentPdf");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const sampleResponses = {
  employeeName: "Rahul Kumar",
  empNo: "EMP12345",
  designation: "Junior Engineer",
  deptSection: "Civil Engineering",
  date: "2025-04-01T00:00:00.000Z",
  hodSignature: "Dr. A. Sharma",
  employeeSignature: "Rahul Kumar",
  stationaryIncharge: "Mr. S. Verma",
  itemsJson: JSON.stringify([
    { particulars: "A4 Paper", quantity: "50", remarks: "For office use" },
    { particulars: "Blue Pens", quantity: "20", remarks: "Box of 10" },
  ]),
};

describe("renderStoresStationeryIndentPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderStoresStationeryIndentPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderStoresStationeryIndentPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission has no responses key", () => {
    const { doc } = createMockDoc();
    expect(() => renderStoresStationeryIndentPdf(doc, {})).not.toThrow();
  });

  test("renders all response fields", () => {
    const { doc } = createMockDoc();
    renderStoresStationeryIndentPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "Rahul Kumar")).toBe(true);
    expect(hasText(doc, "EMP12345")).toBe(true);
    expect(hasText(doc, "Junior Engineer")).toBe(true);
    expect(hasText(doc, "Civil Engineering")).toBe(true);
    expect(hasText(doc, "Dr. A. Sharma")).toBe(true);
    expect(hasText(doc, "Mr. S. Verma")).toBe(true);
  });

  test("renders itemised table entries from itemsJson", () => {
    const { doc } = createMockDoc();
    renderStoresStationeryIndentPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "A4 Paper")).toBe(true);
    expect(hasText(doc, "Blue Pens")).toBe(true);
    expect(hasText(doc, "50")).toBe(true);
    expect(hasText(doc, "20")).toBe(true);
    expect(hasText(doc, "For office use")).toBe(true);
    expect(hasText(doc, "Box of 10")).toBe(true);
    expect(hasText(doc, "1.")).toBe(true);
    expect(hasText(doc, "2.")).toBe(true);
  });

  test("does not crash on invalid itemsJson", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderStoresStationeryIndentPdf(doc, { responses: { itemsJson: "not-json" } })
    ).not.toThrow();
    expect(() =>
      renderStoresStationeryIndentPdf(doc, { responses: { itemsJson: "{}" } })
    ).not.toThrow();
  });

  test("formats date field to en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderStoresStationeryIndentPdf(doc, { responses: sampleResponses });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("does not crash on invalid or empty date fields", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderStoresStationeryIndentPdf(doc, {
        responses: {
          date: "not-a-date",
        },
      })
    ).not.toThrow();
    expect(() =>
      renderStoresStationeryIndentPdf(doc, {
        responses: {
          date: "",
        },
      })
    ).not.toThrow();
    expect(() =>
      renderStoresStationeryIndentPdf(doc, {
        responses: {
          date: undefined,
        },
      })
    ).not.toThrow();
  });

  test("missing fields default to empty string without undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderStoresStationeryIndentPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toMatch(/undefined/);
    expect(allText).not.toMatch(/null/);
    expect(allText).not.toMatch(/NaN/);
  });

  test("renders form title, headers and section labels", () => {
    const { doc } = createMockDoc();
    renderStoresStationeryIndentPdf(doc, { responses: {} });
    expect(hasText(doc, "Indian Institute of Technology Patna")).toBe(true);
    expect(hasText(doc, "STATIONARY INDENT FORM")).toBe(true);
    expect(hasText(doc, "Date:")).toBe(true);
    expect(hasText(doc, "Name of the employee")).toBe(true);
    expect(hasText(doc, "Emp. No.")).toBe(true);
    expect(hasText(doc, "Designation")).toBe(true);
    expect(hasText(doc, "Dept./Section/Centre")).toBe(true);
    expect(hasText(doc, "PARTICULARS")).toBe(true);
    expect(hasText(doc, "QUANTITY")).toBe(true);
    expect(hasText(doc, "REMARKS")).toBe(true);
    expect(hasText(doc, "Signature of HOD/HOS/DEAN")).toBe(true);
    expect(hasText(doc, "Signature of the employee")).toBe(true);
    expect(hasText(doc, "Stationary In-charge")).toBe(true);
  });

  test("handles a Map-based responses object", () => {
    const { doc } = createMockDoc();
    const map = new Map([
      ["employeeName", "Rahul Kumar"],
      ["empNo", "EMP12345"],
      ["designation", "Junior Engineer"],
      ["deptSection", "Civil Engineering"],
      ["date", "2025-04-01T00:00:00.000Z"],
      ["hodSignature", "Dr. A. Sharma"],
      ["employeeSignature", "Rahul Kumar"],
      ["stationaryIncharge", "Mr. S. Verma"],
      ["itemsJson", JSON.stringify([{ particulars: "A4 Paper", quantity: "50", remarks: "For office use" }])],
    ]);
    renderStoresStationeryIndentPdf(doc, { responses: map });
    expect(hasText(doc, "Rahul Kumar")).toBe(true);
    expect(hasText(doc, "EMP12345")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "A4 Paper")).toBe(true);
  });
});

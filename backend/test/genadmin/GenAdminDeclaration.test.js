const { renderGenAdminPdf } = require("../../src/forms/genadmin/pdfGenerator");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const sampleValues = {
  salutation: "Dr.",
  fullName: "Rahul Sharma",
  designation: "Assistant Professor",
  department: "Mechanical Engineering",
  employeeSignatureName: "Rahul Sharma",
  empNo: "EMP-98765",
  place: "Patna",
  declarationDate: "2025-04-01T00:00:00.000Z",
};

describe("renderGenAdminPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderGenAdminPdf(doc, { responses: {} })
    ).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderGenAdminPdf(doc, { responses: undefined })
    ).not.toThrow();
  });

  test("renders without throwing when submission is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderGenAdminPdf(doc, {})).not.toThrow();
  });

  test("renders static declaration text", () => {
    const { doc } = createMockDoc();
    renderGenAdminPdf(doc, { responses: {} });
    expect(hasText(doc, "DECLARATION")).toBe(true);
    expect(hasText(doc, "IIT Patna declare that there is nothing adverse against me in the Police record either")).toBe(true);
    expect(hasText(doc, "criminally or politically, which would render me un-suitable for employment under the")).toBe(true);
    expect(hasText(doc, "Govt. of India / IIT Patna.")).toBe(true);
    expect(hasText(doc, "I, solemnly affirm that the above declaration is true and I understand that furnishing")).toBe(true);
    expect(hasText(doc, "of false information or suppression of any factual information, which come to notice of the")).toBe(true);
    expect(hasText(doc, "authorities of the Institute at any time during my service would be a disqualification and I")).toBe(true);
    expect(hasText(doc, "shall be liable to be dismissed from the service of the Institute.")).toBe(true);
  });

  test("renders To, The Director and IIT Patna", () => {
    const { doc } = createMockDoc();
    renderGenAdminPdf(doc, { responses: {} });
    expect(hasText(doc, "To")).toBe(true);
    expect(hasText(doc, "The Director")).toBe(true);
    expect(hasText(doc, "IIT Patna")).toBe(true);
  });

  test("renders signature block labels", () => {
    const { doc } = createMockDoc();
    renderGenAdminPdf(doc, { responses: {} });
    expect(hasText(doc, "SIGNATURE OF THE EMPLOYEE")).toBe(true);
    expect(hasText(doc, "Name    :")).toBe(true);
    expect(hasText(doc, "Emp_No. :")).toBe(true);
    expect(hasText(doc, "Place   :")).toBe(true);
    expect(hasText(doc, "Date    :")).toBe(true);
  });

  test("renders every response field value", () => {
    const { doc } = createMockDoc();
    renderGenAdminPdf(doc, {
      responses: { ...sampleValues },
    });
    expect(hasText(doc, "Dr.")).toBe(true);
    expect(hasText(doc, "Rahul Sharma")).toBe(true);
    expect(hasText(doc, "Assistant Professor")).toBe(true);
    expect(hasText(doc, "Mechanical Engineering")).toBe(true);
    expect(hasText(doc, "EMP-98765")).toBe(true);
    expect(hasText(doc, "Patna")).toBe(true);
  });

  test("formats date field as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderGenAdminPdf(doc, {
      responses: { declarationDate: "2025-04-01T00:00:00.000Z" },
    });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("handles invalid date without crashing", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderGenAdminPdf(doc, {
        responses: { declarationDate: "not-a-valid-date" },
      })
    ).not.toThrow();
    expect(hasText(doc, "not-a-valid-date")).toBe(false);
  });

  test("handles empty date without crashing", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderGenAdminPdf(doc, {
        responses: { declarationDate: "" },
      })
    ).not.toThrow();
  });

  test("missing fields default to empty string with no undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderGenAdminPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText.includes("undefined")).toBe(false);
    expect(allText.includes("null")).toBe(false);
    expect(allText.includes("NaN")).toBe(false);
  });

  test("renders response values from a Map-based responses object", () => {
    const { doc } = createMockDoc();
    const responses = new Map([
      ["salutation", "Dr."],
      ["fullName", "Rahul Sharma"],
      ["designation", "Assistant Professor"],
      ["department", "Mechanical Engineering"],
      ["employeeSignatureName", "Rahul Sharma"],
      ["empNo", "EMP-98765"],
      ["place", "Patna"],
      ["declarationDate", "2025-04-01T00:00:00.000Z"],
    ]);
    renderGenAdminPdf(doc, { responses });
    expect(hasText(doc, "Dr.")).toBe(true);
    expect(hasText(doc, "Rahul Sharma")).toBe(true);
    expect(hasText(doc, "Assistant Professor")).toBe(true);
    expect(hasText(doc, "Mechanical Engineering")).toBe(true);
    expect(hasText(doc, "EMP-98765")).toBe(true);
    expect(hasText(doc, "Patna")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });
});

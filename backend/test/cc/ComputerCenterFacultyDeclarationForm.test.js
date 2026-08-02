const { renderComputerCenterFacultyDeclarationPdf } = require("../../src/forms/cc/ComputerCenterFacultyDeclarationForm");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const sampleValues = {
  facultyName: "Prof. Alok Kumar",
  employeeNo: "EMP-12345",
  designation: "Professor",
  department: "Computer Science and Engineering",
  facultySignature: "A. Kumar",
  date: "2025-04-01T00:00:00.000Z",
};

describe("renderComputerCenterFacultyDeclarationPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyDeclarationPdf(doc, { responses: {} })
    ).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyDeclarationPdf(doc, { responses: undefined })
    ).not.toThrow();
  });

  test("renders without throwing when submission is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterFacultyDeclarationPdf(doc, {})).not.toThrow();
  });

  test("renders form title and static labels", () => {
    const { doc } = createMockDoc();
    renderComputerCenterFacultyDeclarationPdf(doc, { responses: {} });
    expect(hasText(doc, "IIT Patna Website Faculty Declaration Form")).toBe(true);
    expect(hasText(doc, "Faculty Name:")).toBe(true);
    expect(hasText(doc, "Employee No:")).toBe(true);
    expect(hasText(doc, "Designation:")).toBe(true);
    expect(hasText(doc, "Department:")).toBe(true);
    expect(hasText(doc, "Faculty Signature:")).toBe(true);
    expect(hasText(doc, "Date:")).toBe(true);
  });

  test("renders every response field value", () => {
    const { doc } = createMockDoc();
    renderComputerCenterFacultyDeclarationPdf(doc, {
      responses: { ...sampleValues },
    });
    expect(hasText(doc, "Prof. Alok Kumar")).toBe(true);
    expect(hasText(doc, "EMP-12345")).toBe(true);
    expect(hasText(doc, "Professor")).toBe(true);
    expect(hasText(doc, "Computer Science and Engineering")).toBe(true);
    expect(hasText(doc, "A. Kumar")).toBe(true);
  });

  test("formats date field as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderComputerCenterFacultyDeclarationPdf(doc, {
      responses: { date: "2025-04-01T00:00:00.000Z" },
    });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("handles invalid date without crashing and omits date text", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyDeclarationPdf(doc, {
        responses: { date: "not-a-valid-date" },
      })
    ).not.toThrow();
    expect(hasText(doc, "not-a-valid-date")).toBe(false);
  });

  test("handles empty date without crashing", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterFacultyDeclarationPdf(doc, {
        responses: { date: "" },
      })
    ).not.toThrow();
  });

  test("missing fields default to empty string with no undefined text", () => {
    const { doc } = createMockDoc();
    renderComputerCenterFacultyDeclarationPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText.includes("undefined")).toBe(false);
    expect(allText.includes("null")).toBe(false);
  });

  test("renders response values from a Map-based responses object", () => {
    const { doc } = createMockDoc();
    const responses = new Map([
      ["facultyName", "Prof. Alok Kumar"],
      ["employeeNo", "EMP-12345"],
      ["designation", "Professor"],
      ["department", "Computer Science and Engineering"],
      ["facultySignature", "A. Kumar"],
      ["date", "2025-04-01T00:00:00.000Z"],
    ]);
    renderComputerCenterFacultyDeclarationPdf(doc, { responses });
    expect(hasText(doc, "Prof. Alok Kumar")).toBe(true);
    expect(hasText(doc, "EMP-12345")).toBe(true);
    expect(hasText(doc, "Professor")).toBe(true);
    expect(hasText(doc, "Computer Science and Engineering")).toBe(true);
    expect(hasText(doc, "A. Kumar")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });
});

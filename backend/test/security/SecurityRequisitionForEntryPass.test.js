const { renderSecurityRequisitionForEntryPassPdf } = require("../../src/forms/security/SecurityRequisitionForEntryPass");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const SAMPLE = {
  applicantName: "Anita Sharma",
  employeeNo: "IITP/EMP/2018/0042",
  designation: "Assistant Registrar",
  department: "Administration Section",
  emailId: "anita.sharma@iitp.ac.in",
  flatNo: "B-204, Faculty Flat",
  mobileNo: "9835012345",
  helperName: "Ramesh Prasad",
  helperAadhar: "1234 5678 9012",
  helperMobileNo: "9123456780",
  visibleIdentificationMark: "Mole on left cheek",
  employedAs: "Domestic Help",
  campusEntryExitTime: "08:00 AM - 06:00 PM",
};

describe("SecurityRequisitionForEntryPass", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityRequisitionForEntryPassPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityRequisitionForEntryPassPdf(doc, { responses: undefined })).not.toThrow();
    expect(() => renderSecurityRequisitionForEntryPassPdf(doc, {})).not.toThrow();
  });

  test("renders the institute name and form title", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForEntryPassPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, "Bhartiya Praudyogiki Sansthan, Patna")).toBe(true);
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "Form for Entry Pass: Domestic Help/Tutor/Driver/Supplier")).toBe(true);
  });

  test("renders all section headers and labels", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForEntryPassPdf(doc, { responses: SAMPLE });
    for (const label of [
      "Name of the Applicant",
      "Employee No.",
      "Designation",
      "Department /Section",
      "Email id",
      "Flat No.",
      "Mobile No.",
      "Name of the Domestic Help/Tutor/Driver/Supplier",
      "Aadhar Card/ Photo Id No.",
      "Visible identification mark",
      "Employed as",
      "Campus entry & exit time",
      "Pass No. & issue date (for office use)",
      "Office Note:",
      "Signature of Security Officer",
      "Remarks by PIC Security: -",
      "Signature of PIC Security",
    ]) {
      expect(hasText(doc, label)).toBe(true);
    }
  });

  test("renders applicant detail fields", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForEntryPassPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, SAMPLE.applicantName)).toBe(true);
    expect(hasText(doc, SAMPLE.employeeNo)).toBe(true);
    expect(hasText(doc, SAMPLE.designation)).toBe(true);
    expect(hasText(doc, SAMPLE.department)).toBe(true);
    expect(hasText(doc, SAMPLE.emailId)).toBe(true);
    expect(hasText(doc, SAMPLE.flatNo)).toBe(true);
    expect(hasText(doc, SAMPLE.mobileNo)).toBe(true);
  });

  test("renders domestic help detail fields", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForEntryPassPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, SAMPLE.helperName)).toBe(true);
    expect(hasText(doc, SAMPLE.helperAadhar)).toBe(true);
    expect(hasText(doc, SAMPLE.helperMobileNo)).toBe(true);
    expect(hasText(doc, SAMPLE.visibleIdentificationMark)).toBe(true);
    expect(hasText(doc, SAMPLE.employedAs)).toBe(true);
    expect(hasText(doc, SAMPLE.campusEntryExitTime)).toBe(true);
  });

  test("accepts Map-based responses", () => {
    const { doc } = createMockDoc();
    const responses = new Map(Object.entries(SAMPLE));
    renderSecurityRequisitionForEntryPassPdf(doc, { responses });
    expect(hasText(doc, SAMPLE.applicantName)).toBe(true);
    expect(hasText(doc, SAMPLE.helperName)).toBe(true);
    expect(hasText(doc, SAMPLE.campusEntryExitTime)).toBe(true);
  });

  test("missing fields render as empty strings without undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForEntryPassPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });

  test("invalid or empty date-like values do not crash the renderer", () => {
    const { doc } = createMockDoc();
    const responses = {
      applicantName: "2025-04-01T00:00:00.000Z",
      employeeNo: "not-a-date",
      designation: "",
      department: null,
    };
    expect(() => renderSecurityRequisitionForEntryPassPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "2025-04-01T00:00:00.000Z")).toBe(true);
    expect(getAllText(doc)).not.toContain("undefined");
    expect(getAllText(doc)).not.toContain("null");
  });
});

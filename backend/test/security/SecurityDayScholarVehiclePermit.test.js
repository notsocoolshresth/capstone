const { renderSecurityDayScholarVehiclePermitPdf } = require("../../src/forms/security/SecurityDayScholarVehiclePermit");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const SAMPLE = {
  nameRollNumber: "Rahul Kumar (2201CS01)",
  mobileNumber: "9876543210",
  instituteEmail: "rahul.kumar@iitp.ac.in",
  department: "Computer Science and Engineering",
  ownerName: "Suresh Kumar",
  ownerRelationship: "Father",
  vehicleRegNo: "BR01AB1234",
  engineNumber: "ENG889900",
  chassisNumber: "CHS1234567890",
  vehicleType: "Bike",
  residentialAddress: "Flat 42, Patliputra Colony, Patna",
};

describe("SecurityDayScholarVehiclePermit", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityDayScholarVehiclePermitPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityDayScholarVehiclePermitPdf(doc, { responses: undefined })).not.toThrow();
    expect(() => renderSecurityDayScholarVehiclePermitPdf(doc, {})).not.toThrow();
  });

  test("renders the form title", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, "IIT PATNA – DAY SCHOLAR VEHICLE PERMIT & PARKING PERMISSION FORM")).toBe(true);
  });

  test("renders all section headers and labels", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: SAMPLE });
    for (const label of [
      "Day Scholar Details:",
      "Vehicle Details",
      "Residential Address (Daily Commute From):",
      "Undertaking by the Student",
      "Signature of the Day Scholar:",
      "Supervisor/PI Certification",
      "Verification by Office of the Dean of Student Affairs",
      "For Office Use Only",
      "Security Officer",
      "PIC Security",
    ]) {
      expect(hasText(doc, label)).toBe(true);
    }
  });

  test("renders day scholar detail fields", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, SAMPLE.nameRollNumber)).toBe(true);
    expect(hasText(doc, SAMPLE.mobileNumber)).toBe(true);
    expect(hasText(doc, SAMPLE.instituteEmail)).toBe(true);
    expect(hasText(doc, SAMPLE.department)).toBe(true);
  });

  test("renders vehicle detail fields", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, SAMPLE.ownerName)).toBe(true);
    expect(hasText(doc, SAMPLE.ownerRelationship)).toBe(true);
    expect(hasText(doc, SAMPLE.vehicleRegNo)).toBe(true);
    expect(hasText(doc, SAMPLE.engineNumber)).toBe(true);
    expect(hasText(doc, SAMPLE.chassisNumber)).toBe(true);
    expect(hasText(doc, SAMPLE.vehicleType)).toBe(true);
  });

  test("renders the residential address", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, SAMPLE.residentialAddress)).toBe(true);
  });

  test("accepts Map-based responses", () => {
    const { doc } = createMockDoc();
    const responses = new Map(Object.entries(SAMPLE));
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses });
    expect(hasText(doc, SAMPLE.nameRollNumber)).toBe(true);
    expect(hasText(doc, SAMPLE.vehicleRegNo)).toBe(true);
    expect(hasText(doc, SAMPLE.residentialAddress)).toBe(true);
  });

  test("renders combined mobile and email on one line when both present", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, "9876543210  &  Institute Email: rahul.kumar@iitp.ac.in")).toBe(true);
  });

  test("renders combined engine and chassis on one line when both present", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: SAMPLE });
    expect(hasText(doc, "ENG889900  &  Chassis Number: CHS1234567890")).toBe(true);
  });

  test("missing fields render as empty strings without undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderSecurityDayScholarVehiclePermitPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });

  test("invalid or empty date-like values do not crash the renderer", () => {
    const { doc } = createMockDoc();
    const responses = {
      nameRollNumber: "2025-04-01T00:00:00.000Z",
      mobileNumber: "not-a-date",
      instituteEmail: "",
      department: null,
    };
    expect(() => renderSecurityDayScholarVehiclePermitPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "2025-04-01T00:00:00.000Z")).toBe(true);
    expect(getAllText(doc)).not.toContain("undefined");
    expect(getAllText(doc)).not.toContain("null");
  });
});

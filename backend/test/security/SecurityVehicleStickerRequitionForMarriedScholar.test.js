const { renderSecurityVehicleStickerRequitionForMarriedScholarPdf } = require("../../src/forms/security/SecurityVehicleStickerRequitionForMarriedScholar");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const sampleResponses = {
  employeeName: "Dr. Priya Sharma",
  vehicleOwnership: "Self",
  rollNo: "2212CS23",
  department: "Computer Science and Engineering",
  residentialAddress: "House No. 14, Married Scholar Hostel, IIT Patna",
  mobileNo: "9876543210",
  instituteEmailId: "priya@iitp.ac.in",
  vehicleNumber: "BR 01 AB 1234",
  engineNumber: "ENG-2021-4488",
  chassisNo: "CH-99512-XYZ",
  vehicleType: "Hatchback",
  signatureWithDate: "Amit Kumar, 30/04/2025",
  supervisorRecommendation: "Recommended",
  hodRemarks: "Approved",
  officeVehicleStickerNo: "VST-2025-0142",
  officeDateOfIssue: "2025-04-01T00:00:00.000Z",
  officeNote: "Sticker issued",
  securityOfficerSignature: "R. N. Singh",
};

const sampleValues = [
  "Dr. Priya Sharma",
  "Self",
  "2212CS23",
  "Computer Science and Engineering",
  "House No. 14, Married Scholar Hostel, IIT Patna",
  "9876543210",
  "priya@iitp.ac.in",
  "BR 01 AB 1234",
  "ENG-2021-4488",
  "CH-99512-XYZ",
  "Hatchback",
  "Amit Kumar, 30/04/2025",
  "Recommended",
  "Approved",
  "VST-2025-0142",
  "Sticker issued",
  "R. N. Singh",
];

describe("SecurityVehicleStickerRequitionForMarriedScholar", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityVehicleStickerRequitionForMarriedScholarPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityVehicleStickerRequitionForMarriedScholarPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders title and header text", () => {
    const { doc } = createMockDoc();
    renderSecurityVehicleStickerRequitionForMarriedScholarPdf(doc, { responses: {} });
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "REQUISITION FOR VEHICLE STICKER (Resident of Married Accommodation Only)")).toBe(true);
    expect(hasText(doc, "For office use")).toBe(true);
  });

  test("renders every user-facing response field value", () => {
    const { doc } = createMockDoc();
    renderSecurityVehicleStickerRequitionForMarriedScholarPdf(doc, { responses: sampleResponses });
    sampleValues.forEach((value) => {
      expect(hasText(doc, value)).toBe(true);
    });
  });

  test("formats officeDateOfIssue as dd/mm/yyyy en-GB", () => {
    const { doc } = createMockDoc();
    renderSecurityVehicleStickerRequitionForMarriedScholarPdf(doc, {
      responses: { officeDateOfIssue: "2025-04-01T00:00:00.000Z" },
    });
    const expected = new Date("2025-04-01T00:00:00.000Z").toLocaleDateString("en-GB");
    expect(hasText(doc, expected)).toBe(true);
    expect(expected).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  test("renders without crashing on invalid and empty dates", () => {
    const { doc: invalidDoc } = createMockDoc();
    expect(() =>
      renderSecurityVehicleStickerRequitionForMarriedScholarPdf(invalidDoc, {
        responses: { officeDateOfIssue: "not-a-date" },
      })
    ).not.toThrow();
    const { doc: emptyDoc } = createMockDoc();
    expect(() =>
      renderSecurityVehicleStickerRequitionForMarriedScholarPdf(emptyDoc, {
        responses: { officeDateOfIssue: "" },
      })
    ).not.toThrow();
  });

  test("missing fields default to empty string with no undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderSecurityVehicleStickerRequitionForMarriedScholarPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });

  test("renders with Map-based responses", () => {
    const { doc } = createMockDoc();
    renderSecurityVehicleStickerRequitionForMarriedScholarPdf(doc, {
      responses: new Map([
        ["employeeName", "Dr. Priya Sharma"],
        ["vehicleNumber", "BR 01 AB 1234"],
        ["officeVehicleStickerNo", "VST-2025-0142"],
      ]),
    });
    expect(hasText(doc, "Dr. Priya Sharma")).toBe(true);
    expect(hasText(doc, "BR 01 AB 1234")).toBe(true);
    expect(hasText(doc, "VST-2025-0142")).toBe(true);
  });
});

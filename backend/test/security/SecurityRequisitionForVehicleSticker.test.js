const { renderSecurityRequisitionForVehicleStickerPdf } = require("../../src/forms/security/SecurityRequisitionForVehicleSticker");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const buildResponses = () => ({
  employeeName: "Rahul Kumar",
  vehicleOwnership: "Self",
  employeeNo: "EMP-2025-0421",
  designation: "Research Scholar",
  departmentSection: "Mechanical Engineering",
  residentialAddress: "Hostel 3, Room 214, IIT Patna",
  mobileNo: "+91 9876543210",
  instituteEmailId: "rahul.kumar@iitp.ac.in",
  vehicleNumber: "BR01AB1234",
  engineNumber: "ENG88231",
  chassisNo: "MBJCPA63PDP000123",
  vehicleType: "Two Wheeler",
  signatureWithDate: "Rahul Kumar, 01/04/2025",
  officeVehicleStickerNo: "STK-2025-088",
  officeDateOfIssue: "2025-04-01T00:00:00.000Z",
  officeNote: "Approved",
  securityOfficerSignature: "S. Officer",
});

describe("SecurityRequisitionForVehicleSticker", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission itself is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityRequisitionForVehicleStickerPdf(doc, {})).not.toThrow();
  });

  test("renders title and section header text", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: {} });
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "REQUISITION FOR VEHICLE STICKER")).toBe(true);
    expect(hasText(doc, "Name of the employee")).toBe(true);
    expect(hasText(doc, "Ownership of the Vehicle")).toBe(true);
    expect(hasText(doc, "Employee No.")).toBe(true);
    expect(hasText(doc, "Designation")).toBe(true);
    expect(hasText(doc, "Department / Section")).toBe(true);
    expect(hasText(doc, "Residential Address")).toBe(true);
    expect(hasText(doc, "Mobile No.")).toBe(true);
    expect(hasText(doc, "Institute e-mail ID")).toBe(true);
    expect(hasText(doc, "Vehicle Number")).toBe(true);
    expect(hasText(doc, "Engine Number")).toBe(true);
    expect(hasText(doc, "Chassis No.")).toBe(true);
    expect(hasText(doc, "Type of Vehicle")).toBe(true);
    expect(hasText(doc, "Signature with date")).toBe(true);
    expect(hasText(doc, "For office use")).toBe(true);
    expect(hasText(doc, "Vehicle Sticker No.")).toBe(true);
    expect(hasText(doc, "Date of issue")).toBe(true);
    expect(hasText(doc, "Office Note:")).toBe(true);
    expect(hasText(doc, "Signature of Security Officer")).toBe(true);
  });

  test("renders every user-facing response field value", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: buildResponses() });

    expect(hasText(doc, "Rahul Kumar")).toBe(true);
    expect(hasText(doc, "Self")).toBe(true);
    expect(hasText(doc, "EMP-2025-0421")).toBe(true);
    expect(hasText(doc, "Research Scholar")).toBe(true);
    expect(hasText(doc, "Mechanical Engineering")).toBe(true);
    expect(hasText(doc, "Hostel 3, Room 214, IIT Patna")).toBe(true);
    expect(hasText(doc, "+91 9876543210")).toBe(true);
    expect(hasText(doc, "rahul.kumar@iitp.ac.in")).toBe(true);
    expect(hasText(doc, "BR01AB1234")).toBe(true);
    expect(hasText(doc, "ENG88231")).toBe(true);
    expect(hasText(doc, "MBJCPA63PDP000123")).toBe(true);
    expect(hasText(doc, "Two Wheeler")).toBe(true);
    expect(hasText(doc, "Rahul Kumar, 01/04/2025")).toBe(true);
    expect(hasText(doc, "STK-2025-088")).toBe(true);
    expect(hasText(doc, "Approved")).toBe(true);
    expect(hasText(doc, "S. Officer")).toBe(true);
  });

  test("formats office date of issue as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: { officeDateOfIssue: "2025-04-01T00:00:00.000Z" } });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("renders without crash for invalid and empty date values", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: { officeDateOfIssue: "not-a-date" } })
    ).not.toThrow();
    expect(() =>
      renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: { officeDateOfIssue: "" } })
    ).not.toThrow();
    expect(() =>
      renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: { officeDateOfIssue: undefined } })
    ).not.toThrow();
  });

  test("renders signature placeholder when signatureWithDate is empty", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: {} });
    expect(hasText(doc, "Signature with date")).toBe(true);
    expect(hasText(doc, "Signature with date:")).toBe(false);
  });

  test("supports Map-based responses", () => {
    const responses = new Map([
      ["employeeName", "Map Employee"],
      ["vehicleNumber", "MAP99XY0000"],
      ["officeVehicleStickerNo", "MAP-STK-001"],
    ]);
    const { doc } = createMockDoc();
    renderSecurityRequisitionForVehicleStickerPdf(doc, { responses });
    expect(hasText(doc, "Map Employee")).toBe(true);
    expect(hasText(doc, "MAP99XY0000")).toBe(true);
    expect(hasText(doc, "MAP-STK-001")).toBe(true);
  });

  test("missing fields never render as undefined, null, or NaN", () => {
    const { doc } = createMockDoc();
    renderSecurityRequisitionForVehicleStickerPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });
});

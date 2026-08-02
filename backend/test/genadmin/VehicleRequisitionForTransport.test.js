const { renderGenAdminVehicleRequisitionPdf } = require("../../src/forms/genadmin/VehicleRequisitionForTransport");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const ISO_DATE = "2025-04-01T00:00:00.000Z";

const buildResponses = () => ({
  refNo: "TRAN/2025/017",
  dated: ISO_DATE,
  indentorName: "Dr. Anjali Verma",
  indentorDesignation: "Professor",
  indentorDepartment: "Civil Engineering",
  indentorDetails: "Guest Faculty, Mechanical Dept.",
  vehicleTypeRequired: "Car (Sedan)",
  vehicleRequiredDate: ISO_DATE,
  vehicleRequiredPlace: "Patna Junction",
  vehicleRequiredTime: "09:30 AM",
  vehicleRequiredUpto: "05:00 PM",
  placesToBeVisited: "IIT Patna, Rajendra Nagar",
  guestNames: "Prof. Michael Chen",
  flightOrTrainNo: "6E 2047",
  arrivalDepartureTime: "14:20",
  isOfficial: "Yes",
  officialPurpose: "External committee meeting",
  signatureDate: ISO_DATE,
  allottedVehicleNo: "BR01CG2025",
  allottedVehicleType: "Innova",
  allottedDriver: "Ram Prasad",
  driverReportTo: "Dean (Academic)",
  driverReportDate: ISO_DATE,
  driverReportPlace: "Main Gate, IIT Patna",
  driverReportTime: "08:45 AM",
});

describe("VehicleRequisitionForTransport", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderGenAdminVehicleRequisitionPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderGenAdminVehicleRequisitionPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission itself is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderGenAdminVehicleRequisitionPdf(doc, {})).not.toThrow();
  });

  test("renders title, headers, and section labels", () => {
    const { doc } = createMockDoc();
    renderGenAdminVehicleRequisitionPdf(doc, { responses: {} });
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "INDENT FOR TRANSPORT")).toBe(true);
    expect(hasText(doc, "Ref. No.:")).toBe(true);
    expect(hasText(doc, "Dated:")).toBe(true);
    expect(hasText(doc, "1. Name, Designation & Dept./Section/Centre of the Indentor")).toBe(true);
    expect(hasText(doc, "2. Type of vehicle required")).toBe(true);
    expect(hasText(doc, "3. Vehicle required")).toBe(true);
    expect(hasText(doc, "4. Place(s) to be visited")).toBe(true);
    expect(hasText(doc, "5. For duty to receive guest")).toBe(true);
    expect(hasText(doc, "6. Is it official (Yes / No)")).toBe(true);
    expect(hasText(doc, "Signature of the HOD/HOS")).toBe(true);
    expect(hasText(doc, "Signature of Indentor")).toBe(true);
    expect(hasText(doc, "Vehicle Allotment Slip (for office use only)")).toBe(true);
    expect(hasText(doc, "Transport In-charge")).toBe(true);
  });

  test("renders every user-facing response field value", () => {
    const { doc } = createMockDoc();
    renderGenAdminVehicleRequisitionPdf(doc, { responses: buildResponses() });

    expect(hasText(doc, "TRAN/2025/017")).toBe(true);
    expect(hasText(doc, "Dr. Anjali Verma")).toBe(true);
    expect(hasText(doc, "Professor")).toBe(true);
    expect(hasText(doc, "Civil Engineering")).toBe(true);
    expect(hasText(doc, "Dr. Anjali Verma, Professor, Civil Engineering")).toBe(true);
    expect(hasText(doc, "Car (Sedan)")).toBe(true);
    expect(hasText(doc, "Patna Junction")).toBe(true);
    expect(hasText(doc, "09:30 AM")).toBe(true);
    expect(hasText(doc, "05:00 PM")).toBe(true);
    expect(hasText(doc, "IIT Patna, Rajendra Nagar")).toBe(true);
    expect(hasText(doc, "Prof. Michael Chen")).toBe(true);
    expect(hasText(doc, "6E 2047")).toBe(true);
    expect(hasText(doc, "14:20")).toBe(true);
    expect(hasText(doc, "Yes")).toBe(true);
    expect(hasText(doc, "External committee meeting")).toBe(true);
    expect(hasText(doc, "BR01CG2025")).toBe(true);
    expect(hasText(doc, "Innova")).toBe(true);
    expect(hasText(doc, "Ram Prasad")).toBe(true);
    expect(hasText(doc, "Dean (Academic)")).toBe(true);
    expect(hasText(doc, "Main Gate, IIT Patna")).toBe(true);
    expect(hasText(doc, "08:45 AM")).toBe(true);
  });

  test("uses indentorDetails as fallback when name/designation/department are empty", () => {
    const { doc } = createMockDoc();
    renderGenAdminVehicleRequisitionPdf(doc, {
      responses: { indentorDetails: "Guest Faculty, Mechanical Dept." },
    });
    expect(hasText(doc, "Guest Faculty, Mechanical Dept.")).toBe(true);
  });

  test("formats date fields as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderGenAdminVehicleRequisitionPdf(doc, { responses: buildResponses() });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("renders without crash for invalid and empty date values", () => {
    const { doc } = createMockDoc();
    const invalid = {
      dated: "not-a-date",
      vehicleRequiredDate: "",
      signatureDate: undefined,
      driverReportDate: null,
    };
    expect(() => renderGenAdminVehicleRequisitionPdf(doc, { responses: invalid })).not.toThrow();
  });

  test("renders signature placeholders when values are empty", () => {
    const { doc } = createMockDoc();
    renderGenAdminVehicleRequisitionPdf(doc, { responses: {} });
    expect(hasText(doc, "Signature of the HOD/HOS")).toBe(true);
    expect(hasText(doc, "Signature of Indentor")).toBe(true);
    expect(hasText(doc, "Date :")).toBe(true);
    expect(hasText(doc, "Transport In-charge")).toBe(true);
  });

  test("supports Map-based responses", () => {
    const responses = new Map([
      ["refNo", "MAP-REF-101"],
      ["indentorName", "Map Indentor"],
      ["vehicleTypeRequired", "Bus"],
      ["allottedVehicleNo", "MAP-BUS-001"],
      ["driverReportTo", "Map Officer"],
    ]);
    const { doc } = createMockDoc();
    renderGenAdminVehicleRequisitionPdf(doc, { responses });
    expect(hasText(doc, "MAP-REF-101")).toBe(true);
    expect(hasText(doc, "Map Indentor")).toBe(true);
    expect(hasText(doc, "Bus")).toBe(true);
    expect(hasText(doc, "MAP-BUS-001")).toBe(true);
    expect(hasText(doc, "Map Officer")).toBe(true);
  });

  test("missing fields never render as undefined, null, or NaN", () => {
    const { doc } = createMockDoc();
    renderGenAdminVehicleRequisitionPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });
});

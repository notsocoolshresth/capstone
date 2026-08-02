const { renderSecurityCampusLeavePermissionForFemaleStudentsPdf } = require("../../src/forms/security/SecurityCampusLeavePermissionForFemaleStudents");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

describe("SecurityCampusLeavePermissionForFemaleStudents", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission itself is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, {})).not.toThrow();
  });

  test("renders title and institute header text", () => {
    const { doc } = createMockDoc();
    renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, { responses: {} });
    expect(hasText(doc, "IIT PATNA")).toBe(true);
    expect(hasText(doc, "Campus Leaving Permission after 10:00 PM (For Female Students)")).toBe(true);
    expect(hasText(doc, "Signature of the student with date")).toBe(true);
    expect(hasText(doc, "Remarks of the Warden")).toBe(true);
    expect(hasText(doc, "Signature of warden")).toBe(true);
    expect(hasText(doc, "(Please also enclose the supporting documents)")).toBe(true);
  });

  test("renders every user-facing response field value", () => {
    const responses = {
      name: "Priya Sharma",
      rollNo: "2101CS42",
      hostelName: "Hostel Block D",
      gender: "Female",
      dateOfLeaving: "2025-04-01T00:00:00.000Z",
      reasonForLeaving: "Going home for a family function by cab from the main gate",
      companion1Name: "Ananya Singh",
      companion1RollNo: "2201CS15",
      companion2Name: "Riya Verma",
      companion2RollNo: "2201CS27",
    };
    const { doc } = createMockDoc();
    renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, { responses });

    expect(hasText(doc, "Priya Sharma")).toBe(true);
    expect(hasText(doc, "2101CS42")).toBe(true);
    expect(hasText(doc, "Hostel Block D")).toBe(true);
    expect(hasText(doc, "Female")).toBe(true);
    expect(hasText(doc, "Going home for a family function by cab from the main gate")).toBe(true);
    expect(hasText(doc, "Ananya Singh")).toBe(true);
    expect(hasText(doc, "2201CS15")).toBe(true);
    expect(hasText(doc, "Riya Verma")).toBe(true);
    expect(hasText(doc, "2201CS27")).toBe(true);
  });

  test("defaults gender to Female when not provided", () => {
    const { doc } = createMockDoc();
    renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, { responses: {} });
    expect(hasText(doc, "Female")).toBe(true);
  });

  test("formats the date field as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, {
      responses: { dateOfLeaving: "2025-04-01T00:00:00.000Z" },
    });
    expect(hasText(doc, "01 / 04 / 2025")).toBe(true);
  });

  test("invalid and empty dates do not crash and render no NaN text", () => {
    const invalidCases = [
      { responses: {} },
      { responses: { dateOfLeaving: "" } },
      { responses: { dateOfLeaving: "not-a-date" } },
      { responses: { dateOfLeaving: null } },
      { responses: { dateOfLeaving: undefined } },
    ];
    for (const submission of invalidCases) {
      const { doc } = createMockDoc();
      expect(() => renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, submission)).not.toThrow();
      expect(hasText(doc, "NaN")).toBe(false);
      expect(hasText(doc, "/")).toBe(true);
    }
  });

  test("missing fields default to empty strings with no undefined or null text", () => {
    const { doc } = createMockDoc();
    renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });

  test("renders with a Map-based responses object", () => {
    const responses = new Map([
      ["name", "Kavya Mishra"],
      ["rollNo", "2301CS08"],
      ["hostelName", "Hostel Block E"],
      ["dateOfLeaving", "2025-04-01T00:00:00.000Z"],
      ["reasonForLeaving", "Weekend trip to Patna city"],
      ["companion1Name", "Sneha Roy"],
      ["companion1RollNo", "2301CS19"],
    ]);
    const { doc } = createMockDoc();
    expect(() => renderSecurityCampusLeavePermissionForFemaleStudentsPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "Kavya Mishra")).toBe(true);
    expect(hasText(doc, "2301CS08")).toBe(true);
    expect(hasText(doc, "Hostel Block E")).toBe(true);
    expect(hasText(doc, "01 / 04 / 2025")).toBe(true);
    expect(hasText(doc, "Weekend trip to Patna city")).toBe(true);
    expect(hasText(doc, "Sneha Roy")).toBe(true);
    expect(hasText(doc, "2301CS19")).toBe(true);
  });
});

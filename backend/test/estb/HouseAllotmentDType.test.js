const { renderEstbHouseAllotmentDTypePdf } = require("../../src/forms/estb/renderEstbHouseAllotmentDTypePdf");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

describe("EstbHouseAllotmentDType", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderEstbHouseAllotmentDTypePdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderEstbHouseAllotmentDTypePdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission itself is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderEstbHouseAllotmentDTypePdf(doc, {})).not.toThrow();
  });

  test("renders title and institute header text", () => {
    const { doc } = createMockDoc();
    renderEstbHouseAllotmentDTypePdf(doc, { responses: {} });
    expect(hasText(doc, "FORM NO: HAC 02")).toBe(true);
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "ACKNOWLEDGMENT")).toBe(true);
    expect(hasText(doc, "The chairman HAC")).toBe(true);
  });

  test("renders every user-facing response field value", () => {
    const responses = {
      circularNo: "7/2025",
      name: "Aarav Kumar",
      employeeId: "EMP12345",
      designation: "Assistant Registrar",
      payMatrixLevel: "Level 10",
      deptSection: "Establishment Section",
      dateOfJoining: "2025-04-01T00:00:00.000Z",
      email: "aarav.kumar@iitp.ac.in",
      maritalStatus: "Married",
      bachelorAccommodation: "Yes",
      presentQuarterAddress: "Q-12, Staff Colony, IIT Patna",
      quarterPreferences: "1(2 BHK),2(1 BHK),3(Duplex)",
    };
    const { doc } = createMockDoc();
    renderEstbHouseAllotmentDTypePdf(doc, { responses });

    expect(hasText(doc, "7/2025")).toBe(true);
    expect(hasText(doc, "Aarav Kumar")).toBe(true);
    expect(hasText(doc, "EMP12345")).toBe(true);
    expect(hasText(doc, "Assistant Registrar")).toBe(true);
    expect(hasText(doc, "Level 10")).toBe(true);
    expect(hasText(doc, "Establishment Section")).toBe(true);
    expect(hasText(doc, "aarav.kumar@iitp.ac.in")).toBe(true);
    expect(hasText(doc, "Married")).toBe(true);
    expect(hasText(doc, "Yes")).toBe(true);
    expect(hasText(doc, "Q-12, Staff Colony, IIT Patna")).toBe(true);
  });

  test("formats date field as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderEstbHouseAllotmentDTypePdf(doc, {
      responses: { dateOfJoining: "2025-04-01T00:00:00.000Z" },
    });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("invalid and empty dates do not crash and render no date text", () => {
    const invalidCases = [
      { responses: {} },
      { responses: { dateOfJoining: "" } },
      { responses: { dateOfJoining: "not-a-date" } },
      { responses: { dateOfJoining: null } },
    ];
    for (const submission of invalidCases) {
      const { doc } = createMockDoc();
      expect(() => renderEstbHouseAllotmentDTypePdf(doc, submission)).not.toThrow();
      expect(hasText(doc, "NaN")).toBe(false);
    }
  });

  test("missing fields default to placeholders with no undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderEstbHouseAllotmentDTypePdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
    expect(hasText(doc, "Single/ Married")).toBe(true);
    expect(hasText(doc, "(Y/N)")).toBe(true);
  });

  test("renders quarter preference values inside the grid", () => {
    const { doc } = createMockDoc();
    renderEstbHouseAllotmentDTypePdf(doc, {
      responses: { quarterPreferences: "1(2 BHK),2(1 BHK),3(Duplex)" },
    });
    expect(hasText(doc, "2 BHK")).toBe(true);
    expect(hasText(doc, "1 BHK")).toBe(true);
    expect(hasText(doc, "Duplex")).toBe(true);
  });

  test("ignores malformed quarter preference entries", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderEstbHouseAllotmentDTypePdf(doc, {
        responses: { quarterPreferences: "garbage,without-pattern" },
      })
    ).not.toThrow();
    expect(getAllText(doc)).not.toContain("undefined");
  });

  test("renders with a Map-based responses object", () => {
    const responses = new Map([
      ["name", "Sneha Gupta"],
      ["employeeId", "EMP67890"],
      ["designation", "Junior Assistant"],
      ["dateOfJoining", "2025-04-01T00:00:00.000Z"],
      ["email", "sneha.gupta@iitp.ac.in"],
      ["maritalStatus", "Single"],
      ["presentQuarterAddress", "Room 4, Guest House"],
      ["quarterPreferences", "5(3 BHK)"],
    ]);
    const { doc } = createMockDoc();
    expect(() => renderEstbHouseAllotmentDTypePdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "Sneha Gupta")).toBe(true);
    expect(hasText(doc, "EMP67890")).toBe(true);
    expect(hasText(doc, "Junior Assistant")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "sneha.gupta@iitp.ac.in")).toBe(true);
    expect(hasText(doc, "Room 4, Guest House")).toBe(true);
    expect(hasText(doc, "3 BHK")).toBe(true);
  });
});

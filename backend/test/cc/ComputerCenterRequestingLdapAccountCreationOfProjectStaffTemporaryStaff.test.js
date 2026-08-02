const {
  renderComputerCenterRequestingLdapAccountPdf,
} = require("../../src/forms/cc/ComputerCenterRequestingLdapAccountCreationOfProjectStaffTemporaryStaff");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const allFields = {
  empIdProjectId: "EMP-2025-001",
  fullName: "Rahul Kumar Sharma",
  department: "Computer Science and Engineering",
  phoneMobileNo: "9876543210",
  personalEmailId: "rahul.kumar@example.com",
  address: "Hostel 5, IIT Patna, Bihta",
  iitpEmailId: "rahul.kumar@iitp.ac.in",
  validityLastDate: "2025-04-01T00:00:00.000Z",
  requestDate: "2025-04-01T00:00:00.000Z",
};

describe("renderComputerCenterRequestingLdapAccountPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterRequestingLdapAccountPdf(doc, { responses: {} })
    ).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterRequestingLdapAccountPdf(doc, { responses: undefined })
    ).not.toThrow();
  });

  test("renders without throwing when submission is empty", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterRequestingLdapAccountPdf(doc, {})
    ).not.toThrow();
  });

  test("renders static form headers and labels", () => {
    const { doc } = createMockDoc();
    renderComputerCenterRequestingLdapAccountPdf(doc, { responses: {} });
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "COMPUTER CENTRE")).toBe(true);
    expect(hasText(doc, "REQUEST / REQUISITION FORM")).toBe(true);
    expect(hasText(doc, "(For LDAP Account)")).toBe(true);
    expect(hasText(doc, "Personal Information (PLEASE FILL IN BLOCK LETTERS)")).toBe(true);
    expect(hasText(doc, "Emp. ID/Project ID")).toBe(true);
    expect(hasText(doc, "Full Name")).toBe(true);
    expect(hasText(doc, "Dept./Section/Centre")).toBe(true);
    expect(hasText(doc, "Phone/Mobile No.:")).toBe(true);
    expect(hasText(doc, "Personal Email-ID")).toBe(true);
    expect(hasText(doc, "Address:")).toBe(true);
    expect(hasText(doc, "IITP Email id (If any):")).toBe(true);
    expect(hasText(doc, "Validity date / Last Date for LDAP account")).toBe(true);
    expect(hasText(doc, "SIGNATURE")).toBe(true);
    expect(hasText(doc, "SIGNATURE OF FACULTY (IN-CHARGE)/ HOD")).toBe(true);
  });

  test("renders every user-facing response field with sample values", () => {
    const { doc } = createMockDoc();
    renderComputerCenterRequestingLdapAccountPdf(doc, { responses: allFields });
    const expectedValues = {
      ...allFields,
      validityLastDate: "01/04/2025",
      requestDate: "01/04/2025",
    };
    for (const value of Object.values(expectedValues)) {
      expect(hasText(doc, value)).toBe(true);
    }
  });

  test("formats date fields as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderComputerCenterRequestingLdapAccountPdf(doc, {
      responses: {
        validityLastDate: "2025-04-01T00:00:00.000Z",
        requestDate: "2025-04-01T00:00:00.000Z",
      },
    });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("invalid and empty dates do not crash", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterRequestingLdapAccountPdf(doc, {
        responses: {
          validityLastDate: "not-a-date",
          requestDate: "garbage",
        },
      })
    ).not.toThrow();
    const { doc: doc2 } = createMockDoc();
    expect(() =>
      renderComputerCenterRequestingLdapAccountPdf(doc2, {
        responses: { validityLastDate: "", requestDate: "" },
      })
    ).not.toThrow();
  });

  test("supports Map-based responses", () => {
    const { doc } = createMockDoc();
    const responses = new Map(Object.entries(allFields));
    expect(() =>
      renderComputerCenterRequestingLdapAccountPdf(doc, { responses })
    ).not.toThrow();
    expect(hasText(doc, "EMP-2025-001")).toBe(true);
    expect(hasText(doc, "Rahul Kumar Sharma")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "rahul.kumar@iitp.ac.in")).toBe(true);
  });

  test("missing fields default to empty string, never 'undefined'", () => {
    const { doc } = createMockDoc();
    renderComputerCenterRequestingLdapAccountPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
  });

  test("missing fields default to empty string for undefined responses", () => {
    const { doc } = createMockDoc();
    renderComputerCenterRequestingLdapAccountPdf(doc, { responses: undefined });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
  });
});

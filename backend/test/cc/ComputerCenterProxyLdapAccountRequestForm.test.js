const { renderComputerCenterProxyLdapAccountRequestPdf } = require("../../src/forms/cc/ComputerCenterProxyLdapAccountRequestForm");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const allFields = {
  studentName: "Rahul Sharma",
  studentRollNo: "2301CS01",
  instituteName: "Indian Institute of Technology Patna",
  email: "rahul.sharma@iitp.ac.in",
  mobileNo: "9876543210",
  department: "Computer Science and Engineering",
  phNo: "0612-3028000",
  address: "Hostel 5, IIT Patna, Bihta",
  proxyAccount: "Proxy account for MTech coursework submission",
  lastDayDate: "2025-04-01T00:00:00.000Z",
  guideName: "Prof. Alok Kumar",
  guideDesignation: "Associate Professor",
  guideDepartment: "Computer Science and Engineering",
  date: "2025-04-01T00:00:00.000Z",
  place: "Patna",
};

describe("renderComputerCenterProxyLdapAccountRequestPdf", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterProxyLdapAccountRequestPdf(doc, { responses: {} })
    ).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterProxyLdapAccountRequestPdf(doc, { responses: undefined })
    ).not.toThrow();
  });

  test("renders without throwing when submission is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterProxyLdapAccountRequestPdf(doc, {})).not.toThrow();
  });

  test("renders static form headers and labels", () => {
    const { doc } = createMockDoc();
    renderComputerCenterProxyLdapAccountRequestPdf(doc, { responses: {} });
    expect(hasText(doc, "Requisition Form for Trainee")).toBe(true);
    expect(hasText(doc, "Computer Center, IIT Patna")).toBe(true);
    expect(hasText(doc, "User Information:")).toBe(true);
    expect(hasText(doc, "Student Name:")).toBe(true);
    expect(hasText(doc, "Student Roll No.")).toBe(true);
    expect(hasText(doc, "Institute/Organization/College Name:")).toBe(true);
    expect(hasText(doc, "Email:")).toBe(true);
    expect(hasText(doc, "Mobile No:")).toBe(true);
    expect(hasText(doc, "Department:")).toBe(true);
    expect(hasText(doc, "Ph. No:")).toBe(true);
    expect(hasText(doc, "Address:")).toBe(true);
    expect(hasText(doc, "Requirements of Proxy Account:")).toBe(true);
    expect(hasText(doc, "Proxy Account")).toBe(true);
    expect(hasText(doc, "Last day date")).toBe(true);
    expect(hasText(doc, "Guide Information:")).toBe(true);
    expect(hasText(doc, "Guide Name")).toBe(true);
    expect(hasText(doc, "Designation")).toBe(true);
    expect(hasText(doc, "Department")).toBe(true);
    expect(hasText(doc, "Date:")).toBe(true);
    expect(hasText(doc, "Place:")).toBe(true);
    expect(hasText(doc, "Student Signature")).toBe(true);
    expect(hasText(doc, "Approved")).toBe(true);
    expect(hasText(doc, "(Guide Signature)")).toBe(true);
  });

  test("renders every user-facing response field with sample values", () => {
    const { doc } = createMockDoc();
    renderComputerCenterProxyLdapAccountRequestPdf(doc, { responses: allFields });
    for (const [key, value] of Object.entries(allFields)) {
      if (key === "lastDayDate" || key === "date") continue;
      expect(hasText(doc, value)).toBe(true);
    }
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("formats date fields as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderComputerCenterProxyLdapAccountRequestPdf(doc, {
      responses: {
        lastDayDate: "2025-04-01T00:00:00.000Z",
        date: "2025-04-01T00:00:00.000Z",
      },
    });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("invalid and empty dates do not crash", () => {
    const { doc } = createMockDoc();
    expect(() =>
      renderComputerCenterProxyLdapAccountRequestPdf(doc, {
        responses: { lastDayDate: "not-a-date", date: "garbage" },
      })
    ).not.toThrow();
    const { doc: doc2 } = createMockDoc();
    expect(() =>
      renderComputerCenterProxyLdapAccountRequestPdf(doc2, {
        responses: { lastDayDate: "", date: "" },
      })
    ).not.toThrow();
  });

  test("renders signature and office sections", () => {
    const { doc } = createMockDoc();
    renderComputerCenterProxyLdapAccountRequestPdf(doc, {
      responses: {
        guideName: "Prof. Alok Kumar",
        guideDesignation: "Associate Professor",
        guideDepartment: "Computer Science and Engineering",
        place: "Patna",
      },
    });
    expect(hasText(doc, "Student Signature")).toBe(true);
    expect(hasText(doc, "Approved")).toBe(true);
    expect(hasText(doc, "(Guide Signature)")).toBe(true);
    expect(hasText(doc, "Prof. Alok Kumar")).toBe(true);
    expect(hasText(doc, "Associate Professor")).toBe(true);
    expect(hasText(doc, "Computer Science and Engineering")).toBe(true);
    expect(hasText(doc, "Patna")).toBe(true);
  });

  test("supports Map-based responses", () => {
    const { doc } = createMockDoc();
    const responses = new Map(Object.entries(allFields));
    expect(() =>
      renderComputerCenterProxyLdapAccountRequestPdf(doc, { responses })
    ).not.toThrow();
    expect(hasText(doc, "Rahul Sharma")).toBe(true);
    expect(hasText(doc, "2301CS01")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "Prof. Alok Kumar")).toBe(true);
    expect(hasText(doc, "Patna")).toBe(true);
  });

  test("missing fields default to empty string, never 'undefined'", () => {
    const { doc } = createMockDoc();
    renderComputerCenterProxyLdapAccountRequestPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
  });

  test("missing fields default to empty string for undefined responses", () => {
    const { doc } = createMockDoc();
    renderComputerCenterProxyLdapAccountRequestPdf(doc, { responses: undefined });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
  });
});

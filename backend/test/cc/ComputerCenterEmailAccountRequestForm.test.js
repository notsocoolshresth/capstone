const { renderComputerCenterEmailAccountRequestPdf } = require("../../src/forms/cc/ComputerCenterEmailAccountRequestForm");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

describe("ComputerCenterEmailAccountRequestForm", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterEmailAccountRequestPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterEmailAccountRequestPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission itself is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterEmailAccountRequestPdf(doc, {})).not.toThrow();
  });

  test("renders title and institute header text", () => {
    const { doc } = createMockDoc();
    renderComputerCenterEmailAccountRequestPdf(doc, { responses: {} });
    expect(hasText(doc, "Resource Allocation/Requisition Form")).toBe(true);
    expect(hasText(doc, "Computer Center, IIT Patna")).toBe(true);
    expect(hasText(doc, "User Information: Faculty/Staff/Project Staff/Student (please tick)")).toBe(true);
    expect(hasText(doc, "Requirements of Email/Proxy Account:")).toBe(true);
    expect(hasText(doc, "For CC Office Use Only")).toBe(true);
  });

  test("renders every user-facing response field value", () => {
    const responses = {
      userType: "Student",
      date: "2025-04-01T00:00:00.000Z",
      empIdRollNoProjectId: "2101CS12",
      name: "Aarav Kumar",
      existingEmail: "aarav.old@iitp.ac.in",
      mobileNo: "9876543210",
      department: "Computer Science and Engineering",
      phNo: "0612-3028000",
      block: "Hostel Block D",
      floor: "3rd Floor",
      roomNo: "D-304",
      preferredEmailId: "aarav.kumar",
      emailDomain: "@iitp.ac.in",
      proxyAccount: "Yes",
      daysLimit: "30",
      signature: "Aarav Kumar (sign)",
      forwardingAuthorityName: "Prof. Ramesh Singh",
      forwardingAuthorityDesignation: "Head of Department",
      forwardingAuthoritySignature: "R. Singh (sign)",
      issueDate: "2025-04-10T00:00:00.000Z",
      issuerName: "CC Administrator",
      issuerSignature: "CC Admin (sign)",
    };
    const { doc } = createMockDoc();
    renderComputerCenterEmailAccountRequestPdf(doc, { responses });

    expect(hasText(doc, "2101CS12")).toBe(true);
    expect(hasText(doc, "Aarav Kumar")).toBe(true);
    expect(hasText(doc, "aarav.old@iitp.ac.in")).toBe(true);
    expect(hasText(doc, "9876543210")).toBe(true);
    expect(hasText(doc, "Computer Science and Engineering")).toBe(true);
    expect(hasText(doc, "0612-3028000")).toBe(true);
    expect(hasText(doc, "Hostel Block D")).toBe(true);
    expect(hasText(doc, "3rd Floor")).toBe(true);
    expect(hasText(doc, "D-304")).toBe(true);
    expect(hasText(doc, "aarav.kumar")).toBe(true);
    expect(hasText(doc, "Yes")).toBe(true);
    expect(hasText(doc, "30")).toBe(true);
    expect(hasText(doc, "Aarav Kumar (sign)")).toBe(true);
    expect(hasText(doc, "Prof. Ramesh Singh")).toBe(true);
    expect(hasText(doc, "Head of Department")).toBe(true);
    expect(hasText(doc, "R. Singh (sign)")).toBe(true);
    expect(hasText(doc, "CC Administrator")).toBe(true);
    expect(hasText(doc, "CC Admin (sign)")).toBe(true);
  });

  test("marks the checkbox for the matching user type", () => {
    const { doc } = createMockDoc();
    renderComputerCenterEmailAccountRequestPdf(doc, { responses: { userType: "Project Staff" } });
    expect(hasText(doc, "/")).toBe(true);
    expect(hasText(doc, "Project Staff")).toBe(true);

    const { doc: doc2 } = createMockDoc();
    renderComputerCenterEmailAccountRequestPdf(doc2, { responses: { userType: "Faculty" } });
    expect(hasText(doc2, "/")).toBe(true);
    expect(hasText(doc2, "Faculty")).toBe(true);
  });

  test("formats date fields as en-GB dd/mm/yyyy", () => {
    const { doc } = createMockDoc();
    renderComputerCenterEmailAccountRequestPdf(doc, {
      responses: {
        date: "2025-04-01T00:00:00.000Z",
        issueDate: "2025-04-01T00:00:00.000Z",
      },
    });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("invalid and empty dates do not crash and render no date text", () => {
    const invalidCases = [
      { responses: {} },
      { responses: { date: "", issueDate: "" } },
      { responses: { date: "not-a-date", issueDate: "not-a-date" } },
      { responses: { date: null, issueDate: null } },
    ];
    for (const submission of invalidCases) {
      const { doc } = createMockDoc();
      expect(() => renderComputerCenterEmailAccountRequestPdf(doc, submission)).not.toThrow();
      expect(hasText(doc, "NaN")).toBe(false);
    }
  });

  test("missing fields default to empty strings with no undefined text", () => {
    const { doc } = createMockDoc();
    renderComputerCenterEmailAccountRequestPdf(doc, { responses: {} });
    expect(getAllText(doc)).not.toContain("undefined");
  });

  test("renders with a Map-based responses object", () => {
    const responses = new Map([
      ["userType", "Staff"],
      ["date", "2025-04-01T00:00:00.000Z"],
      ["name", "Sneha Gupta"],
      ["mobileNo", "9123456780"],
      ["preferredEmailId", "sneha.gupta"],
      ["daysLimit", "15"],
      ["issueDate", "2025-04-02T00:00:00.000Z"],
    ]);
    const { doc } = createMockDoc();
    expect(() => renderComputerCenterEmailAccountRequestPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "Sneha Gupta")).toBe(true);
    expect(hasText(doc, "9123456780")).toBe(true);
    expect(hasText(doc, "sneha.gupta")).toBe(true);
    expect(hasText(doc, "15")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "02/04/2025")).toBe(true);
    expect(hasText(doc, "/")).toBe(true);
  });
});

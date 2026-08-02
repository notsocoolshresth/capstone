const { renderSecurityMessWorkersPdf } = require("../../src/forms/security/SecurityMessWorkers");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

const buildResponses = () => {
  const responses = {
    hostelName: "A",
    vendorName: "Sharma Caterers",
  };
  for (let i = 1; i <= 20; i++) {
    responses[`worker${i}Name`] = `Worker ${i} Name`;
    responses[`worker${i}Aadhar`] = `1111-2222-333${i}`;
  }
  return responses;
};

describe("SecurityMessWorkers", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityMessWorkersPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityMessWorkersPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission itself is empty", () => {
    const { doc } = createMockDoc();
    expect(() => renderSecurityMessWorkersPdf(doc, {})).not.toThrow();
  });

  test("renders title and section header text", () => {
    const { doc } = createMockDoc();
    renderSecurityMessWorkersPdf(doc, { responses: {} });
    expect(hasText(doc, "Indian Institute of Technology Patna")).toBe(true);
    expect(hasText(doc, "(Mess Worker Initial Entry Form)")).toBe(true);
    expect(hasText(doc, "To,")).toBe(true);
    expect(hasText(doc, "The Warden")).toBe(true);
    expect(hasText(doc, "IIT Patna")).toBe(true);
    expect(hasText(doc, "Subject: Request for Entry of Mess Vendor/Workers")).toBe(true);
    expect(hasText(doc, "Worker Details:")).toBe(true);
    expect(hasText(doc, "Name of Worker")).toBe(true);
    expect(hasText(doc, "Aadhar Number")).toBe(true);
    expect(hasText(doc, "Undertaking:")).toBe(true);
    expect(hasText(doc, "Recommendation by the Warden:")).toBe(true);
    expect(hasText(doc, "Hostel Office Stamp")).toBe(true);
    expect(hasText(doc, "Signature of Warden")).toBe(true);
  });

  test("renders every user-facing response field value", () => {
    const { doc } = createMockDoc();
    renderSecurityMessWorkersPdf(doc, { responses: buildResponses() });

    expect(hasText(doc, "A Hostel")).toBe(true);
    expect(hasText(doc, "Sharma Caterers")).toBe(true);
    for (let i = 1; i <= 20; i++) {
      expect(hasText(doc, `Worker ${i} Name`)).toBe(true);
      expect(hasText(doc, `1111-2222-333${i}`)).toBe(true);
    }
  });

  test("renders placeholders when hostel and vendor names are missing", () => {
    const { doc } = createMockDoc();
    renderSecurityMessWorkersPdf(doc, { responses: {} });
    expect(hasText(doc, "Hostel")).toBe(true);
    expect(hasText(doc, "Name: ")).toBe(true);
  });

  test("supports Map-based responses", () => {
    const responses = new Map([
      ["hostelName", "Map Hostel"],
      ["vendorName", "Map Caterers"],
      ["worker1Name", "Map Worker One"],
      ["worker1Aadhar", "9999-8888-7777"],
    ]);
    const { doc } = createMockDoc();
    renderSecurityMessWorkersPdf(doc, { responses });
    expect(hasText(doc, "Map Hostel Hostel")).toBe(true);
    expect(hasText(doc, "Map Caterers")).toBe(true);
    expect(hasText(doc, "Map Worker One")).toBe(true);
    expect(hasText(doc, "9999-8888-7777")).toBe(true);
  });

  test("missing fields never render as undefined, null, or NaN", () => {
    const { doc } = createMockDoc();
    renderSecurityMessWorkersPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });

  test("worker with a name but no aadhar renders without crash", () => {
    const { doc } = createMockDoc();
    renderSecurityMessWorkersPdf(doc, { responses: { worker1Name: "Name Only" } });
    expect(hasText(doc, "Name Only")).toBe(true);
  });
});

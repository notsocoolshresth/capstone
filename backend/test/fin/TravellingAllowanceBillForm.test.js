const {
  renderFinanceTravellingAllowanceBillPdf,
} = require("../../src/forms/fin/TravellingAllowanceBillForm");
const { createMockDoc, hasText, getAllText } = require("../_helpers/mockPdfDoc");

describe("TravellingAllowanceBillForm", () => {
  test("renders without throwing when responses is an empty object", () => {
    const { doc } = createMockDoc();
    expect(() => renderFinanceTravellingAllowanceBillPdf(doc, { responses: {} })).not.toThrow();
  });

  test("renders without throwing when responses is undefined", () => {
    const { doc } = createMockDoc();
    expect(() => renderFinanceTravellingAllowanceBillPdf(doc, { responses: undefined })).not.toThrow();
  });

  test("renders without throwing when submission has no responses property", () => {
    const { doc } = createMockDoc();
    expect(() => renderFinanceTravellingAllowanceBillPdf(doc, {})).not.toThrow();
  });

  test("renders the institute name and form title", () => {
    const { doc } = createMockDoc();
    renderFinanceTravellingAllowanceBillPdf(doc, { responses: {} });
    expect(hasText(doc, "INDIAN INSTITUTE OF TECHNOLOGY PATNA")).toBe(true);
    expect(hasText(doc, "TRAVELLING ALLOWANCE BILL")).toBe(true);
  });

  test("renders section headings", () => {
    const { doc } = createMockDoc();
    renderFinanceTravellingAllowanceBillPdf(doc, { responses: {} });
    expect(hasText(doc, "Claimant Details")).toBe(true);
    expect(hasText(doc, "1. Particulars of Journey")).toBe(true);
    expect(hasText(doc, "2. Particulars of Local Conveyance Used")).toBe(true);
    expect(hasText(doc, "3. Particulars of Other Expenses Incurred")).toBe(true);
    expect(hasText(doc, "4. Purpose of Journey")).toBe(true);
    expect(hasText(doc, "Declaration")).toBe(true);
    expect(hasText(doc, "For Office Use Only (Finance & Accounts)")).toBe(true);
  });

  test("renders all claimant and other expense response fields", () => {
    const { doc } = createMockDoc();
    const responses = {
      claimantName: "Dr. Anita Sharma",
      empNo: "EMP-2019-0042",
      designation: "Assistant Professor",
      accountHead: "T-101/General",
      departmentSection: "Department of Computer Science",
      bankAccountNo: "12345678901",
      gradePay: "7600",
      contactNo: "9876543210",
      ifsc: "SBIN0001234",
      purposeOfJourney: "Attended International Conference on AI, Hyderabad",
      totalAmountClaimed: "45000",
      registrationFee: "8000",
      hotelLodgingCharges: "12000",
      visaFee: "2500",
      foodCharges: "6000",
      insurancePremium: "1500",
      otherCharges: "2000",
      advanceTaken: "10000",
      officeNetAmountClaimed: "35000",
      officeRailFare: "12000",
      officeRoadMileage: "4500",
      officeLocalConveyance: "3000",
      officeFoodCharges: "6000",
      officeAccommodationCharges: "12000",
      officeOtherCharges: "2000",
      officeTotalAdmissibleAmount: "39500",
      lessAdvanceDta: "5000",
      lessAdvanceClaimant: "5000",
      netAmountWords: "Thirty Five Thousand Rupees Only",
      treatedAsGuest: "No",
      freeBoardingLodging: "Yes",
      availedFreeTransport: "No",
    };
    renderFinanceTravellingAllowanceBillPdf(doc, { responses });
    Object.values(responses).forEach((value) => {
      expect(hasText(doc, value)).toBe(true);
    });
  });

  test("renders journey rows with formatted dates", () => {
    const { doc } = createMockDoc();
    const responses = {
      journeys: [
        {
          departureStation: "Patna Junction",
          departureDate: "2025-04-01T00:00:00.000Z",
          departureTime: "09:30",
          arrivalStation: "Secunderabad",
          arrivalDate: "2025-04-02T00:00:00.000Z",
          arrivalTime: "18:45",
          modeOfJourney: "Train",
          fare: "2500",
          distanceTravelled: "1500",
          ticketNosRemarks: "Ticket No. 12345",
        },
      ],
    };
    renderFinanceTravellingAllowanceBillPdf(doc, { responses });
    expect(hasText(doc, "Patna Junction")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "Secunderabad")).toBe(true);
    expect(hasText(doc, "02/04/2025")).toBe(true);
    expect(hasText(doc, "09:30")).toBe(true);
    expect(hasText(doc, "18:45")).toBe(true);
    expect(hasText(doc, "Train")).toBe(true);
    expect(hasText(doc, "2500")).toBe(true);
    expect(hasText(doc, "1500")).toBe(true);
    expect(hasText(doc, "Ticket No. 12345")).toBe(true);
  });

  test("renders local conveyance rows with formatted dates", () => {
    const { doc } = createMockDoc();
    const responses = {
      localConveyances: [
        {
          dateFrom: "2025-04-02T00:00:00.000Z",
          dateTo: "2025-04-05T00:00:00.000Z",
          modeOfJourney: "Taxi",
          fare: "1500",
          voucherAttached: "Yes",
          remarks: "City travel",
        },
      ],
    };
    renderFinanceTravellingAllowanceBillPdf(doc, { responses });
    expect(hasText(doc, "02/04/2025")).toBe(true);
    expect(hasText(doc, "05/04/2025")).toBe(true);
    expect(hasText(doc, "Taxi")).toBe(true);
    expect(hasText(doc, "1500")).toBe(true);
    expect(hasText(doc, "Yes")).toBe(true);
    expect(hasText(doc, "City travel")).toBe(true);
  });

  test("formats claimDate in en-GB format", () => {
    const { doc } = createMockDoc();
    renderFinanceTravellingAllowanceBillPdf(doc, { responses: { claimDate: "2025-04-01T00:00:00.000Z" } });
    expect(hasText(doc, "01/04/2025")).toBe(true);
  });

  test("does not crash with invalid or empty date values", () => {
    const { doc } = createMockDoc();
    const responses = {
      claimDate: "not-a-date",
      journeys: [
        {
          departureStation: "Patna",
          departureDate: "",
          arrivalStation: "Delhi",
          arrivalDate: "garbage",
        },
      ],
      localConveyances: [
        {
          dateFrom: null,
          dateTo: "also-invalid",
          modeOfJourney: "Bus",
        },
      ],
    };
    expect(() => renderFinanceTravellingAllowanceBillPdf(doc, { responses })).not.toThrow();
    expect(hasText(doc, "Patna")).toBe(true);
    expect(hasText(doc, "Delhi")).toBe(true);
    expect(hasText(doc, "Bus")).toBe(true);
  });

  test("missing fields default to empty strings without undefined/null/NaN text", () => {
    const { doc } = createMockDoc();
    renderFinanceTravellingAllowanceBillPdf(doc, { responses: {} });
    const allText = getAllText(doc);
    expect(allText).not.toContain("undefined");
    expect(allText).not.toContain("null");
    expect(allText).not.toContain("NaN");
  });

  test("supports Map-based responses", () => {
    const { doc } = createMockDoc();
    const responses = new Map([
      ["claimantName", "Mr. Rajesh Kumar"],
      ["empNo", "EMP-2021-0099"],
      ["designation", "Junior Research Fellow"],
      ["totalAmountClaimed", "22000"],
      ["claimDate", "2025-06-15T00:00:00.000Z"],
    ]);
    renderFinanceTravellingAllowanceBillPdf(doc, { responses });
    expect(hasText(doc, "Mr. Rajesh Kumar")).toBe(true);
    expect(hasText(doc, "EMP-2021-0099")).toBe(true);
    expect(hasText(doc, "Junior Research Fellow")).toBe(true);
    expect(hasText(doc, "22000")).toBe(true);
    expect(hasText(doc, "15/06/2025")).toBe(true);
  });

  test("renders signature block labels", () => {
    const { doc } = createMockDoc();
    renderFinanceTravellingAllowanceBillPdf(doc, { responses: {} });
    expect(hasText(doc, "Signature of the Claimant")).toBe(true);
    expect(hasText(doc, "A.O. / A.R. (F&A)")).toBe(true);
    expect(hasText(doc, "REGISTRAR")).toBe(true);
  });

  test("filters out empty journey and conveyance entries", () => {
    const { doc } = createMockDoc();
    const responses = {
      journeys: [
        { departureStation: "", departureDate: "", arrivalStation: "" },
        { departureStation: "Patna", departureDate: "2025-04-01T00:00:00.000Z", arrivalStation: "Delhi" },
      ],
      localConveyances: [{}, { modeOfJourney: "Bus", fare: "500" }],
    };
    renderFinanceTravellingAllowanceBillPdf(doc, { responses });
    expect(hasText(doc, "Patna")).toBe(true);
    expect(hasText(doc, "01/04/2025")).toBe(true);
    expect(hasText(doc, "Bus")).toBe(true);
    expect(hasText(doc, "500")).toBe(true);
  });
});

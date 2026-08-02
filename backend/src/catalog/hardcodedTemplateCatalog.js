const textField = (label, name, options = {}) => ({
  label,
  name,
  type: options.type || "text",
  required: Boolean(options.required),
  options: Array.isArray(options.options) ? options.options : [],
  section: options.section || "",
  placeholder: options.placeholder || "",
  helperText: options.helperText || "",
  minRows: Number.isInteger(options.minRows) ? options.minRows : 0,
  defaultRows: Number.isInteger(options.defaultRows) ? options.defaultRows : 0,
  columns: Array.isArray(options.columns) ? options.columns : [],
});

const tableColumn = (label, name, options = {}) => ({
  label,
  name,
  type: options.type || "text",
  required: Boolean(options.required),
  options: Array.isArray(options.options) ? options.options : [],
  width: options.width || "",
});

const tableField = (label, name, columns, options = {}) =>
  textField(label, name, {
    ...options,
    type: "table",
    columns,
    defaultRows: Number.isInteger(options.defaultRows) ? options.defaultRows : 1,
    minRows: Number.isInteger(options.minRows)
      ? options.minRows
      : Number.isInteger(options.defaultRows)
      ? options.defaultRows
      : 1,
  });

const yesNoOptions = ["Yes", "No"];
const paymentByOptions = ["Indentor", "Guest", "Institute", "Project Fund"];
const occupancyOptions = [
  "Single room",
  "Double room",
  "Double room with single occupancy",
  "Suite",
];
const vehicleJourneyOptions = ["Rail", "Ship", "Air", "Bus"];

const buildConferenceAssistanceTemplate = ({ code, title, description, section }) => ({
  code,
  title,
  description,
  section,
  approvalStages: [],
  fields: [
    textField("Name of the applicant", "applicantName", {
      required: true,
      section: "Applicant Details",
    }),
    textField("Emp. No. / Roll No.", "applicantId", {
      required: true,
      section: "Applicant Details",
    }),
    textField("Designation and Dept./Section/Centre", "designationDepartment", {
      required: true,
      section: "Applicant Details",
    }),
    textField(
      "Title of the Conference for which financial assistance is sought",
      "conferenceTitle",
      { required: true, section: "Conference Details" }
    ),
    textField("Nature of the Conference (International / National etc.)", "conferenceNature", {
      required: true,
      section: "Conference Details",
    }),
    textField("Venue", "conferenceVenue", {
      required: true,
      section: "Conference Details",
    }),
    textField("Country", "conferenceCountry", {
      section: "Conference Details",
    }),
    textField("Period From", "conferenceFromDate", {
      type: "date",
      section: "Conference Details",
    }),
    textField("Period To", "conferenceToDate", {
      type: "date",
      section: "Conference Details",
    }),
    textField("Name of the Organizer(s)", "conferenceOrganizers", {
      type: "textarea",
      minRows: 2,
      section: "Conference Details",
    }),
    textField("Nature of participation", "natureOfParticipation", {
      type: "select",
      options: ["Presenting a paper", "Poster", "Chairing a session", "Other"],
      section: "Conference Details",
    }),
    textField("If other, please specify", "natureOfParticipationOther", {
      section: "Conference Details",
    }),
    textField("Registration fee", "registrationFee", {
      section: "Estimate of Financial Assistance",
    }),
    textField("Travel", "travelEstimate", {
      section: "Estimate of Financial Assistance",
    }),
    textField("Daily Allowances", "dailyAllowance", {
      section: "Estimate of Financial Assistance",
    }),
    textField(
      "Other Fund requirements (Travel Support for Visa, Visa fee, Medical Insurance etc.)",
      "otherFundRequirements",
      {
        type: "textarea",
        minRows: 2,
        section: "Estimate of Financial Assistance",
      }
    ),
    textField("Amount needed from PDA", "pdaAmountRequested", {
      section: "Estimate of Financial Assistance",
    }),
    textField("Amount needed from Project", "projectAmountRequested", {
      section: "Estimate of Financial Assistance",
    }),
    textField("Amount needed from Other Sources", "otherSourcesAmountRequested", {
      section: "Estimate of Financial Assistance",
    }),
    textField("Conversion rate used", "conversionRateUsed", {
      section: "Estimate of Financial Assistance",
    }),
    tableField(
      "Details of the assistance sought/available from any other source(s), including project",
      "otherAssistanceRows",
      [
        tableColumn("Other Agency / Project", "agencyProject"),
        tableColumn("Project Code", "projectCode"),
        tableColumn("Granted Earlier", "grantedEarlier", { type: "select", options: yesNoOptions }),
        tableColumn("Fund Available", "fundAvailable"),
        tableColumn("Fund Required", "fundRequired"),
        tableColumn("Fund Recommended", "fundRecommended"),
        tableColumn("SRIRU Recommendation", "sriruRecommendation", {
          type: "select",
          options: yesNoOptions,
        }),
      ],
      {
        section: "Other Assistance",
        defaultRows: 1,
      }
    ),
    textField("Title and Venue of the Conference last attended abroad", "lastConferenceTitleVenue", {
      type: "textarea",
      minRows: 2,
      section: "Previous Assistance",
    }),
    textField("Last conference period from", "lastConferenceFromDate", {
      type: "date",
      section: "Previous Assistance",
    }),
    textField("Last conference period to", "lastConferenceToDate", {
      type: "date",
      section: "Previous Assistance",
    }),
    textField("Total amount received from PDA", "lastConferencePdaAmount", {
      section: "Previous Assistance",
    }),
    textField("Total amount received from Project", "lastConferenceProjectAmount", {
      section: "Previous Assistance",
    }),
    textField("Advance required", "advanceRequired", {
      type: "radio",
      options: yesNoOptions,
      section: "Advance and NOC",
    }),
    textField("Advance amount required from PDA", "advancePdaAmount", {
      section: "Advance and NOC",
    }),
    textField("Advance amount required from Project", "advanceProjectAmount", {
      section: "Advance and NOC",
    }),
    textField("Do you need NOC for VISA purposes", "nocForVisa", {
      type: "radio",
      options: yesNoOptions,
      section: "Advance and NOC",
    }),
    textField("Application and enclosures checked and found in order (Inland)", "inlandApplicationInOrder", {
      type: "radio",
      options: yesNoOptions,
      section: "Office Use - Inland",
    }),
    textField("Amount of fund available (Inland)", "inlandFundAvailable", {
      section: "Office Use - Inland",
    }),
    textField(
      "Date of Conference last attended inland with financial assistance",
      "inlandLastConferenceDate",
      {
        type: "date",
        section: "Office Use - Inland",
      }
    ),
    textField("Amount of assistance provided by the Institute", "inlandPreviousAssistanceAmount", {
      section: "Office Use - Inland",
    }),
    textField("Registration Fees granted", "inlandRegistrationFeesGranted", {
      section: "Office Use - Inland",
    }),
    textField("A/C Head", "inlandAccountHead", {
      section: "Office Use - Inland",
    }),
    textField("Travel Support granted", "inlandTravelSupportGranted", {
      section: "Office Use - Inland",
    }),
    textField("Dearness Allowance granted", "inlandDearnessAllowanceGranted", {
      section: "Office Use - Inland",
    }),
    textField("Any Other granted", "inlandAnyOtherGranted", {
      section: "Office Use - Inland",
    }),
    textField("Total granted", "inlandTotalGranted", {
      section: "Office Use - Inland",
    }),
    textField("Application and enclosures checked and found in order (Abroad)", "abroadApplicationInOrder", {
      type: "radio",
      options: yesNoOptions,
      section: "Office Use - Abroad",
    }),
    tableField(
      "Last three conferences attended abroad",
      "lastThreeConferences",
      [
        tableColumn("Period", "period"),
        tableColumn("Venue and Country", "venueCountry"),
        tableColumn("Financial Assistance", "financialAssistance"),
      ],
      {
        section: "Office Use - Abroad",
        defaultRows: 1,
      }
    ),
    textField("Fund available as on", "abroadFundAvailableAsOn", {
      type: "date",
      section: "Office Use - Abroad",
    }),
    textField("Fund available amount", "abroadFundAvailableAmount", {
      section: "Office Use - Abroad",
    }),
    textField("A/C Head (Abroad)", "abroadAccountHead", {
      section: "Office Use - Abroad",
    }),
    textField("Registration Fees recommended", "dofaRegistrationFees", {
      section: "Office Use - Recommendation",
    }),
    textField("Travel Support recommended", "dofaTravelSupport", {
      section: "Office Use - Recommendation",
    }),
    textField("Dearness Allowance recommended", "dofaDearnessAllowance", {
      section: "Office Use - Recommendation",
    }),
    textField("Any other recommended", "dofaAnyOtherRequired", {
      type: "radio",
      options: yesNoOptions,
      section: "Office Use - Recommendation",
    }),
    textField("Any other amount", "dofaAnyOtherAmount", {
      section: "Office Use - Recommendation",
    }),
    textField("Total recommended", "dofaTotalRecommended", {
      section: "Office Use - Recommendation",
    }),
    textField("Undertaking block year", "undertakingBlockYear", {
      section: "Undertaking",
    }),
    textField("Undertaking signature date", "undertakingDate", {
      type: "date",
      section: "Undertaking",
    }),
  ],
});

const buildNetworkExtensionTemplate = ({ code, title, description }) => ({
  code,
  title,
  description,
  section: "cc",
  approvalStages: [],
  fields: [
    textField("Request No.", "requestNo", { section: "Requester Details" }),
    textField("Name", "requesterName", { required: true, section: "Requester Details" }),
    textField("Emp Id", "empId", { required: true, section: "Requester Details" }),
    textField("Email", "email", { type: "email", required: true, section: "Requester Details" }),
    textField("Department", "department", { required: true, section: "Requester Details" }),
    textField("Office Extension no.", "officeExtensionNo", { section: "Requester Details" }),
    textField("Mobile No.", "mobileNo", { section: "Requester Details" }),
    textField("Requirement details along with location", "requirementDetails", {
      type: "textarea",
      minRows: 2,
      required: true,
      section: "Requirement Details",
    }),
    textField("No. of LAN port needed", "lanPortCount", {
      type: "number",
      required: true,
      section: "Requirement Details",
    }),
    textField("Block", "block", { required: true, section: "Requirement Details" }),
    textField("Floor", "floor", { required: true, section: "Requirement Details" }),
    textField("Room No.", "roomNo", { required: true, section: "Requirement Details" }),
    textField("Any specific remarks", "specificRemarks", {
      type: "textarea",
      minRows: 2,
      section: "Requirement Details",
    }),
    textField("Head, Department/Unit Name", "departmentHeadName", {
      section: "Approvals",
    }),
    textField("Head, Department/Unit Date", "departmentHeadDate", {
      type: "date",
      section: "Approvals",
    }),
    textField("Head, Computer Centre Name", "computerCentreHeadName", {
      section: "Approvals",
    }),
    textField("Head, Computer Centre Date", "computerCentreHeadDate", {
      type: "date",
      section: "Approvals",
    }),
    textField("Items issued by CC", "itemsIssuedByCc", {
      type: "textarea",
      minRows: 2,
      section: "Computer Center Office Use",
    }),
    textField("Issuer Name", "issuerName", { section: "Computer Center Office Use" }),
    textField("Issuer Date", "issuerDate", {
      type: "date",
      section: "Computer Center Office Use",
    }),
    textField("Receiver Name", "receiverName", { section: "Computer Center Office Use" }),
    textField("Receiver Date", "receiverDate", {
      type: "date",
      section: "Computer Center Office Use",
    }),
    tableField(
      "Detailed Estimate Items (Charges to be borne by provider)",
      "detailedEstimateItems",
      [
        tableColumn("Item name", "itemName"),
        tableColumn("QTY", "quantity", { type: "number" }),
        tableColumn("Unit", "unit"),
        tableColumn("Rate (Rs)", "rate"),
        tableColumn("Total (Rs)", "total"),
        tableColumn("Provider", "provider"),
      ],
      {
        section: "Detailed Estimate",
        defaultRows: 1,
      }
    ),
    tableField(
      "Labor Estimate Labour (Charges to be borne by provider)",
      "laborEstimateRows",
      [
        tableColumn("Work desc", "workDescription"),
        tableColumn("QTY", "quantity", { type: "number" }),
        tableColumn("Unit", "unit"),
        tableColumn("Rate (Rs)", "rate"),
        tableColumn("Total (Rs)", "total"),
        tableColumn("Provider", "provider"),
      ],
      {
        section: "Detailed Estimate",
        defaultRows: 1,
      }
    ),
    textField("CC Representative Name", "ccRepresentativeName", {
      section: "Detailed Estimate",
    }),
    textField("CC Representative Date", "ccRepresentativeDate", {
      type: "date",
      section: "Detailed Estimate",
    }),
    textField("Departmental/Unit Representative Name", "departmentRepresentativeName", {
      section: "Detailed Estimate",
    }),
    textField("Departmental/Unit Representative Date", "departmentRepresentativeDate", {
      type: "date",
      section: "Detailed Estimate",
    }),
    tableField(
      "IO details",
      "ioDetails",
      [
        tableColumn("Source (Access switch ID and port)", "source"),
        tableColumn("Destination (Assigned Port number)", "destination"),
        tableColumn("Distance (in meters)", "distanceInMeters"),
      ],
      {
        section: "Computer Center Office Use - IO Details",
        defaultRows: 1,
      }
    ),
    textField("Design layout diagram", "designLayoutDiagram", {
      type: "textarea",
      minRows: 3,
      section: "Computer Center Office Use - IO Details",
    }),
  ],
});

const buildLtcApplicationTemplate = ({ code, title, description, isTeaching }) => ({
  code,
  title,
  description,
  section: "estb",
  approvalStages: [],
  fields: [
    textField("Block Year", "blockYear", { required: true, section: "Form A - Travel Advance" }),
    textField("Name", "employeeName", { required: true, section: "Form A - Travel Advance" }),
    textField("Emp. Code", "employeeCode", { required: true, section: "Form A - Travel Advance" }),
    textField("Designation", "designation", { required: true, section: "Form A - Travel Advance" }),
    textField("Department/Centre/School/Section", "departmentSection", {
      required: true,
      section: "Form A - Travel Advance",
    }),
    textField("Basic Pay", "basicPay", { section: "Form A - Travel Advance" }),
    textField("Place of visit", "placeOfVisit", {
      required: true,
      section: "Form A - Travel Advance",
    }),
    textField("Period of Leave", "periodOfLeave", {
      required: true,
      section: "Form A - Travel Advance",
    }),
    textField("Nearest Railway Station / Air Port", "nearestStationOrAirport", {
      section: "Form A - Travel Advance",
    }),
    textField("Date of commencement (Outward) of journey", "outwardJourneyDate", {
      type: "date",
      section: "Form A - Travel Advance",
    }),
    textField("Proposed date of return (Inward) journey", "returnJourneyDate", {
      type: "date",
      section: "Form A - Travel Advance",
    }),
    textField("Proposed mode of journey", "proposedModeOfJourney", {
      type: "select",
      options: vehicleJourneyOptions,
      section: "Form A - Travel Advance",
    }),
    textField("Class of accommodation entitled to Railways", "railwayAccommodationClass", {
      section: "Form A - Travel Advance",
    }),
    textField("Single one-way fare by the entitled class of journey", "singleOneWayFare", {
      section: "Form A - Travel Advance",
    }),
    tableField(
      "Details of family members to accompany (including self)",
      "travelFamilyMembers",
      [
        tableColumn("Name", "name"),
        tableColumn("Complete Age", "age"),
        tableColumn("Relationship", "relationship"),
      ],
      {
        section: "Form A - Travel Advance",
        defaultRows: 1,
      }
    ),
    textField("Leave / Vacation from", "leaveVacationFrom", {
      type: "date",
      section: "Leave Encashment",
    }),
    textField("Leave / Vacation to", "leaveVacationTo", {
      type: "date",
      section: "Leave Encashment",
    }),
    textField("Apply to avail leave encashment", "leaveEncashmentRequested", {
      type: "radio",
      options: yesNoOptions,
      section: "Leave Encashment",
    }),
    textField("Applicant signature date", "applicantSignatureDate", {
      type: "date",
      section: "Leave Encashment",
    }),
    textField("Administration certified block year", "adminPermissibleBlockYear", {
      section: "Administration Section",
    }),
    textField("Total leave encashment after this LTC (days)", "adminTotalLeaveEncashmentDays", {
      section: "Administration Section",
    }),
    textField("Advance of travel cost sanctioned", "accountsAdvanceTravelCost", {
      section: "Accounts Section",
    }),
    textField("Advance of travel cost in words", "accountsAdvanceTravelCostWords", {
      type: "textarea",
      minRows: 2,
      section: "Accounts Section",
    }),
    textField("Earned Leave Encashment for days", "accountsEarnedLeaveEncashmentDays", {
      section: "Accounts Section",
    }),
    textField("Earned Leave Encashment amount", "accountsEarnedLeaveEncashmentAmount", {
      section: "Accounts Section",
    }),
    textField("Earned Leave Encashment in words", "accountsEarnedLeaveEncashmentWords", {
      type: "textarea",
      minRows: 2,
      section: "Accounts Section",
    }),
    textField("Number of adults travelling", "declarationAdultCount", {
      type: "number",
      section: "Form B - Employee Declaration",
    }),
    textField("Number of minors travelling", "declarationMinorCount", {
      type: "number",
      section: "Form B - Employee Declaration",
    }),
    tableField(
      "Family members covered under the definition of Family as prescribed under LTC Rules",
      "declaredFamilyMembers",
      [
        tableColumn("Name(s) of the Family members", "name"),
        tableColumn("Complete Age", "age"),
        tableColumn("Relationship", "relationship"),
      ],
      {
        section: "Form B - Employee Declaration",
        defaultRows: 1,
      }
    ),
    textField("Spouse / family member employer details, if employed", "spouseEmployerDetails", {
      type: "textarea",
      minRows: 2,
      section: "Form B - Employee Declaration",
    }),
    textField("Station", "declarationStation", {
      section: "Form B - Employee Declaration",
    }),
    textField("Declaration Date", "declarationDate", {
      type: "date",
      section: "Form B - Employee Declaration",
    }),
    textField("Name in full (in Block letters)", "declarationEmployeeName", {
      section: "Form B - Employee Declaration",
    }),
    textField("Emp. Code (Declaration)", "declarationEmployeeCode", {
      section: "Form B - Employee Declaration",
    }),
    textField("Designation (Declaration)", "declarationDesignation", {
      section: "Form B - Employee Declaration",
    }),
    textField("Department/Centre/School/Section (Declaration)", "declarationDepartmentSection", {
      section: "Form B - Employee Declaration",
    }),
    textField(
      isTeaching ? "Dean (Faculty Affairs) remarks / date" : "HOD/HOC/HOS remarks / date",
      "approvalRemarks",
      {
        section: "Approvals",
      }
    ),
  ],
});

const buildProcurementTemplate = ({
  code,
  title,
  description,
  section = "snp",
  currency = "INR",
  isDoubleBid = false,
  isRateContract = false,
  isLocalPurchase = false,
}) => {
  const fields = [
    textField("Subject / Purchase Item", "subjectItem", {
      required: true,
      section: "Recommendation Details",
    }),
    textField("Date", "recommendationDate", {
      type: "date",
      section: "Recommendation Details",
    }),
    textField("Indent / Procurement description", "indentDescription", {
      type: "textarea",
      minRows: 2,
      section: "Recommendation Details",
    }),
    textField("Tender / NIQ No.", "tenderNo", {
      section: "Recommendation Details",
    }),
    textField("Tender / NIQ Date", "tenderDate", {
      type: "date",
      section: "Recommendation Details",
    }),
    textField("Responses received from vendors", "responseVendorCount", {
      type: "number",
      section: "Recommendation Details",
    }),
    textField(isDoubleBid ? "Price bid opening date" : "Quotation opening date", "quotationOpeningDate", {
      type: "date",
      section: "Recommendation Details",
    }),
    textField("Annexure / comparative chart reference", "annexureReference", {
      section: "Recommendation Details",
    }),
    textField("File No.", "fileNo", {
      section: "Procurement Summary",
    }),
    textField("Year of Sanction", "yearOfSanction", {
      section: "Procurement Summary",
    }),
    textField("Department", "department", {
      required: true,
      section: "Procurement Summary",
    }),
    textField("Category", "category", {
      section: "Procurement Summary",
    }),
    textField("Vendor Code", "vendorCode", {
      section: "Vendor Details",
    }),
    textField("Vendor Name", "vendorName", {
      required: true,
      section: "Vendor Details",
    }),
  ];

  if (currency !== "INR") {
    fields.push(
      textField("Indian Agent", "indianAgentName", {
        section: "Vendor Details",
      })
    );
  }

  fields.push(
    tableField(
      "Recommended line items",
      "recommendedItems",
      [
        tableColumn("Item description (with product code, if any)", "itemDescription"),
        tableColumn(
          currency === "INR" ? "Rate" : "Rate (in currency)",
          "rate"
        ),
        tableColumn("Quantity", "quantity", { type: "number" }),
        tableColumn(
          currency === "INR" ? "Amount" : "Amount (in currency)",
          "amount"
        ),
      ],
      {
        section: "Recommended Items",
        defaultRows: 1,
      }
    )
  );

  if (currency !== "INR") {
    fields.push(
      textField("Total Ex works", "totalExWorks", {
        section: "Financial Summary",
      }),
      textField("Packing / Forwarding / Airfreight / Insurance Charges", "packingForwardingCharges", {
        section: "Financial Summary",
      }),
      textField("Total FOB/FCA/CIP/CIF/DDP/DTP", "totalFobOrCif", {
        section: "Financial Summary",
      }),
      textField("Miscellaneous Charges", "miscellaneousCharges", {
        section: "Financial Summary",
      }),
      textField("Total Amount", "totalAmount", {
        section: "Financial Summary",
      }),
      textField("Total in INR", "totalInInr", {
        section: "Financial Summary",
      }),
      textField("GST", "gstAmount", {
        section: "Financial Summary",
      }),
      textField("Grand Total in INR", "grandTotalInInr", {
        section: "Financial Summary",
      })
    );
  } else {
    fields.push(
      textField("GST percentage", "gstPercentage", {
        section: "Financial Summary",
      }),
      textField("GST amount", "gstAmount", {
        section: "Financial Summary",
      }),
      textField("Total Amount", "totalAmount", {
        section: "Financial Summary",
      })
    );
  }

  if (isLocalPurchase || isRateContract) {
    fields.push(
      tableField(
        "Vendor comparison",
        "vendorComparisonRows",
        [
          tableColumn("Item", "item"),
          tableColumn("V1", "v1"),
          tableColumn("V2", "v2"),
          tableColumn("V3", "v3"),
          tableColumn("Lowest Quoting Vendor", "lowestQuotingVendor"),
        ],
        {
          section: "Vendor Comparison",
          defaultRows: 1,
        }
      )
    );
  }

  if (isRateContract) {
    fields.push(
      textField("Rate contract comparison summary", "rateContractSummary", {
        type: "textarea",
        minRows: 2,
        section: "Vendor Comparison",
      })
    );
  }

  return {
    code,
    title,
    description,
    section,
    approvalStages: [],
    fields,
  };
};

const MISSING_HARDCODED_TEMPLATES = [
  buildNetworkExtensionTemplate({
    code: "cc-network-extension-requisition",
    title: "Network Extension Requisition Form",
    description:
      "Computer Centre requisition form for network extension work, estimates, and IO details.",
  }),
  buildNetworkExtensionTemplate({
    code: "cc-installation-of-new-lan-ports",
    title: "Request Form for Installation of New LAN Ports",
    description:
      "Computer Centre requisition form for installation of new LAN ports, including estimates and IO details.",
  }),
  buildLtcApplicationTemplate({
    code: "estb-ltc-application-non-teaching",
    title: "LTC Application Form - Non-Teaching Staff",
    description:
      "Form A and Form B for advance of travel cost under LTC rules for non-teaching staff.",
    isTeaching: false,
  }),
  buildLtcApplicationTemplate({
    code: "estb-ltc-application-teaching",
    title: "LTC Application Form - Teaching Staff",
    description:
      "Form A and Form B for advance of travel cost under LTC rules for teaching staff.",
    isTeaching: true,
  }),
  {
    code: "estb-ltc-final-claim",
    title: "LTC Final Claim Form",
    description:
      "Final LTC claim form covering journey details, family members, advance adjustment, and certification.",
    section: "estb",
    approvalStages: [],
    fields: [
      textField("Block Year", "blockYear", { required: true, section: "Claimant Details" }),
      textField("Name", "employeeName", { required: true, section: "Claimant Details" }),
      textField("Emp. Code", "employeeCode", { required: true, section: "Claimant Details" }),
      textField("Designation", "designation", { required: true, section: "Claimant Details" }),
      textField("Department/Centre/School/Section", "departmentSection", {
        required: true,
        section: "Claimant Details",
      }),
      textField("Basic Pay", "basicPay", { section: "Claimant Details" }),
      textField("Home Town / All India LTC", "ltcType", { section: "Claimant Details" }),
      textField("Place(s) visited", "placesVisited", {
        type: "textarea",
        minRows: 2,
        section: "Journey Details",
      }),
      textField("Period of Leave", "periodOfLeave", { section: "Journey Details" }),
      textField("Date of commencement (Outward) of journey", "outwardJourneyDate", {
        type: "date",
        section: "Journey Details",
      }),
      textField("Date of completion (Return) of journey", "returnJourneyDate", {
        type: "date",
        section: "Journey Details",
      }),
      textField("Mode of journey", "modeOfJourney", {
        type: "select",
        options: vehicleJourneyOptions,
        section: "Journey Details",
      }),
      textField("Class of accommodation entitled / availed", "accommodationClass", {
        section: "Journey Details",
      }),
      tableField(
        "Family members for whom LTC is claimed",
        "familyMembers",
        [
          tableColumn("Name", "name"),
          tableColumn("Age", "age"),
          tableColumn("Relationship", "relationship"),
        ],
        {
          section: "Family Members",
          defaultRows: 1,
        }
      ),
      tableField(
        "Journey / fare details",
        "journeyFareRows",
        [
          tableColumn("From", "fromStation"),
          tableColumn("To", "toStation"),
          tableColumn("Date", "journeyDate", { type: "date" }),
          tableColumn("Mode", "mode"),
          tableColumn("Class", "travelClass"),
          tableColumn("Fare", "fare"),
          tableColumn("Remarks", "remarks"),
        ],
        {
          section: "Journey / Fare Claim",
          defaultRows: 1,
        }
      ),
      textField("Total fare claimed", "totalFareClaimed", {
        section: "Journey / Fare Claim",
      }),
      textField("Advance drawn earlier", "advanceDrawn", {
        section: "Advance Adjustment",
      }),
      textField("Net amount claimed / refunded", "netAmountClaimed", {
        section: "Advance Adjustment",
      }),
      textField("Leave encashment days claimed", "leaveEncashmentDays", {
        section: "Advance Adjustment",
      }),
      textField("Leave encashment amount", "leaveEncashmentAmount", {
        section: "Advance Adjustment",
      }),
      textField("Claim remarks", "claimRemarks", {
        type: "textarea",
        minRows: 2,
        section: "Advance Adjustment",
      }),
      textField("Station", "declarationStation", { section: "Declaration" }),
      textField("Declaration Date", "declarationDate", {
        type: "date",
        section: "Declaration",
      }),
      textField("Name of employee", "declarationName", { section: "Declaration" }),
      textField("Administration remarks", "administrationRemarks", {
        type: "textarea",
        minRows: 2,
        section: "Office Use",
      }),
      textField("Accounts remarks", "accountsRemarks", {
        type: "textarea",
        minRows: 2,
        section: "Office Use",
      }),
      textField("Sanctioned amount", "sanctionedAmount", {
        section: "Office Use",
      }),
      textField("Sanctioned amount in words", "sanctionedAmountWords", {
        type: "textarea",
        minRows: 2,
        section: "Office Use",
      }),
    ],
  },
  buildConferenceAssistanceTemplate({
    code: "faculty-conference-assistance",
    title: "Application for Permission and Financial Assistance for Attending Conference",
    description:
      "Faculty Affairs form for permission and financial assistance for attending a conference.",
    section: "fac",
  }),
  {
    code: "finance-contingency-grant",
    title: "Contingency Grant",
    description:
      "Finance and Accounts reimbursement form for purchase of books, stationery, photocopying, and annual membership fee.",
    section: "fin",
    approvalStages: [],
    fields: [
      textField("Name of the Applicant", "applicantName", {
        required: true,
        section: "Applicant Details",
      }),
      textField("Designation", "designation", {
        required: true,
        section: "Applicant Details",
      }),
      textField("Department", "department", {
        required: true,
        section: "Applicant Details",
      }),
      textField("Claims made for the period - From", "claimPeriodFrom", {
        type: "date",
        section: "Applicant Details",
      }),
      textField("Claims made for the period - To", "claimPeriodTo", {
        type: "date",
        section: "Applicant Details",
      }),
      tableField(
        "Claims made for reimbursement of",
        "reimbursementRows",
        [
          tableColumn("Particulars", "particulars"),
          tableColumn("Total Amount Spent (In Rupees)", "amountSpent"),
          tableColumn("Remarks, if any", "remarks"),
        ],
        {
          section: "Reimbursement Summary",
          defaultRows: 2,
        }
      ),
      textField("Date", "applicantDate", {
        type: "date",
        section: "Declaration",
      }),
      textField("Emp. No.", "employeeNo", {
        section: "Declaration",
      }),
      tableField(
        "Purchase Details of Books, Stationeries, etc and Photocopying expenses, etc.",
        "purchaseDetails",
        [
          tableColumn("Voucher/Bill Number", "voucherNumber"),
          tableColumn("Voucher/Bill Date", "voucherDate", { type: "date" }),
          tableColumn("Details of Item(s)", "itemDetails"),
          tableColumn("Bill Amount (In Rupees)", "billAmount"),
        ],
        {
          section: "Reverse Side Details",
          defaultRows: 1,
        }
      ),
      tableField(
        "Membership Fee",
        "membershipFeeRows",
        [
          tableColumn("Receipt Number", "receiptNumber"),
          tableColumn("Date", "date", { type: "date" }),
          tableColumn("Name of the Body / Society", "bodyName"),
          tableColumn("Membership Fee (In Rupees)", "membershipFee"),
        ],
        {
          section: "Reverse Side Details",
          defaultRows: 1,
        }
      ),
      textField("Number of vouchers / bills enclosed in original", "voucherCount", {
        section: "Reverse Side Details",
      }),
      textField("Entitled amount sanctioned", "sanctionedAmount", {
        section: "Office Use",
      }),
      textField("Total amount claimed for reimbursement", "officeTotalClaimed", {
        section: "Office Use",
      }),
      textField("Total amount admissible", "officeTotalAdmissible", {
        section: "Office Use",
      }),
      textField("Passed and pay amount", "officePassedAndPayAmount", {
        section: "Office Use",
      }),
      textField("Passed and pay amount in words", "officePassedAndPayAmountWords", {
        type: "textarea",
        minRows: 2,
        section: "Office Use",
      }),
      textField("Cheque No.", "officeChequeNo", {
        section: "Office Use",
      }),
      textField("Cheque Date", "officeChequeDate", {
        type: "date",
        section: "Office Use",
      }),
      textField("Bank Savings Account No.", "officeBankAccountNo", {
        section: "Office Use",
      }),
    ],
  },
  {
    code: "finance-children-education-allowance-school-certificate",
    title: "Certificate from the Head of Institution / School",
    description:
      "Certificate for reimbursement of Children Education Allowance from the head of institution or school.",
    section: "fin",
    approvalStages: [],
    fields: [
      textField("Ref. No.", "referenceNo", { section: "School Certification" }),
      textField("Date", "certificateDate", { type: "date", section: "School Certification" }),
      textField("Master / Kumari", "childName", {
        required: true,
        section: "School Certification",
      }),
      textField("Admission No.", "admissionNo", { section: "School Certification" }),
      textField("D.O.B", "dateOfBirth", { type: "date", section: "School Certification" }),
      textField("Son / Daughter of Mr. / Mrs.", "parentName", {
        required: true,
        section: "School Certification",
      }),
      textField("Class", "studentClass", { section: "School Certification" }),
      textField("Section", "studentSection", { section: "School Certification" }),
      textField("Roll No.", "studentRollNo", { section: "School Certification" }),
      textField("Academic year from", "academicYearFrom", {
        type: "date",
        section: "School Certification",
      }),
      textField("Academic year to", "academicYearTo", {
        type: "date",
        section: "School Certification",
      }),
      textField("Name of school / institution", "schoolName", {
        required: true,
        section: "School Certification",
      }),
      textField("Affiliation Regd. No. / Code", "affiliationRegNo", {
        section: "School Certification",
      }),
      textField("Board", "boardName", {
        section: "School Certification",
      }),
      textField("Place", "place", {
        section: "School Certification",
      }),
      textField("My spouse is a Central Government Servant", "spouseIsCentralGovtServant", {
        type: "radio",
        options: yesNoOptions,
        section: "Employee Declaration",
      }),
      textField("Spouse will not claim Children Education Allowance", "spouseWillNotClaim", {
        type: "radio",
        options: yesNoOptions,
        section: "Employee Declaration",
      }),
      textField("Spouse employer", "spouseEmployer", {
        section: "Employee Declaration",
      }),
      textField("Spouse is not entitled to Children Education Allowance", "spouseNotEntitled", {
        type: "radio",
        options: yesNoOptions,
        section: "Employee Declaration",
      }),
      textField("Signature Date", "employeeSignatureDate", {
        type: "date",
        section: "Employee Declaration",
      }),
      textField("Name", "employeeName", {
        section: "Employee Declaration",
      }),
      textField("Designation", "designation", {
        section: "Employee Declaration",
      }),
      textField("Emp. ID No.", "employeeIdNo", {
        section: "Employee Declaration",
      }),
      textField("Dept./Section/Office", "departmentSectionOffice", {
        section: "Employee Declaration",
      }),
    ],
  },
  {
    code: "finance-children-education-allowance-self-declaration",
    title: "Self-Declaration for Reimbursement of Children Education Allowance",
    description:
      "Self-declaration for reimbursement of Children Education Allowance with spouse eligibility declaration.",
    section: "fin",
    approvalStages: [],
    fields: [
      textField("Name", "employeeName", {
        required: true,
        section: "Self-Declaration",
      }),
      textField("Son / Daughter Name", "childName", {
        required: true,
        section: "Self-Declaration",
      }),
      textField("Class", "studentClass", {
        section: "Self-Declaration",
      }),
      textField("Roll No.", "studentRollNo", {
        section: "Self-Declaration",
      }),
      textField("Academic Year", "academicYear", {
        section: "Self-Declaration",
      }),
      textField("Recognized school / institution", "schoolName", {
        required: true,
        section: "Self-Declaration",
      }),
      textField("My spouse is a Central Government Servant", "spouseIsCentralGovtServant", {
        type: "radio",
        options: yesNoOptions,
        section: "Spouse Declaration",
      }),
      textField("Spouse will not claim Children Education Allowance", "spouseWillNotClaim", {
        type: "radio",
        options: yesNoOptions,
        section: "Spouse Declaration",
      }),
      textField("Spouse employer", "spouseEmployer", {
        section: "Spouse Declaration",
      }),
      textField("Spouse is not entitled to Children Education Allowance", "spouseNotEntitled", {
        type: "radio",
        options: yesNoOptions,
        section: "Spouse Declaration",
      }),
      textField("Signature Date", "signatureDate", {
        type: "date",
        section: "Employee Signature",
      }),
      textField("Designation", "designation", {
        section: "Employee Signature",
      }),
      textField("Emp. ID No.", "employeeIdNo", {
        section: "Employee Signature",
      }),
      textField("Dept./Section/Office", "departmentSectionOffice", {
        section: "Employee Signature",
      }),
      textField("Enclosures", "enclosures", {
        type: "textarea",
        minRows: 2,
        section: "Employee Signature",
      }),
    ],
  },
  buildConferenceAssistanceTemplate({
    code: "finance-student-conference-assistance",
    title: "Application for Permission and Financial Assistance for Attending Conference (Students)",
    description:
      "Finance and Accounts form for student conference participation and financial assistance.",
    section: "fin",
  }),
  {
    code: "finance-telephone-bill-reimbursement",
    title: "Telephone Bills Reimbursement Form",
    description:
      "Finance and Accounts reimbursement form for telephone and internet connection bills.",
    section: "fin",
    approvalStages: [],
    fields: [
      textField("Name of the Applicant", "applicantName", {
        required: true,
        section: "Applicant Details",
      }),
      textField("Salutation", "salutation", {
        type: "select",
        options: ["Dr.", "Mr.", "Ms."],
        section: "Applicant Details",
      }),
      textField("Designation", "designation", {
        required: true,
        section: "Applicant Details",
      }),
      textField("Department / Section", "departmentSection", {
        required: true,
        section: "Applicant Details",
      }),
      textField("Claims made for the period - From Month & Year", "claimFromMonthYear", {
        section: "Applicant Details",
      }),
      textField("Claims made for the period - To Month & Year", "claimToMonthYear", {
        section: "Applicant Details",
      }),
      tableField(
        "Telephone and Internet Bills",
        "billRows",
        [
          tableColumn("Phone Number / Internet Connection", "connection"),
          tableColumn("Bill Period From", "billFrom"),
          tableColumn("Bill Period To", "billTo"),
          tableColumn("Bill Date", "billDate"),
          tableColumn("Bill Amount / Recharge Coupon Amount", "billAmount"),
          tableColumn("Bill Paid on / Coupon Purchased on", "paidOn"),
          tableColumn("Remarks", "remarks"),
        ],
        {
          section: "Telephone and Internet Bills",
          defaultRows: 1,
        }
      ),
      textField("Total Amount", "totalAmount", {
        section: "Telephone and Internet Bills",
      }),
      textField("Date", "applicantDate", {
        type: "date",
        section: "Declaration",
      }),
      textField("Emp. No.", "employeeNo", {
        section: "Declaration",
      }),
      textField("Office Use - Total amount claimed", "officeTotalAmountClaimed", {
        section: "Office Use",
      }),
      textField("Office Use - Total amount admissible", "officeTotalAmountAdmissible", {
        section: "Office Use",
      }),
      textField("Office Use - Passed and pay amount", "officePassedAndPayAmount", {
        section: "Office Use",
      }),
      textField("Office Use - Passed and pay amount in words", "officePassedAndPayAmountWords", {
        type: "textarea",
        minRows: 2,
        section: "Office Use",
      }),
      textField("Office Use - Cheque No.", "officeChequeNo", {
        section: "Office Use",
      }),
      textField("Office Use - Cheque Date", "officeChequeDate", {
        type: "date",
        section: "Office Use",
      }),
      textField("Office Use - Bank Savings Account No.", "officeBankAccountNo", {
        section: "Office Use",
      }),
    ],
  },
  {
    code: "guest-house-accommodation-request",
    title: "Request for Guest House Accommodation",
    description:
      "Guest house accommodation request covering visitors, stay details, meals, and official approvals.",
    section: "guesthouse",
    approvalStages: [],
    fields: [
      tableField(
        "Visitor(s) / Guest(s)",
        "guestRows",
        [
          tableColumn("Name of the Visitor(s) / Guest(s)", "guestName"),
          tableColumn("Designation(s)", "designation"),
          tableColumn("Affiliation / Address / Contact / Email", "affiliationAddressContact"),
        ],
        {
          section: "Visitor Details",
          defaultRows: 1,
        }
      ),
      textField("Purpose of visit", "purposeOfVisit", {
        type: "textarea",
        minRows: 2,
        section: "Visit Details",
      }),
      textField("Date & Time of Arrival", "arrivalDateTime", {
        section: "Visit Details",
      }),
      textField("Date & Time of Departure", "departureDateTime", {
        section: "Visit Details",
      }),
      textField("Type of occupancy preferred", "occupancyType", {
        type: "select",
        options: occupancyOptions,
        section: "Visit Details",
      }),
      textField("No. of rooms required", "roomsRequired", {
        type: "number",
        section: "Visit Details",
      }),
      textField("Payment will be made by", "paymentBy", {
        type: "select",
        options: paymentByOptions,
        section: "Visit Details",
      }),
      textField("Food preference", "foodPreference", {
        type: "select",
        options: ["Veg", "Non-Veg"],
        section: "Food Requirements",
      }),
      textField("No. of Breakfast", "breakfastCount", {
        type: "number",
        section: "Food Requirements",
      }),
      textField("No. of Lunch", "lunchCount", {
        type: "number",
        section: "Food Requirements",
      }),
      textField("No. of Dinner", "dinnerCount", {
        type: "number",
        section: "Food Requirements",
      }),
      textField("Countersignature of the concerned HOD/HOS", "hodHosCountersignature", {
        section: "Indentor Details",
      }),
      textField("Signature of the Indentor with date", "indentorSignatureDate", {
        section: "Indentor Details",
      }),
      textField("Indentor Name", "indentorName", {
        required: true,
        section: "Indentor Details",
      }),
      textField("Indentor Designation", "indentorDesignation", {
        section: "Indentor Details",
      }),
      textField("Department/Section", "indentorDepartmentSection", {
        section: "Indentor Details",
      }),
      textField("Contact Phone No. / email ID", "indentorContact", {
        section: "Indentor Details",
      }),
      textField("Room(s) allotted", "roomsAllotted", {
        section: "Official Use",
      }),
      textField("Room No(s).", "roomNumbers", {
        section: "Official Use",
      }),
      textField("Period From", "officialPeriodFrom", {
        type: "date",
        section: "Official Use",
      }),
      textField("Period To", "officialPeriodTo", {
        type: "date",
        section: "Official Use",
      }),
      textField("Category recommended (A/B/C)", "recommendedCategory", {
        type: "select",
        options: ["A", "B", "C"],
        section: "Official Use",
      }),
      textField("Invited by the institute / Project related / Employee / Student guardian / Alumni / Other academic institutes", "recommendedCategoryBasis", {
        type: "textarea",
        minRows: 2,
        section: "Official Use",
      }),
      textField("Office Note", "officeNote", {
        type: "textarea",
        minRows: 2,
        section: "Official Use",
      }),
      textField("Incharge Guest House signature / date", "guestHouseInchargeSignatureDate", {
        section: "Official Use",
      }),
      textField("Approval of the Director/Registrar/Dean", "approvalAuthority", {
        section: "Official Use",
      }),
    ],
  },
  {
    code: "medical-opd-treatment-claim",
    title: "Medical Claim Form for OPD Treatment",
    description:
      "Medical claim form for OPD treatment including claimant details, patient details, consultations, tests, and essentiality certificate entries.",
    section: "medical",
    approvalStages: [],
    fields: [
      textField("Name", "claimantName", {
        required: true,
        section: "Status Information for the Claimant",
      }),
      textField("Designation & Emply No.", "designationEmployeeNo", {
        required: true,
        section: "Status Information for the Claimant",
      }),
      textField("Department / Section", "departmentSection", {
        required: true,
        section: "Status Information for the Claimant",
      }),
      textField("Pay", "pay", {
        section: "Status Information for the Claimant",
      }),
      textField("P.P., Spl. Pay, if any", "specialPay", {
        section: "Status Information for the Claimant",
      }),
      textField("Residential Address", "residentialAddress", {
        type: "textarea",
        minRows: 2,
        section: "Status Information for the Claimant",
      }),
      textField("Name of the Patient & Relationship", "patientNameRelationship", {
        required: true,
        section: "Information Regarding the Patient",
      }),
      textField("Illness", "illness", {
        required: true,
        section: "Information Regarding the Patient",
      }),
      textField("Since when ill & place where ill", "illnessSincePlace", {
        type: "textarea",
        minRows: 2,
        section: "Information Regarding the Patient",
      }),
      tableField(
        "Consultation details",
        "consultationRows",
        [
          tableColumn("Date of Consultation", "consultationDate", { type: "date" }),
          tableColumn("Fee paid for each visit", "feePaid"),
        ],
        {
          section: "Amount Claimed",
          defaultRows: 1,
        }
      ),
      textField("Name & Designation of Medical Officer consulted", "medicalOfficerNameDesignation", {
        section: "Amount Claimed",
      }),
      textField("Hospital / Dispensary attached", "hospitalDispensaryAttached", {
        section: "Amount Claimed",
      }),
      textField("Consulted at Hospital / consulting Room of Doctor / Residence", "consultedAt", {
        section: "Amount Claimed",
      }),
      textField("Fee paid for each consultation", "consultationFee", {
        section: "Amount Claimed",
      }),
      textField("Name of Hospital or Laboratory where tests undertaken", "testHospitalOrLaboratory", {
        section: "Tests and Medicines",
      }),
      textField("Whether tests undertaken on advice of the authorized Medical Attendant", "testsUndertakenOnAdvice", {
        type: "radio",
        options: yesNoOptions,
        section: "Tests and Medicines",
      }),
      tableField(
        "Medicines purchased from market",
        "medicineRows",
        [
          tableColumn("Name of the Medicine", "medicineName"),
          tableColumn("Price (Rs.)", "price"),
        ],
        {
          section: "Tests and Medicines",
          defaultRows: 1,
        }
      ),
      textField("No. of Cash Memos attached", "cashMemoCount", {
        section: "Tests and Medicines",
      }),
      textField("Total amount claimed", "totalAmountClaimed", {
        section: "Tests and Medicines",
      }),
      textField("Total Number of enclosures", "totalEnclosures", {
        section: "Tests and Medicines",
      }),
      textField("Declaration Date", "declarationDate", {
        type: "date",
        section: "Declaration by Staff Member",
      }),
      textField("Doctor / Medical Officer name", "certificateDoctorName", {
        section: "Essentiality Certificate",
      }),
      textField("Consultation charges received", "certificateConsultationCharges", {
        section: "Essentiality Certificate",
      }),
      textField("Consultation place", "certificateConsultationPlace", {
        section: "Essentiality Certificate",
      }),
      textField("Injection charges received", "certificateInjectionCharges", {
        section: "Essentiality Certificate",
      }),
      textField("Injection details", "certificateInjectionDetails", {
        section: "Essentiality Certificate",
      }),
      textField("Injections were for immunizing or prophylactic", "certificateImmunizingOrProphylactic", {
        type: "radio",
        options: yesNoOptions,
        section: "Essentiality Certificate",
      }),
      textField("Patient suffering from", "certificatePatientCondition", {
        section: "Essentiality Certificate",
      }),
      textField("Treatment from", "certificateTreatmentFrom", {
        type: "date",
        section: "Essentiality Certificate",
      }),
      textField("Treatment to", "certificateTreatmentTo", {
        type: "date",
        section: "Essentiality Certificate",
      }),
      textField("X-ray / Laboratory Test expenditure", "certificateTestExpenditure", {
        section: "Essentiality Certificate",
      }),
      textField("Hospital / laboratory for test", "certificateTestHospital", {
        section: "Essentiality Certificate",
      }),
      textField("Referred patient to Dr.", "certificateReferredDoctor", {
        section: "Essentiality Certificate",
      }),
      textField("Patient required hospitalization", "certificateRequiredHospitalization", {
        type: "radio",
        options: yesNoOptions,
        section: "Essentiality Certificate",
      }),
      textField("Medical Officer Signature Date", "certificateDate", {
        type: "date",
        section: "Essentiality Certificate",
      }),
      textField("Regn. No.", "certificateRegistrationNo", {
        section: "Essentiality Certificate",
      }),
    ],
  },
  buildProcurementTemplate({
    code: "snp-local-purchase-committee-recommendation",
    title: "Recommendation by Local Purchase Committee",
    description:
      "Stores and Purchase recommendation format for procurement by Local Purchase Committee.",
    isLocalPurchase: true,
  }),
  buildProcurementTemplate({
    code: "snp-procurement-foreign-currency-single-bid",
    title: "Procurement in Foreign Currency using Single Bid Tendering Process",
    description:
      "Stores and Purchase recommendation cum sanction sheet for procurement in foreign currency using single bid tendering.",
    currency: "FOREIGN",
  }),
  buildProcurementTemplate({
    code: "snp-procurement-foreign-currency-two-bid",
    title: "Procurement in Foreign Currency using Double Bid Tendering Process",
    description:
      "Stores and Purchase recommendation cum sanction sheet for procurement in foreign currency using double bid tendering.",
    currency: "FOREIGN",
    isDoubleBid: true,
  }),
  buildProcurementTemplate({
    code: "snp-procurement-inr-single-bid",
    title: "Procurement in INR using Single Bid Tendering Process",
    description:
      "Stores and Purchase recommendation cum sanction sheet for procurement in INR using single bid tendering.",
  }),
  buildProcurementTemplate({
    code: "snp-procurement-inr-two-bid",
    title: "Procurement in INR using Double Bid Tendering Process",
    description:
      "Stores and Purchase recommendation cum sanction sheet for procurement in INR using double bid tendering.",
    isDoubleBid: true,
  }),
  buildProcurementTemplate({
    code: "snp-procurement-rate-contract",
    title: "Procurement in INR using Rate Contract Process",
    description:
      "Stores and Purchase recommendation cum sanction sheet for procurement using rate contract.",
    isRateContract: true,
  }),
  {
    code: "snp-inspection-report",
    title: "Inspection Report",
    description:
      "Stores and Purchase inspection report for supplied items, installation, stock entry, and acceptance.",
    section: "snp",
    approvalStages: [],
    fields: [
      textField("Section / Dept", "sectionDepartment", {
        required: true,
        section: "Inspection Details",
      }),
      textField("Indenter", "indenter", {
        required: true,
        section: "Inspection Details",
      }),
      textField("A/C HEAD (Equipment / Furniture / Software, etc.)", "accountHead", {
        section: "Inspection Details",
      }),
      textField("Location (Room Number / Lab Name / Building)", "location", {
        section: "Inspection Details",
      }),
      textField("Name of the Supplier", "supplierName", {
        required: true,
        section: "Supplier Details",
      }),
      textField("Name of the Indian Agent", "indianAgentName", {
        section: "Supplier Details",
      }),
      textField("Invoice No.", "invoiceNo", {
        section: "Supplier Details",
      }),
      textField("Invoice Date", "invoiceDate", {
        type: "date",
        section: "Supplier Details",
      }),
      textField("Date of Delivery", "deliveryDate", {
        type: "date",
        section: "Supplier Details",
      }),
      textField("Date of Installation", "installationDate", {
        type: "date",
        section: "Supplier Details",
      }),
      textField("File No.", "fileNo", {
        section: "Supplier Details",
      }),
      textField("P.O. No. / GeM Contract No.", "poOrGemContractNo", {
        section: "Supplier Details",
      }),
      textField("P.O. / GeM Contract Date", "poOrGemContractDate", {
        type: "date",
        section: "Supplier Details",
      }),
      tableField(
        "Inspection items",
        "inspectionItems",
        [
          tableColumn("Description of Items", "description"),
          tableColumn("Qty.", "quantity", { type: "number" }),
          tableColumn("Rate (INR)", "rateInr"),
          tableColumn("Amount (INR)", "amountInr"),
          tableColumn("Accepted / Rejected", "acceptedRejected", {
            type: "select",
            options: ["Accepted", "Rejected"],
          }),
          tableColumn("Stock Register No.", "stockRegisterNo"),
          tableColumn("Page No.", "pageNo"),
          tableColumn("Sl. No.", "stockSerialNo"),
        ],
        {
          section: "Inspection Items",
          defaultRows: 1,
        }
      ),
      textField("Total Basic Value", "totalBasicValue", {
        section: "Inspection Totals",
      }),
      textField("GST percentage", "gstPercentage", {
        section: "Inspection Totals",
      }),
      textField("GST amount", "gstAmount", {
        section: "Inspection Totals",
      }),
      textField("Total F.O.R., IIT Patna Value", "totalForValue", {
        section: "Inspection Totals",
      }),
      textField("Office / Lab In-Charge", "officeLabIncharge", {
        section: "Signatures",
      }),
      textField("Office / Lab In-Charge Date", "officeLabInchargeDate", {
        type: "date",
        section: "Signatures",
      }),
      textField("Indenter / Faculty", "indenterFaculty", {
        section: "Signatures",
      }),
      textField("Indenter / Faculty Date", "indenterFacultyDate", {
        type: "date",
        section: "Signatures",
      }),
      textField("Section Head / HOD", "sectionHeadOrHod", {
        section: "Signatures",
      }),
      textField("Section Head / HOD Date", "sectionHeadOrHodDate", {
        type: "date",
        section: "Signatures",
      }),
    ],
  },
  {
    code: "snp-inter-department-asset-transfer",
    title: "Inter Department Asset Transfer",
    description:
      "Stores and Purchase form for transferring assets between departments, sections, or units.",
    section: "snp",
    approvalStages: [],
    fields: [
      textField("Transfer Date", "transferDate", {
        type: "date",
        section: "Transfer Details",
      }),
      textField("From Department / Section / Unit", "fromDepartment", {
        required: true,
        section: "Transfer Details",
      }),
      textField("From Custodian / Indentor", "fromCustodian", {
        section: "Transfer Details",
      }),
      textField("To Department / Section / Unit", "toDepartment", {
        required: true,
        section: "Transfer Details",
      }),
      textField("To Custodian / Indentor", "toCustodian", {
        section: "Transfer Details",
      }),
      textField("Reason for transfer", "transferReason", {
        type: "textarea",
        minRows: 2,
        section: "Transfer Details",
      }),
      tableField(
        "Assets being transferred",
        "assetTransferRows",
        [
          tableColumn("Item Description", "itemDescription"),
          tableColumn("Asset / Stock No.", "assetOrStockNo"),
          tableColumn("Quantity", "quantity", { type: "number" }),
          tableColumn("Condition", "condition"),
          tableColumn("Present Location", "presentLocation"),
          tableColumn("Remarks", "remarks"),
        ],
        {
          section: "Asset Details",
          defaultRows: 1,
        }
      ),
      textField("Transferred by", "transferredBy", {
        section: "Approvals",
      }),
      textField("Transferred by Date", "transferredByDate", {
        type: "date",
        section: "Approvals",
      }),
      textField("Received by", "receivedBy", {
        section: "Approvals",
      }),
      textField("Received by Date", "receivedByDate", {
        type: "date",
        section: "Approvals",
      }),
      textField("From HOD / Section Head approval", "fromHodApproval", {
        section: "Approvals",
      }),
      textField("To HOD / Section Head approval", "toHodApproval", {
        section: "Approvals",
      }),
      textField("Stores and Purchase acknowledgement", "storesAcknowledgement", {
        section: "Approvals",
      }),
    ],
  },
  {
    code: "snp-proprietary-article-certificate",
    title: "Proprietary Article Certificate",
    description:
      "Stores and Purchase certificate for procurement under proprietary article / single tender enquiry rules.",
    section: "snp",
    approvalStages: [],
    fields: [
      textField("Date", "certificateDate", {
        type: "date",
        section: "Certificate Details",
      }),
      textField("Department", "department", {
        required: true,
        section: "Certificate Details",
      }),
      textField("Description of Item", "itemDescription", {
        required: true,
        section: "Certificate Details",
      }),
      textField("Indented Value", "indentedValue", {
        section: "Certificate Details",
      }),
      textField("Quoted Value (if quotation is already collected)", "quotedValue", {
        section: "Certificate Details",
      }),
      textField("Goods are manufactured by M/s", "manufacturerName", {
        required: true,
        section: "Certification",
      }),
      textField("Reason a", "reasonA", {
        type: "textarea",
        minRows: 2,
        section: "Certification",
      }),
      textField("Reason b", "reasonB", {
        type: "textarea",
        minRows: 2,
        section: "Certification",
      }),
      textField("Reason c", "reasonC", {
        type: "textarea",
        minRows: 2,
        section: "Certification",
      }),
      textField("Reason d", "reasonD", {
        type: "textarea",
        minRows: 2,
        section: "Certification",
      }),
      textField(
        "Proprietary Article Certificate submitted by vendor is attached",
        "vendorCertificateAttached",
        {
          type: "radio",
          options: yesNoOptions,
          section: "Certification",
        }
      ),
      textField("Indenting officer name & designation", "indentingOfficer", {
        section: "Approvals",
      }),
      textField("Purchase Committee Member 1", "purchaseCommitteeMember1", {
        section: "Approvals",
      }),
      textField("Purchase Committee Member 2", "purchaseCommitteeMember2", {
        section: "Approvals",
      }),
      textField("Purchase Committee Member 3", "purchaseCommitteeMember3", {
        section: "Approvals",
      }),
      textField("Purchase Committee Member 4", "purchaseCommitteeMember4", {
        section: "Approvals",
      }),
      textField("Approved by Head of Deptt.", "headOfDepartmentApproval", {
        section: "Approvals",
      }),
    ],
  },
  {
    code: "snp-purchase-indent",
    title: "Purchase Indent",
    description:
      "Stores and Purchase purchase indent covering justification, budget position, GeM availability, and delivery/warranty suggestions.",
    section: "snp",
    approvalStages: [],
    fields: [
      textField("Name of Indentor", "indentorName", {
        required: true,
        section: "Indent Details",
      }),
      textField("Designation", "designation", {
        section: "Indent Details",
      }),
      textField("Department", "department", {
        required: true,
        section: "Indent Details",
      }),
      textField("Accounting Head", "accountingHead", {
        section: "Indent Details",
      }),
      textField("Category", "category", {
        section: "Indent Details",
      }),
      textField("Fund Code", "fundCode", {
        section: "Indent Details",
      }),
      textField("Indent Ref No.", "indentRefNo", {
        section: "Indent Details",
      }),
      textField("Date", "indentDate", {
        type: "date",
        section: "Indent Details",
      }),
      tableField(
        "Purchase items",
        "purchaseItems",
        [
          tableColumn("Item Description", "itemDescription"),
          tableColumn("Justification", "justification"),
          tableColumn("Qty.", "quantity", { type: "number" }),
          tableColumn("Estimated Rate", "estimatedRate"),
          tableColumn("Estimated Value (Rs.)", "estimatedValue"),
        ],
        {
          section: "Purchase Items",
          defaultRows: 1,
        }
      ),
      textField("Total Amount (Rupees only)", "totalAmountWords", {
        type: "textarea",
        minRows: 2,
        section: "Purchase Items",
      }),
      textField("Expenditure Type", "expenditureType", {
        type: "select",
        options: [
          "Capital Expenditure (Equipment, Furniture etc.)",
          "Contingent Expenditure (Departmental operational expenses)",
          "Consumable (Labwares / Chemicals / Stationery / Cartridges etc.)",
          "Repairs and Maintenances",
        ],
        section: "Budget and Classification",
      }),
      textField("Budget for 2019-20", "budgetForYear", {
        section: "Budget and Classification",
      }),
      textField("Already Processed Indent", "alreadyProcessedIndent", {
        section: "Budget and Classification",
      }),
      textField("Proposed", "budgetProposed", {
        section: "Budget and Classification",
      }),
      textField("Balance", "budgetBalance", {
        section: "Budget and Classification",
      }),
      textField("Was the indent for this item raised earlier", "indentRaisedEarlier", {
        type: "radio",
        options: yesNoOptions,
        section: "Additional Information",
      }),
      textField("Earlier File No.", "earlierFileNo", {
        section: "Additional Information",
      }),
      textField("Earlier Date of Indent", "earlierIndentDate", {
        type: "date",
        section: "Additional Information",
      }),
      textField("Was it procured", "wasProcured", {
        type: "radio",
        options: yesNoOptions,
        section: "Additional Information",
      }),
      textField("If not procured, why was it not procured", "notProcuredReason", {
        type: "textarea",
        minRows: 2,
        section: "Additional Information",
      }),
      textField("Is it to be procured outside GeM", "procureOutsideGem", {
        type: "radio",
        options: yesNoOptions,
        section: "GeM Availability",
      }),
      textField("The item with required specification is not available on GeM", "notAvailableOnGem", {
        type: "radio",
        options: yesNoOptions,
        section: "GeM Availability",
      }),
      textField(
        "Item may not be available in the country and it is necessary to look for offers from abroad",
        "lookForOffersFromAbroad",
        {
          type: "radio",
          options: yesNoOptions,
          section: "GeM Availability",
        }
      ),
      textField("Possible countries and corresponding currencies", "possibleCountriesAndCurrencies", {
        type: "textarea",
        minRows: 2,
        section: "GeM Availability",
      }),
      textField("Suggested delivery period after issue of PO", "suggestedDeliveryPeriod", {
        section: "Additional Suggestions",
      }),
      textField("Suggested warranty period with justification", "suggestedWarrantyPeriod", {
        type: "textarea",
        minRows: 2,
        section: "Additional Suggestions",
      }),
    ],
  },
  {
    code: "snp-central-store-requisition-slip",
    title: "Requisition Slip for Central Store",
    description:
      "Central Stores requisition slip for stationery and material issued by the Stores and Purchase Section.",
    section: "snp",
    approvalStages: [],
    fields: [
      textField("Date", "requisitionDate", {
        type: "date",
        section: "Indentor Details",
      }),
      textField("Name of the Indenter", "indenterName", {
        required: true,
        section: "Indentor Details",
      }),
      textField("Designation", "designation", {
        section: "Indentor Details",
      }),
      textField("Department", "department", {
        required: true,
        section: "Indentor Details",
      }),
      textField("Emp. Code", "employeeCode", {
        section: "Indentor Details",
      }),
      tableField(
        "Office stationery / material requested",
        "requestedItems",
        [
          tableColumn("Item Code", "itemCode"),
          tableColumn("Description", "description"),
          tableColumn("Qty.", "requestedQty", { type: "number" }),
          tableColumn("Issued Qty.", "issuedQty", { type: "number" }),
        ],
        {
          section: "Requested Items",
          defaultRows: 1,
        }
      ),
      textField("Signature of Indenter", "indenterSignature", {
        section: "Approvals",
      }),
      textField("Approved by", "approvedBy", {
        section: "Approvals",
      }),
      textField("Issue No.", "issueNo", {
        section: "Store Issue Details",
      }),
      textField("Issued by", "issuedBy", {
        section: "Store Issue Details",
      }),
      textField("Stationary Received by", "receivedBy", {
        section: "Store Issue Details",
      }),
      textField("Issued Date", "issuedDate", {
        type: "date",
        section: "Store Issue Details",
      }),
      textField("Received Date", "receivedDate", {
        type: "date",
        section: "Store Issue Details",
      }),
    ],
  },
];

const MISSING_HARDCODED_TEMPLATE_MAP = new Map(
  MISSING_HARDCODED_TEMPLATES.map((template) => [template.code, template])
);

const getHardcodedTemplateDefinition = (code) =>
  MISSING_HARDCODED_TEMPLATE_MAP.get(String(code || "").trim()) || null;

module.exports = {
  MISSING_HARDCODED_TEMPLATES,
  getHardcodedTemplateDefinition,
};

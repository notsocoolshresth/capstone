const FormTemplate = require("../models/FormTemplate");

const GEN_ADMIN_TEMPLATE_CODE = "gen-admin";
const GEN_ADMIN_VEHICLE_REQUISITION_CODE = "gen-admin-vehicle-requisition-transport";
const SECURITY_CAMPUS_LEAVE_FEMALE_CODE = "security-campus-leave-female";
const SECURITY_DAY_SCHOLAR_VEHICLE_PERMIT_CODE = "security-day-scholar-vehicle-permit";
const SECURITY_MESS_WORKERS_CODE = "security-mess-workers";
const SECURITY_PASS_RENEWAL_CODE = "security-pass-renewal";
const SECURITY_ENTRY_PASS_CODE = "security-entry-pass";
const SECURITY_REQUISITION_FOR_VEHICLE_STICKER_CODE = "security_requisition_for_vehicle_sticker";
const SECURITY_VEHICLE_STICKER_REQUITION_MARRIED_SCHOLAR_CODE = "security-vehicle-sticker-requition-for-married-scholar";
const SECURITY_UNDERTAKING_REGARDING_WORKER_CONDUCT_AND_RESPONSIBILITY_CODE =
  "security_undertaking_regarding_worker_conduct_and_responsibility";
const CC_LDAP_ACCOUNT_REQUEST_CODE = "cc-ldap-account-request";
const FINANCE_PROCUREMENT_RECOMMENDATION_SANCTION_CODE = "finance-procurement-recommendation-sanction-double-bid-inr";
const CC_FACULTY_PERFORMA_CODE = "cc-faculty-performa";
const CC_FACULTY_DECLARATION_CODE = "cc-faculty-declaration";
const CC_EMAIL_ACCOUNT_REQUEST_CODE = "cc-email-account-request";
const CC_PROXY_LDAP_REQUEST_CODE = "cc-proxy-ldap-request";
const CC_RD_RECOMMENDATION_GEM_CODE = "cc-rd-recommendation-gem";
const CC_RD_TWO_BID_GEM_CODE = "cc-rd-two-bid-gem";
const ESTB_HOUSE_ALLOTMENT_D_TYPE_CODE = "estb-house-allotment-d-type";
const ESTB_DEPARTURE_REJOINING_CODE = "estb-departure-rejoining-report";

const GEN_ADMIN_TEMPLATE = {
  code: GEN_ADMIN_TEMPLATE_CODE,
  title: "General Administration Self-Declaration",
  description: "A self-declaration form for general administration purposes.",
  section: "genadmin",
  fields: [
    { label: "Salutation", name: "salutation", type: "select", required: true, options: ["Dr.", "Mr.", "Ms."] },
    { label: "Full Name", name: "fullName", type: "text", required: true },
    { label: "Designation", name: "designation", type: "text", required: true },
    { label: "Dept./Section/Centre", name: "department", type: "text", required: true },
    { label: "Employee Signature Name", name: "employeeSignatureName", type: "text", required: true },
    { label: "Employee Number", name: "empNo", type: "text", required: true },
    { label: "Place", name: "place", type: "text", required: true },
    { label: "Date", name: "declarationDate", type: "date", required: true },
  ],
  approvalStages: [],
};

const GEN_ADMIN_VEHICLE_REQUISITION_TEMPLATE = {
  code: GEN_ADMIN_VEHICLE_REQUISITION_CODE,
  title: "Indent for Transport",
  description: "General Administration vehicle requisition form for transport requirement.",
  section: "genadmin",
  fields: [
    { label: "Ref No.", name: "refNo", type: "text", required: false },
    { label: "Dated", name: "dated", type: "date", required: false },
    {
      label: "Name, Designation & Dept./Section/Centre of the Indentor",
      name: "indentorDetails",
      type: "text",
      required: true,
    },
    { label: "Type of vehicle required", name: "vehicleTypeRequired", type: "text", required: true },
    { label: "Vehicle required on (date)", name: "vehicleRequiredDate", type: "date", required: true },
    { label: "Vehicle required at (place)", name: "vehicleRequiredPlace", type: "text", required: true },
    { label: "Vehicle required at (time)", name: "vehicleRequiredTime", type: "text", required: true },
    { label: "Vehicle required up to", name: "vehicleRequiredUpto", type: "text", required: true },
    { label: "Place(s) to be visited", name: "placesToBeVisited", type: "text", required: true },
    {
      label: "Name(s) of the guest(s) (if applicable)",
      name: "guestNames",
      type: "text",
      required: false,
    },
    { label: "Flight No./Train No.", name: "flightOrTrainNo", type: "text", required: false },
    {
      label: "Arrival / Departure time",
      name: "arrivalDepartureTime",
      type: "text",
      required: false,
    },
    {
      label: "Is it official",
      name: "isOfficial",
      type: "select",
      required: true,
      options: ["Yes", "No"],
    },
    { label: "Official purpose", name: "officialPurpose", type: "textarea", required: false },
    { label: "Date", name: "signatureDate", type: "date", required: true },
    { label: "Vehicle No. (office use)", name: "allottedVehicleNo", type: "text", required: false },
    { label: "Type (office use)", name: "allottedVehicleType", type: "text", required: false },
    { label: "Driver (office use)", name: "allottedDriver", type: "text", required: false },
    { label: "Driver report to", name: "driverReportTo", type: "text", required: false },
    { label: "Report date", name: "driverReportDate", type: "date", required: false },
    { label: "Report place", name: "driverReportPlace", type: "text", required: false },
    { label: "Report time", name: "driverReportTime", type: "text", required: false },
  ],
  approvalStages: [],
};

const SECURITY_CAMPUS_LEAVE_FEMALE_TEMPLATE = {
  code: SECURITY_CAMPUS_LEAVE_FEMALE_CODE,
  title: "Campus Leaving Permission after 10:00 PM (For Female Students)",
  description: "Permission form for female students leaving IIT Patna campus after 10:00 PM.",
  section: "security",
  fields: [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Roll No", name: "rollNo", type: "text", required: true },
    { label: "Hostel Name", name: "hostelName", type: "text", required: true },
    { label: "Gender", name: "gender", type: "text", required: false },
    { label: "Date of Leaving", name: "dateOfLeaving", type: "date", required: true },
    { label: "Reason for Leaving", name: "reasonForLeaving", type: "textarea", required: true },
    { label: "Companion 1 Name", name: "companion1Name", type: "text", required: false },
    { label: "Companion 1 Roll No", name: "companion1RollNo", type: "text", required: false },
    { label: "Companion 2 Name", name: "companion2Name", type: "text", required: false },
    { label: "Companion 2 Roll No", name: "companion2RollNo", type: "text", required: false },
  ],
  approvalStages: [],
};


const ESTB_DEPARTURE_REJOINING_TEMPLATE = {
  code: ESTB_DEPARTURE_REJOINING_CODE,
  title: "Departure & Re-joining Report",
  description: "Establishment departure and re-joining report form.",
  section: "estb",
  fields: [
    { label: "Departure From Date", name: "departureFromDate", type: "text", required: false },
    { label: "FN/AN", name: "departureFnAn", type: "text", required: false },
    { label: "Out of Station Till", name: "departureOutOfStationTill", type: "text", required: false },
    { label: "Address During Leave", name: "departureAddress", type: "text", required: false },
    { label: "Contact Phone (if any)", name: "departureContactPhone", type: "text", required: false },
    { label: "Departure Date", name: "departureDate", type: "date", required: false },
    { label: "Name", name: "departureName", type: "text", required: true },
    { label: "Employee No.", name: "departureEmpNo", type: "text", required: true },
    { label: "Designation", name: "departureDesignation", type: "text", required: false },
    { label: "Department/Section", name: "departureDepartment", type: "text", required: false },
    { label: "Re-joining Date", name: "rejoiningDate", type: "text", required: false },
    { label: "Re-joining FN/AN", name: "rejoiningFnAn", type: "text", required: false },
    { label: "Leave From", name: "rejoiningLeaveFrom", type: "text", required: false },
    { label: "Leave To", name: "rejoiningLeaveTo", type: "text", required: false },
    { label: "Re-joining Sign Date", name: "rejoiningSignDate", type: "date", required: false },
    { label: "Re-joining Name", name: "rejoiningName", type: "text", required: true },
    { label: "Re-joining Emp. No.", name: "rejoiningEmpNo", type: "text", required: false },
    { label: "Re-joining Designation", name: "rejoiningDesignation", type: "text", required: false },
    { label: "Re-joining Department", name: "rejoiningDepartment", type: "text", required: false },
  ],
  approvalStages: [],
};
 
const ESTB_HOUSE_ALLOTMENT_D_TYPE_TEMPLATE = {
  code: ESTB_HOUSE_ALLOTMENT_D_TYPE_CODE,
  title: "House Allotment Form – D Type Quarters",
  description: "Establishment house allotment application form for D type quarters.",
  section: "estb",
  fields: [
    { label: "Circular No.", name: "circularNo", type: "text", required: false },
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Employee ID", name: "employeeId", type: "text", required: true },
    { label: "Designation", name: "designation", type: "text", required: true },
    { label: "Present Level in Pay Matrix (As per 7th CPC)", name: "payMatrixLevel", type: "text", required: false },
    { label: "Deptt./Section", name: "deptSection", type: "text", required: false },
    { label: "Date of joining", name: "dateOfJoining", type: "date", required: false },
    { label: "E-mail", name: "email", type: "text", required: false },
    { label: "Marital Status", name: "maritalStatus", type: "text", required: false },
    { label: "Bachelor Accommodation Preferred (Y/N)", name: "bachelorAccommodation", type: "text", required: false },
    { label: "Quarter Preferences", name: "quarterPreferences", type: "text", required: false },
    { label: "Present Quarter No./Present Address", name: "presentQuarterAddress", type: "text", required: false },
  ],
  approvalStages: [],
};

const SECURITY_REQUISITION_FOR_VEHICLE_STICKER_TEMPLATE = {
  code: SECURITY_REQUISITION_FOR_VEHICLE_STICKER_CODE,
  title: "Requisition for Vehicle Sticker",
  description: "Security requisition form for issue of vehicle sticker.",
  section: "security",
  fields: [
    { label: "Name of the employee", name: "employeeName", type: "text", required: true },
    { label: "Ownership of the Vehicle", name: "vehicleOwnership", type: "text", required: true },
    { label: "Employee No.", name: "employeeNo", type: "text", required: true },
    { label: "Designation", name: "designation", type: "text", required: true },
    { label: "Department / Section", name: "departmentSection", type: "text", required: true },
    { label: "Residential Address", name: "residentialAddress", type: "textarea", required: true },
    { label: "Mobile No.", name: "mobileNo", type: "text", required: true },
    { label: "Institute e-mail ID", name: "instituteEmailId", type: "text", required: true },
    { label: "Vehicle Number", name: "vehicleNumber", type: "text", required: true },
    { label: "Engine Number", name: "engineNumber", type: "text", required: true },
    { label: "Chassis No.", name: "chassisNo", type: "text", required: true },
    { label: "Type of Vehicle", name: "vehicleType", type: "text", required: true },
    { label: "Signature with date", name: "signatureWithDate", type: "text", required: false },
    { label: "Vehicle Sticker No. (Office Use)", name: "officeVehicleStickerNo", type: "text", required: false },
    { label: "Date of issue (Office Use)", name: "officeDateOfIssue", type: "date", required: false },
    { label: "Office Note", name: "officeNote", type: "textarea", required: false },
    { label: "Signature of Security Officer", name: "securityOfficerSignature", type: "text", required: false },
  ],
  approvalStages: [],
};

const SECURITY_VEHICLE_STICKER_REQUITION_MARRIED_SCHOLAR_TEMPLATE = {
  code: SECURITY_VEHICLE_STICKER_REQUITION_MARRIED_SCHOLAR_CODE,
  title: "Requisition for Vehicle Sticker (Resident of Married Accommodation Only)",
  description: "Security requisition form for issue of vehicle sticker for married accommodation residents.",
  section: "security",
  fields: [
    { label: "Name of the employee", name: "employeeName", type: "text", required: true },
    { label: "Ownership of the Vehicle", name: "vehicleOwnership", type: "text", required: true },
    { label: "Roll No.", name: "rollNo", type: "text", required: true },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Residential Address", name: "residentialAddress", type: "textarea", required: true },
    { label: "Mobile No.", name: "mobileNo", type: "text", required: true },
    { label: "Institute e-mail ID", name: "instituteEmailId", type: "text", required: true },
    { label: "Vehicle Number", name: "vehicleNumber", type: "text", required: true },
    { label: "Engine Number", name: "engineNumber", type: "text", required: true },
    { label: "Chassis No.", name: "chassisNo", type: "text", required: true },
    { label: "Type of Vehicle", name: "vehicleType", type: "text", required: true },
    { label: "Signature with date", name: "signatureWithDate", type: "text", required: false },
    { label: "Recommendation by Supervisor", name: "supervisorRecommendation", type: "textarea", required: false },
    { label: "Remarks by HoD", name: "hodRemarks", type: "textarea", required: false },
    { label: "Vehicle Sticker No. (Office Use)", name: "officeVehicleStickerNo", type: "text", required: false },
    { label: "Date of issue (Office Use)", name: "officeDateOfIssue", type: "date", required: false },
    { label: "Office Note", name: "officeNote", type: "textarea", required: false },
    { label: "Signature of Security Officer", name: "securityOfficerSignature", type: "text", required: false },
  ],
  approvalStages: [],
};

const SECURITY_UNDERTAKING_REGARDING_WORKER_CONDUCT_AND_RESPONSIBILITY_TEMPLATE = {
  code: SECURITY_UNDERTAKING_REGARDING_WORKER_CONDUCT_AND_RESPONSIBILITY_CODE,
  title: "Undertaking regarding the Conduct & Responsibility of Mess Workers",
  description: "Undertaking form for mess contractor regarding worker conduct and responsibility.",
  section: "security",
  fields: [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Designation", name: "designation", type: "text", required: true },
    { label: "Firm's Name", name: "firmName", type: "text", required: true },
    { label: "Mobile No.", name: "mobileNo", type: "text", required: true },
    { label: "Email id", name: "emailId", type: "text", required: false },
  ],
  approvalStages: [],
};

const SECURITY_DAY_SCHOLAR_VEHICLE_PERMIT_TEMPLATE = {
  code: SECURITY_DAY_SCHOLAR_VEHICLE_PERMIT_CODE,
  title: "Day Scholar Vehicle Permit & Parking Permission Form",
  description: "IIT Patna day scholar vehicle permit and parking permission form for campus entry.",
  section: "security",
  fields: [
    { label: "Name & Roll Number", name: "nameRollNumber", type: "text", required: true },
    { label: "Mobile Number", name: "mobileNumber", type: "text", required: true },
    { label: "Institute Email", name: "instituteEmail", type: "text", required: false },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Owner Name", name: "ownerName", type: "text", required: true },
    { label: "Owner Relationship", name: "ownerRelationship", type: "text", required: false },
    { label: "Vehicle Registration Number (RC)", name: "vehicleRegNo", type: "text", required: true },
    { label: "Engine Number", name: "engineNumber", type: "text", required: false },
    { label: "Chassis Number", name: "chassisNumber", type: "text", required: false },
    { label: "Type of Vehicle", name: "vehicleType", type: "select", required: true, options: ["Car", "Bike", "Scooter", "Other"] },
    { label: "Residential Address", name: "residentialAddress", type: "textarea", required: true },
  ],
  approvalStages: [],
};

const SECURITY_MESS_WORKERS_TEMPLATE = {
  code: SECURITY_MESS_WORKERS_CODE,
  title: "Mess Worker Initial Entry Form",
  description: "Request form for entry of mess vendor/workers into IIT Patna campus.",
  section: "security",
  fields: [
    { label: "Hostel Name", name: "hostelName", type: "text", required: true },
    { label: "Vendor Representative Name", name: "vendorName", type: "text", required: true },
    { label: "Worker 1 Name", name: "worker1Name", type: "text", required: true },
    { label: "Worker 1 Aadhar", name: "worker1Aadhar", type: "text", required: true },
    { label: "Worker 2 Name", name: "worker2Name", type: "text", required: false },
    { label: "Worker 2 Aadhar", name: "worker2Aadhar", type: "text", required: false },
    { label: "Worker 3 Name", name: "worker3Name", type: "text", required: false },
    { label: "Worker 3 Aadhar", name: "worker3Aadhar", type: "text", required: false },
    { label: "Worker 4 Name", name: "worker4Name", type: "text", required: false },
    { label: "Worker 4 Aadhar", name: "worker4Aadhar", type: "text", required: false },
    { label: "Worker 5 Name", name: "worker5Name", type: "text", required: false },
    { label: "Worker 5 Aadhar", name: "worker5Aadhar", type: "text", required: false },
    { label: "Worker 6 Name", name: "worker6Name", type: "text", required: false },
    { label: "Worker 6 Aadhar", name: "worker6Aadhar", type: "text", required: false },
  ],
  approvalStages: [],
};

const SECURITY_PASS_RENEWAL_TEMPLATE = {
  code: SECURITY_PASS_RENEWAL_CODE,
  title: "Requisition for Renewal of Entry Pass",
  description: "Renewal of entry pass for Domestic Help/Tutor/Driver/Supplier at IIT Patna.",
  section: "security",
  fields: [
    { label: "Name of the Applicant", name: "applicantName", type: "text", required: true },
    { label: "Date", name: "date", type: "date", required: false },
    { label: "Flat No.(s)", name: "flatNo", type: "text", required: false },
    { label: "Mobile No.", name: "mobileNo", type: "text", required: false },
    { label: "Pass Number", name: "passNumber", type: "text", required: true },
    { label: "Name & Mobile No. of the Pass Holder", name: "passHolderNameMobile", type: "text", required: false },
  ],
  approvalStages: [],
};

const SECURITY_ENTRY_PASS_TEMPLATE = {
  code: SECURITY_ENTRY_PASS_CODE,
  title: "Form for Entry Pass: Domestic Help/Tutor/Driver/Supplier",
  description: "Requisition form for entry pass for domestic help, tutor, driver or supplier at IIT Patna.",
  section: "security",
  fields: [
    { label: "Name of the Applicant",                   name: "applicantName",           type: "text",  required: true  },
    { label: "Employee No.",                             name: "employeeNo",              type: "text",  required: false },
    { label: "Designation",                              name: "designation",             type: "text",  required: false },
    { label: "Department/Section",                       name: "department",              type: "text",  required: false },
    { label: "Email id",                                 name: "emailId",                type: "text",  required: false },
    { label: "Flat No.",                                 name: "flatNo",                 type: "text",  required: false },
    { label: "Mobile No.",                               name: "mobileNo",               type: "text",  required: false },
    { label: "Name of Domestic Help/Tutor/Driver/Supplier", name: "helperName",          type: "text",  required: true  },
    { label: "Aadhar Card/ Photo Id No.",                name: "helperAadhar",           type: "text",  required: false },
    { label: "Helper Mobile No.",                        name: "helperMobileNo",         type: "text",  required: false },
    { label: "Visible identification mark",              name: "visibleIdentificationMark", type: "text", required: false },
    { label: "Employed as",                              name: "employedAs",             type: "text",  required: false },
    { label: "Campus entry & exit time",                 name: "campusEntryExitTime",    type: "text",  required: false },
  ],
  approvalStages: [],
};

const CC_LDAP_ACCOUNT_REQUEST_TEMPLATE = {
  code: CC_LDAP_ACCOUNT_REQUEST_CODE,
  title: "REQUEST / REQUISITION FORM (For LDAP Account)",
  description: "Computer Center request/requisition form for LDAP account creation (project staff/temporary staff).",
  section: "cc",
  fields: [
    { label: "Emp. ID/Project ID", name: "empIdProjectId", type: "text", required: true },
    { label: "Full Name", name: "fullName", type: "text", required: true },
    { label: "Dept./Section/Centre", name: "department", type: "text", required: true },
    { label: "Phone/Mobile No.", name: "phoneMobileNo", type: "text", required: true },
    { label: "Personal Email-ID", name: "personalEmailId", type: "text", required: true },
    { label: "Address", name: "address", type: "textarea", required: true },
    { label: "IITP Email id (If any)", name: "iitpEmailId", type: "text", required: false },
    { label: "Validity date / Last Date for LDAP account", name: "validityLastDate", type: "date", required: true },
    { label: "Date", name: "requestDate", type: "date", required: true },
  ],
  approvalStages: [],
};

const FINANCE_PROCUREMENT_RECOMMENDATION_SANCTION_TEMPLATE = {
  code: FINANCE_PROCUREMENT_RECOMMENDATION_SANCTION_CODE,
  title: "Recommendation cum Sanction Sheet for Purchase (Double Bid Tendering - INR)",
  description: "Finance procurement recommendation and sanction sheet for purchase through double bid tendering process.",
  section: "fin",
  fields: [
    { label: "Purchase Of", name: "purchaseOf", type: "text", required: true },
    { label: "Date", name: "sheetDate", type: "date", required: true },
    { label: "NIQ/Tender No.", name: "niqTenderNo", type: "text", required: true },
    { label: "NIQ/Tender Date", name: "niqTenderDate", type: "date", required: true },
    { label: "Vendors Responded", name: "vendorsRespondedCount", type: "number", required: true },
    { label: "Price Bids Opened On", name: "priceBidsOpenedOn", type: "date", required: false },
    { label: "Purchase Committee Members", name: "purchaseCommitteeMembers", type: "textarea", required: false },
    { label: "File No.", name: "fileNo", type: "text", required: false },
    { label: "Year of Sanction", name: "yearOfSanction", type: "text", required: false },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Category", name: "category", type: "text", required: false },
    { label: "Vendor Name", name: "vendorName", type: "text", required: true },
    { label: "Vendor Address Line 1", name: "vendorAddressLine1", type: "text", required: false },
    { label: "Vendor Address Line 2", name: "vendorAddressLine2", type: "text", required: false },

    { label: "Item 1 Description", name: "item1Description", type: "text", required: false },
    { label: "Item 1 Rate", name: "item1Rate", type: "text", required: false },
    { label: "Item 1 Quantity", name: "item1Quantity", type: "text", required: false },
    { label: "Item 1 Amount", name: "item1Amount", type: "text", required: false },

    { label: "Item 2 Description", name: "item2Description", type: "text", required: false },
    { label: "Item 2 Rate", name: "item2Rate", type: "text", required: false },
    { label: "Item 2 Quantity", name: "item2Quantity", type: "text", required: false },
    { label: "Item 2 Amount", name: "item2Amount", type: "text", required: false },

    { label: "Item 3 Description", name: "item3Description", type: "text", required: false },
    { label: "Item 3 Rate", name: "item3Rate", type: "text", required: false },
    { label: "Item 3 Quantity", name: "item3Quantity", type: "text", required: false },
    { label: "Item 3 Amount", name: "item3Amount", type: "text", required: false },

    { label: "Item 4 Description", name: "item4Description", type: "text", required: false },
    { label: "Item 4 Rate", name: "item4Rate", type: "text", required: false },
    { label: "Item 4 Quantity", name: "item4Quantity", type: "text", required: false },
    { label: "Item 4 Amount", name: "item4Amount", type: "text", required: false },

    { label: "Item 5 Description", name: "item5Description", type: "text", required: false },
    { label: "Item 5 Rate", name: "item5Rate", type: "text", required: false },
    { label: "Item 5 Quantity", name: "item5Quantity", type: "text", required: false },
    { label: "Item 5 Amount", name: "item5Amount", type: "text", required: false },

    { label: "GST Percentage", name: "gstPercentage", type: "text", required: false },
    { label: "GST Amount", name: "gstAmount", type: "text", required: false },
    { label: "Additional Charge 1 Label", name: "additionalCharge1Label", type: "text", required: false },
    { label: "Additional Charge 1 Amount", name: "additionalCharge1Amount", type: "text", required: false },
    { label: "Additional Charge 2 Label", name: "additionalCharge2Label", type: "text", required: false },
    { label: "Additional Charge 2 Amount", name: "additionalCharge2Amount", type: "text", required: false },
    { label: "Total Amount", name: "totalAmount", type: "text", required: false },

    { label: "Member 1", name: "member1", type: "text", required: false },
    { label: "Member 2", name: "member2", type: "text", required: false },
    { label: "Member 3", name: "member3", type: "text", required: false },
    { label: "Member 4", name: "member4", type: "text", required: false },
  ],
  approvalStages: [],
};

const CC_FACULTY_PERFORMA_TEMPLATE = {
  code: CC_FACULTY_PERFORMA_CODE,
  title: "Computer Center Faculty Performa Form",
  description: "Computer Center faculty performa form for web page.",
  section: "cc",
  fields: [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Photograph", name: "photograph", type: "file", required: false },
    { label: "Designation", name: "designation", type: "text", required: true },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Highest Academic Qualification", name: "highestAcademicQualification", type: "textarea", required: false },
    { label: "Phone (Office)", name: "phoneOffice", type: "text", required: false },
    { label: "IITP Email id", name: "iitpEmailId", type: "email", required: false },
    { label: "Personal Webpage", name: "personalWebpage", type: "text", required: false },
    { label: "Research Areas/Areas of Interest", name: "researchAreas", type: "textarea", required: false },
    { label: "Other Interests", name: "otherInterests", type: "textarea", required: false },
    { label: "Courses taught at IITP", name: "coursesTaught", type: "textarea", required: false },
    { label: "No. of PhD Students", name: "noOfPhDStudents", type: "text", required: false },
    { label: "Professional Experience", name: "professionalExperience", type: "textarea", required: false },
    { label: "Awards & Honours", name: "awardsHonours", type: "textarea", required: false },
    { label: "Member of Professional bodies", name: "memberOfProfessionalBodies", type: "textarea", required: false },
    { label: "Books", name: "books", type: "textarea", required: false },
    { label: "Publications", name: "publications", type: "textarea", required: false },
    { label: "Presentations", name: "presentations", type: "textarea", required: false },
  ],
  approvalStages: [],
};

const CC_FACULTY_DECLARATION_TEMPLATE = {
  code: CC_FACULTY_DECLARATION_CODE,
  title: "IIT Patna Website Faculty Declaration Form",
  description: "Computer Center faculty declaration form for website access.",
  section: "cc",
  fields: [
    { label: "Faculty Name", name: "facultyName", type: "text", required: true },
    { label: "Employee No", name: "employeeNo", type: "text", required: true },
    { label: "Designation", name: "designation", type: "text", required: true },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Faculty Signature", name: "facultySignature", type: "text", required: true },
    { label: "Date", name: "date", type: "date", required: true },
  ],
  approvalStages: [],
};

const CC_EMAIL_ACCOUNT_REQUEST_TEMPLATE = {
  code: CC_EMAIL_ACCOUNT_REQUEST_CODE,
  title: "Computer Center Email Account Request Form",
  description: "Computer Center request form for new email account creation.",
  section: "cc",
  fields: [
    { label: "User Type", name: "userType", type: "radio", required: true, options: ["faculty", "staff", "projectStaff", "student"] },
    { label: "Date", name: "date", type: "date", required: false },
    { label: "Emp. ID/Roll No./Project ID", name: "empIdRollNoProjectId", type: "text", required: true },
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Existing Email", name: "existingEmail", type: "email", required: false },
    { label: "Mobile No", name: "mobileNo", type: "text", required: false },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Ph. No", name: "phNo", type: "text", required: false },
    { label: "Block", name: "block", type: "text", required: false },
    { label: "Floor", name: "floor", type: "text", required: false },
    { label: "Room No", name: "roomNo", type: "text", required: false },
    { label: "Preferred Email Id", name: "preferredEmailId", type: "text", required: false },
    { label: "Email Domain", name: "emailDomain", type: "radio", required: false, options: ["@iitp.ac.in"] },
    { label: "Proxy Account", name: "proxyAccount", type: "text", required: false },
    { label: "Days Limit for trainee/conference", name: "daysLimit", type: "text", required: false },
    { label: "Signature of the Employee/Student", name: "signature", type: "text", required: true },
    { label: "Forwarding Authority Name", name: "forwardingAuthorityName", type: "text", required: false },
    { label: "Forwarding Authority Designation", name: "forwardingAuthorityDesignation", type: "text", required: false },
    { label: "Forwarding Authority Signature", name: "forwardingAuthoritySignature", type: "text", required: false },
  ],
  approvalStages: [],
};

const CC_PROXY_LDAP_REQUEST_TEMPLATE = {
  code: CC_PROXY_LDAP_REQUEST_CODE,
  title: "Computer Center Proxy LDAP Request Form",
  description: "Computer Center request form for proxy LDAP account for trainees/interns.",
  section: "cc",
  fields: [
    { label: "Student Name", name: "studentName", type: "text", required: true },
    { label: "Student Roll No", name: "studentRollNo", type: "text", required: true },
    { label: "Institute/Organization/College Name", name: "instituteName", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Mobile No", name: "mobileNo", type: "text", required: true },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Ph. No", name: "phNo", type: "text", required: false },
    { label: "Address", name: "address", type: "textarea", required: true },
    { label: "Proxy Account", name: "proxyAccount", type: "text", required: true },
    { label: "Last day date", name: "lastDayDate", type: "date", required: true },
    { label: "Guide Name", name: "guideName", type: "text", required: true },
    { label: "Guide Designation", name: "guideDesignation", type: "text", required: true },
    { label: "Guide Department", name: "guideDepartment", type: "text", required: true },
    { label: "Date", name: "date", type: "date", required: true },
    { label: "Place", name: "place", type: "text", required: true },
    { label: "Student Signature", name: "studentSignature", type: "text", required: true },
    { label: "Guide Signature", name: "guideSignature", type: "text", required: true },
  ],
  approvalStages: [],
};

const CC_RD_RECOMMENDATION_GEM_TEMPLATE = {
  code: CC_RD_RECOMMENDATION_GEM_CODE,
  title: "R&D cum CC Recommendation for Direct Purchase through GeM",
  description: "Form No. P002 – Recommendation cum Sanction Sheet for purchase through GeM portal by Local Purchase Committee.",
  section: "cc",
  fields: [
    { label: "Project No. (if applicable)", name: "projectNo", type: "text", required: false },
    { label: "Date", name: "date", type: "date", required: true },
    { label: "Item Being Purchased (short name for title line)", name: "itemDescription", type: "text", required: true },
    { label: "Indent Date", name: "indentDate", type: "date", required: true },
    { label: "Item Name (as in indent)", name: "indentItemName", type: "text", required: true },
    { label: "Row 1 – Sr. No.", name: "srNo_1", type: "text", required: false },
    { label: "Row 1 – Item Description", name: "itemDesc_1", type: "textarea", required: false },
    { label: "Row 1 – Rate (Rs.)", name: "rate_1", type: "text", required: false },
    { label: "Row 1 – Quantity", name: "qty_1", type: "text", required: false },
    { label: "Row 1 – Total Price (Rs.)", name: "totalPrice_1", type: "text", required: false },
    { label: "Row 2 – Sr. No.", name: "srNo_2", type: "text", required: false },
    { label: "Row 2 – Item Description", name: "itemDesc_2", type: "textarea", required: false },
    { label: "Row 2 – Rate (Rs.)", name: "rate_2", type: "text", required: false },
    { label: "Row 2 – Quantity", name: "qty_2", type: "text", required: false },
    { label: "Row 2 – Total Price (Rs.)", name: "totalPrice_2", type: "text", required: false },
    { label: "Total Amount in Words", name: "amountInWords", type: "text", required: true },
    { label: "Name of Item Recommended for Procurement", name: "recommendedItemName", type: "text", required: true },
    { label: "Committee Member 1 – Name & Designation", name: "member1Name", type: "text", required: false },
    { label: "Committee Member 2 – Name & Designation", name: "member2Name", type: "text", required: false },
    { label: "Committee Member 3 – Name & Designation", name: "member3Name", type: "text", required: false },
    { label: "Committee Member 4 – Name & Designation", name: "member4Name", type: "text", required: false },
    { label: "JTS/TS (CC) – Name", name: "jtsName", type: "text", required: false },
    { label: "HoD (CC) – Name", name: "hodCCName", type: "text", required: false },
    { label: "Investigator(s) – Name", name: "investigatorName", type: "text", required: false },
    { label: "AR(R&D) – Name", name: "arRDName", type: "text", required: false },
    { label: "DR(R&D) – Name", name: "drRDName", type: "text", required: false },
    { label: "Associate Dean (R&D) – Name", name: "aDeanRDName", type: "text", required: false },
    { label: "Director – Name", name: "directorName", type: "text", required: false },
  ],
  approvalStages: [],
};


const CC_RD_TWO_BID_GEM_TEMPLATE = {
  code: CC_RD_TWO_BID_GEM_CODE,
  title: "R&D cum CC Recommendation for Two-Bid Purchase through GeM",
  description: "Form No. P004 – Recommendation cum Sanction Sheet for purchase through GeM using Double Bid Tendering process.",
  section: "cc",
  fields: [
    { label: "Project No. (if applicable)", name: "projectNo", type: "text", required: false },
    { label: "Date", name: "date", type: "date", required: true },
    { label: "Purchase Of (item name for title)", name: "purchaseOf", type: "text", required: true },
    { label: "Supply Item Name (for quotation line)", name: "supplyItem", type: "text", required: true },
    { label: "GeM Bid Reference No.", name: "gemBidRef", type: "text", required: true },
    { label: "GeM Bid Date", name: "gemBidDate", type: "date", required: true },
    { label: "Number of Vendors Responded", name: "vendorCount", type: "text", required: true },
    { label: "No. of Technically Satisfied Firms", name: "techFirmsCount", type: "text", required: true },
    { label: "Price Bids Opened On Date", name: "openedOnDate", type: "date", required: true },
    { label: "Annexure No.", name: "annexureNo", type: "text", required: false },
    { label: "Order For Item (committee recommends)", name: "orderForItem", type: "text", required: true },
    { label: "Vendor M/s Name (lowest quoter)", name: "vendorMsName", type: "text", required: true },
    { label: "File No.", name: "fileNo", type: "text", required: false },
    { label: "Year of Sanction", name: "yearOfSanction", type: "text", required: false },
    { label: "Department", name: "department", type: "text", required: true },
    { label: "Category", name: "category", type: "text", required: false },
    { label: "Vendor Label (e.g. Vendor-1:)", name: "vendorLabel", type: "text", required: false },
    { label: "Vendor Name (M/s)", name: "vendorName", type: "text", required: true },
    { label: "Vendor Address Line 1", name: "vendorAddr1", type: "text", required: false },
    { label: "Vendor Address Line 2", name: "vendorAddr2", type: "text", required: false },
    { label: "Item 1 Description", name: "item1Desc", type: "textarea", required: false },
    { label: "Item 1 Rate", name: "item1Rate", type: "text", required: false },
    { label: "Item 1 Quantity", name: "item1Qty", type: "text", required: false },
    { label: "Item 1 Amount", name: "item1Amount", type: "text", required: false },
    { label: "Item 2 Description", name: "item2Desc", type: "textarea", required: false },
    { label: "Item 2 Rate", name: "item2Rate", type: "text", required: false },
    { label: "Item 2 Quantity", name: "item2Qty", type: "text", required: false },
    { label: "Item 2 Amount", name: "item2Amount", type: "text", required: false },
    { label: "Item 3 Description", name: "item3Desc", type: "textarea", required: false },
    { label: "Item 3 Rate", name: "item3Rate", type: "text", required: false },
    { label: "Item 3 Quantity", name: "item3Qty", type: "text", required: false },
    { label: "Item 3 Amount", name: "item3Amount", type: "text", required: false },
    { label: "Extra Row 1 Label", name: "extraRow1Label", type: "text", required: false },
    { label: "Extra Row 1 Amount", name: "extraRow1Amount", type: "text", required: false },
    { label: "Extra Row 2 Label", name: "extraRow2Label", type: "text", required: false },
    { label: "Extra Row 2 Amount", name: "extraRow2Amount", type: "text", required: false },
    { label: "GST Percentage (%)", name: "gstPercent", type: "text", required: false },
    { label: "GST Amount", name: "gstAmount", type: "text", required: false },
    { label: "Total Amount", name: "totalAmount", type: "text", required: true },
    { label: "Committee Member 1 - Name & Designation", name: "member1Name", type: "text", required: false },
    { label: "Committee Member 2 - Name & Designation", name: "member2Name", type: "text", required: false },
    { label: "Committee Member 3 - Name & Designation", name: "member3Name", type: "text", required: false },
    { label: "Committee Member 4 - Name & Designation", name: "member4Name", type: "text", required: false },
    { label: "JTS/TS (CC) - Name", name: "jtsName", type: "text", required: false },
    { label: "HoD (CC) - Name", name: "hodCCName", type: "text", required: false },
    { label: "Investigator(s) - Name", name: "investigatorName", type: "text", required: false },
    { label: "AR(R&D) - Name", name: "arRDName", type: "text", required: false },
    { label: "DR(R&D) - Name", name: "drRDName", type: "text", required: false },
    { label: "Associate Dean (R&D) - Name", name: "aDeanRDName", type: "text", required: false },
    { label: "Director - Name", name: "directorName", type: "text", required: false },
  ],
  approvalStages: [],
};

const getGenAdminTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: GEN_ADMIN_TEMPLATE_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...GEN_ADMIN_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load general administration self declaration template" });
  }
};

const getGenAdminVehicleRequisitionTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: GEN_ADMIN_VEHICLE_REQUISITION_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...GEN_ADMIN_VEHICLE_REQUISITION_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load general administration vehicle requisition template" });
  }
};

const getSecurityCampusLeaveTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: SECURITY_CAMPUS_LEAVE_FEMALE_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...SECURITY_CAMPUS_LEAVE_FEMALE_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load security campus leave template" });
  }
};

const getSecurityDayScholarVehiclePermitTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: SECURITY_DAY_SCHOLAR_VEHICLE_PERMIT_CODE });
    if (!template) {
      template = await FormTemplate.create({
        ...SECURITY_DAY_SCHOLAR_VEHICLE_PERMIT_TEMPLATE,
        createdBy: req.user.id,
      });
    }
    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load security day scholar vehicle permit template" });
  }
};

const getSecurityMessWorkersTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: SECURITY_MESS_WORKERS_CODE });
    if (!template) {
      template = await FormTemplate.create({
        ...SECURITY_MESS_WORKERS_TEMPLATE,
        createdBy: req.user.id,
      });
    }
    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load security mess workers template" });
  }
};

const getSecurityPassRenewalTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: SECURITY_PASS_RENEWAL_CODE });
    if (!template) {
      template = await FormTemplate.create({ ...SECURITY_PASS_RENEWAL_TEMPLATE, createdBy: req.user.id });
    }
    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load security pass renewal template" });
  }
};

const getSecurityEntryPassTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: SECURITY_ENTRY_PASS_CODE });
    if (!template) {
      template = await FormTemplate.create({ ...SECURITY_ENTRY_PASS_TEMPLATE, createdBy: req.user.id });
    }
    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load security entry pass template" });
  }
};

const getSecurityRequisitionForVehicleStickerTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: SECURITY_REQUISITION_FOR_VEHICLE_STICKER_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...SECURITY_REQUISITION_FOR_VEHICLE_STICKER_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load security requisition for vehicle sticker template" });
  }
};

const getSecurityVehicleStickerRequitionForMarriedScholarTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: SECURITY_VEHICLE_STICKER_REQUITION_MARRIED_SCHOLAR_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...SECURITY_VEHICLE_STICKER_REQUITION_MARRIED_SCHOLAR_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load security vehicle sticker requisition template" });
  }
};

const getSecurityUndertakingRegardingWorkerConductAndResponsibilityTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({
      code: SECURITY_UNDERTAKING_REGARDING_WORKER_CONDUCT_AND_RESPONSIBILITY_CODE,
    });

    if (!template) {
      template = await FormTemplate.create({
        ...SECURITY_UNDERTAKING_REGARDING_WORKER_CONDUCT_AND_RESPONSIBILITY_TEMPLATE,
        createdBy: req.user.id,
      });
    } else {
      const currentFields = Array.isArray(template.fields) ? template.fields : [];
      const filteredFields = currentFields.filter((field) => field.name !== "signature");

      if (filteredFields.length !== currentFields.length) {
        template.fields = filteredFields;
        await template.save();
      }
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to load security undertaking regarding worker conduct and responsibility template" });
  }
};

const getComputerCenterLdapAccountRequestTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: CC_LDAP_ACCOUNT_REQUEST_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...CC_LDAP_ACCOUNT_REQUEST_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load computer center LDAP account request template" });
  }
};
const getEstbDepartureRejoiningTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: ESTB_DEPARTURE_REJOINING_CODE });
    if (!template) {
      template = await FormTemplate.create({
        ...ESTB_DEPARTURE_REJOINING_TEMPLATE,
        createdBy: req.user.id,
      });
    }
    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load departure/rejoining template" });
  }
};
const getEstbHouseAllotmentDTypeTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: ESTB_HOUSE_ALLOTMENT_D_TYPE_CODE });
    if (!template) {
      template = await FormTemplate.create({
        ...ESTB_HOUSE_ALLOTMENT_D_TYPE_TEMPLATE,
        createdBy: req.user.id,
      });
    }
    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load house allotment template" });
  }
};

const getFinanceProcurementRecommendationSanctionTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: FINANCE_PROCUREMENT_RECOMMENDATION_SANCTION_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...FINANCE_PROCUREMENT_RECOMMENDATION_SANCTION_TEMPLATE,
        createdBy: req.user.id,
      });
    } else {
      const signatureFieldNames = ["hodName", "registrarName", "directorName"];
      const currentFields = Array.isArray(template.fields) ? template.fields : [];
      const filteredFields = currentFields.filter((field) => !signatureFieldNames.includes(field.name));

      if (filteredFields.length !== currentFields.length) {
        template.fields = filteredFields;
        await template.save();
      }
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load finance procurement recommendation sanction template" });
  }
};

const getComputerCenterFacultyPerformaTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: CC_FACULTY_PERFORMA_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...CC_FACULTY_PERFORMA_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load computer center faculty performa template" });
  }
};

const getComputerCenterFacultyDeclarationTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: CC_FACULTY_DECLARATION_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...CC_FACULTY_DECLARATION_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load computer center faculty declaration template" });
  }
};

const getComputerCenterEmailAccountRequestTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: CC_EMAIL_ACCOUNT_REQUEST_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...CC_EMAIL_ACCOUNT_REQUEST_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load computer center email account request template" });
  }
};

const getComputerCenterProxyLdapRequestTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: CC_PROXY_LDAP_REQUEST_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...CC_PROXY_LDAP_REQUEST_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load computer center proxy LDAP request template" });
  }
};

const getComputerCenterRDRecommendationGeMTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: CC_RD_RECOMMENDATION_GEM_CODE });

    if (!template) {
      template = await FormTemplate.create({
        ...CC_RD_RECOMMENDATION_GEM_TEMPLATE,
        createdBy: req.user.id,
      });
    }

    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load CC R&D recommendation GeM template" });
  }
};


const getComputerCenterRDTwoBidGeMTemplate = async (req, res) => {
  try {
    let template = await FormTemplate.findOne({ code: CC_RD_TWO_BID_GEM_CODE });
    if (!template) {
      template = await FormTemplate.create({ ...CC_RD_TWO_BID_GEM_TEMPLATE, createdBy: req.user.id });
    }
    return res.json(template);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load CC R&D two-bid GeM template" });
  }
};

// @desc Create new form template
const createTemplate = async (req, res) => {
  try {
    const { title, description, fields, approvalStages } = req.body;

    if (!title || !fields || fields.length === 0) {
      return res.status(400).json({ message: "Title and fields required" });
    }

    const template = await FormTemplate.create({
      title,
      description,
      fields,
      approvalStages: Array.isArray(approvalStages) ? approvalStages : [],
      createdBy: req.user.id,
    });

    res.status(201).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create template" });
  }
};

// @desc Get all templates
const getAllTemplates = async (req, res) => {
  try {
    // Ensure Gen Admin template exists
    let genAdminTemplate = await FormTemplate.findOne({ code: GEN_ADMIN_TEMPLATE_CODE });
    if (!genAdminTemplate) {
      genAdminTemplate = await FormTemplate.create({
        ...GEN_ADMIN_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

    // Ensure Security Campus Leave (Female) template exists
    let securityCampusLeaveTemplate = await FormTemplate.findOne({ code: SECURITY_CAMPUS_LEAVE_FEMALE_CODE });
    if (!securityCampusLeaveTemplate) {
      await FormTemplate.create({ ...SECURITY_CAMPUS_LEAVE_FEMALE_TEMPLATE, createdBy: req.user?.id || null });
    }

    // Ensure Security Day Scholar Vehicle Permit template exists
    let securityDsVehicleTemplate = await FormTemplate.findOne({ code: SECURITY_DAY_SCHOLAR_VEHICLE_PERMIT_CODE });
    if (!securityDsVehicleTemplate) {
      await FormTemplate.create({ ...SECURITY_DAY_SCHOLAR_VEHICLE_PERMIT_TEMPLATE, createdBy: req.user?.id || null });
    }

    // Ensure Security Mess Workers template exists
    let securityMessWorkersTemplate = await FormTemplate.findOne({ code: SECURITY_MESS_WORKERS_CODE });
    if (!securityMessWorkersTemplate) {
      await FormTemplate.create({ ...SECURITY_MESS_WORKERS_TEMPLATE, createdBy: req.user?.id || null });
    }

    // Ensure Security Pass Renewal template exists
    let securityPassRenewalTemplate = await FormTemplate.findOne({ code: SECURITY_PASS_RENEWAL_CODE });
    if (!securityPassRenewalTemplate) {
      await FormTemplate.create({ ...SECURITY_PASS_RENEWAL_TEMPLATE, createdBy: req.user?.id || null });
    }

    // Ensure Security Entry Pass template exists
    let securityEntryPassTemplate = await FormTemplate.findOne({ code: SECURITY_ENTRY_PASS_CODE });
    if (!securityEntryPassTemplate) {
      await FormTemplate.create({ ...SECURITY_ENTRY_PASS_TEMPLATE, createdBy: req.user?.id || null });
    }

        // Ensure Security requisition for vehicle sticker template exists
    let securityRequisitionForVehicleStickerTemplate = await FormTemplate.findOne({
      code: SECURITY_REQUISITION_FOR_VEHICLE_STICKER_CODE,
    });
    if (!securityRequisitionForVehicleStickerTemplate) {
      await FormTemplate.create({
        ...SECURITY_REQUISITION_FOR_VEHICLE_STICKER_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

    // Ensure Security vehicle sticker requisition template exists
    let securityVehicleStickerTemplate = await FormTemplate.findOne({
      code: SECURITY_VEHICLE_STICKER_REQUITION_MARRIED_SCHOLAR_CODE,
    });
    if (!securityVehicleStickerTemplate) {
      await FormTemplate.create({
        ...SECURITY_VEHICLE_STICKER_REQUITION_MARRIED_SCHOLAR_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

    // Ensure Security undertaking regarding worker conduct and responsibility template exists
    let securityUndertakingTemplate = await FormTemplate.findOne({
      code: SECURITY_UNDERTAKING_REGARDING_WORKER_CONDUCT_AND_RESPONSIBILITY_CODE,
    });
    if (!securityUndertakingTemplate) {
      await FormTemplate.create({
        ...SECURITY_UNDERTAKING_REGARDING_WORKER_CONDUCT_AND_RESPONSIBILITY_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

        // Ensure Computer Center LDAP account request template exists
    let ccLdapTemplate = await FormTemplate.findOne({ code: CC_LDAP_ACCOUNT_REQUEST_CODE });
    if (!ccLdapTemplate) {
      await FormTemplate.create({
        ...CC_LDAP_ACCOUNT_REQUEST_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }
    let estbDepartureTemplate = await FormTemplate.findOne({ code: ESTB_DEPARTURE_REJOINING_CODE });
    if (!estbDepartureTemplate) {
      await FormTemplate.create({
        ...ESTB_DEPARTURE_REJOINING_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }
    
        // Ensure General Administration vehicle requisition template exists
    let genAdminVehicleRequisitionTemplate = await FormTemplate.findOne({ code: GEN_ADMIN_VEHICLE_REQUISITION_CODE });
    if (!genAdminVehicleRequisitionTemplate) {
      await FormTemplate.create({
        ...GEN_ADMIN_VEHICLE_REQUISITION_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

    // Ensure Finance procurement recommendation sanction template exists
    let financeProcurementRecommendationSanctionTemplate = await FormTemplate.findOne({
      code: FINANCE_PROCUREMENT_RECOMMENDATION_SANCTION_CODE,
    });
    if (!financeProcurementRecommendationSanctionTemplate) {
      await FormTemplate.create({
        ...FINANCE_PROCUREMENT_RECOMMENDATION_SANCTION_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

        // Ensure Computer Center Faculty Performa template exists
    let ccFacultyPerformaTemplate = await FormTemplate.findOne({ code: CC_FACULTY_PERFORMA_CODE });
    if (!ccFacultyPerformaTemplate) {
      await FormTemplate.create({
        ...CC_FACULTY_PERFORMA_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

        // Ensure Computer Center Faculty Declaration template exists
    let ccFacultyDeclarationTemplate = await FormTemplate.findOne({ code: CC_FACULTY_DECLARATION_CODE });
    if (!ccFacultyDeclarationTemplate) {
      await FormTemplate.create({
        ...CC_FACULTY_DECLARATION_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

    // Ensure Computer Center Email Account Request template exists
    let ccEmailAccountRequestTemplate = await FormTemplate.findOne({ code: CC_EMAIL_ACCOUNT_REQUEST_CODE });
    if (!ccEmailAccountRequestTemplate) {
      await FormTemplate.create({
        ...CC_EMAIL_ACCOUNT_REQUEST_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

        // Ensure Computer Center Proxy LDAP Request template exists
    let ccProxyLdapRequestTemplate = await FormTemplate.findOne({ code: CC_PROXY_LDAP_REQUEST_CODE });
    if (!ccProxyLdapRequestTemplate) {
      await FormTemplate.create({
        ...CC_PROXY_LDAP_REQUEST_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

    let ccRdRecommendationGeMTemplate = await FormTemplate.findOne({ code: CC_RD_RECOMMENDATION_GEM_CODE });
    if (!ccRdRecommendationGeMTemplate) {
      await FormTemplate.create({
        ...CC_RD_RECOMMENDATION_GEM_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }

    let ccRdTwoBidGeMTemplate = await FormTemplate.findOne({ code: CC_RD_TWO_BID_GEM_CODE });
    if (!ccRdTwoBidGeMTemplate) {
      await FormTemplate.create({
        ...CC_RD_TWO_BID_GEM_TEMPLATE,
        createdBy: req.user?.id || null,
      });
    }
   let estbHouseAllotmentTemplate = await FormTemplate.findOne({ code: ESTB_HOUSE_ALLOTMENT_D_TYPE_CODE });
if (!estbHouseAllotmentTemplate) {
  await FormTemplate.create({
    ...ESTB_HOUSE_ALLOTMENT_D_TYPE_TEMPLATE,
    createdBy: req.user?.id || null,
  });
}

    const templates = await FormTemplate.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
};

// @desc Get templates created by current user
const getMyTemplates = async (req, res) => {
  try {
    const templates = await FormTemplate.find({
      createdBy: req.user.id, // changed here
    }).sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user templates" });
  }
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getMyTemplates,
  getGenAdminTemplate,
  getGenAdminVehicleRequisitionTemplate,
  getSecurityCampusLeaveTemplate,
  getSecurityDayScholarVehiclePermitTemplate,
  getSecurityMessWorkersTemplate,
  getSecurityPassRenewalTemplate,
  getSecurityEntryPassTemplate,
  getSecurityRequisitionForVehicleStickerTemplate,
  getSecurityVehicleStickerRequitionForMarriedScholarTemplate,
  getSecurityUndertakingRegardingWorkerConductAndResponsibilityTemplate,
  getComputerCenterLdapAccountRequestTemplate,
  getEstbDepartureRejoiningTemplate,
  getEstbHouseAllotmentDTypeTemplate,
  getFinanceProcurementRecommendationSanctionTemplate,
  getComputerCenterFacultyPerformaTemplate,
  getComputerCenterFacultyDeclarationTemplate,
  getComputerCenterEmailAccountRequestTemplate,
  getComputerCenterProxyLdapRequestTemplate,
  getComputerCenterRDRecommendationGeMTemplate,
  getComputerCenterRDTwoBidGeMTemplate,
};
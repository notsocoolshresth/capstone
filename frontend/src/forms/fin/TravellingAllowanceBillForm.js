import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  getErrorMessage,
  prepareSubmissionPayload,
} from "../../utils/formValidation";
import {
  formContainerSx,
  formPaperSx,
  standardInputProps,
  standardInputSx,
  tableFieldSx,
} from "../../utils/formStyles";

const TEMPLATE_SLUG = "/forms/finance-travelling-allowance-bill/template";
const YES_NO_OPTIONS = ["Yes", "No"];
const DEFAULT_JOURNEY_COUNT = 1;
const DEFAULT_LOCAL_COUNT = 1;

const createEmptyJourney = () => ({
  departureStation: "",
  departureDate: "",
  departureTime: "",
  arrivalStation: "",
  arrivalDate: "",
  arrivalTime: "",
  modeOfJourney: "",
  fare: "",
  distanceTravelled: "",
  ticketNosRemarks: "",
});

const createEmptyLocalConveyance = () => ({
  dateFrom: "",
  dateTo: "",
  modeOfJourney: "",
  fare: "",
  voucherAttached: "",
  remarks: "",
});

const createDefaultJourneys = (count = DEFAULT_JOURNEY_COUNT) =>
  Array.from({ length: count }, () => createEmptyJourney());

const createDefaultLocalConveyances = (count = DEFAULT_LOCAL_COUNT) =>
  Array.from({ length: count }, () => createEmptyLocalConveyance());

const sanitizeJourney = (journey = {}) => ({
  departureStation: String(journey.departureStation || ""),
  departureDate: String(journey.departureDate || ""),
  departureTime: String(journey.departureTime || ""),
  arrivalStation: String(journey.arrivalStation || ""),
  arrivalDate: String(journey.arrivalDate || ""),
  arrivalTime: String(journey.arrivalTime || ""),
  modeOfJourney: String(journey.modeOfJourney || ""),
  fare: String(journey.fare || ""),
  distanceTravelled: String(journey.distanceTravelled || ""),
  ticketNosRemarks: String(journey.ticketNosRemarks || ""),
});

const sanitizeLocalConveyance = (row = {}) => ({
  dateFrom: String(row.dateFrom || ""),
  dateTo: String(row.dateTo || ""),
  modeOfJourney: String(row.modeOfJourney || ""),
  fare: String(row.fare || ""),
  voucherAttached: String(row.voucherAttached || ""),
  remarks: String(row.remarks || ""),
});

const hasJourneyContent = (journey) =>
  Object.values(sanitizeJourney(journey)).some((value) => value.trim() !== "");

const hasLocalConveyanceContent = (row) =>
  Object.values(sanitizeLocalConveyance(row)).some((value) => value.trim() !== "");

const initialValues = {
  claimantName: "",
  empNo: "",
  designation: "",
  accountHead: "",
  departmentSection: "",
  bankAccountNo: "",
  gradePay: "",
  contactNo: "",
  ifsc: "",
  journeys: createDefaultJourneys(),
  localConveyances: createDefaultLocalConveyances(),
  registrationFee: "",
  hotelLodgingCharges: "",
  visaFee: "",
  foodCharges: "",
  insurancePremium: "",
  otherCharges: "",
  purposeOfJourney: "",
  totalAmountClaimed: "",
  treatedAsGuest: "",
  freeBoardingLodging: "",
  availedFreeTransport: "",
  claimDate: "",
  advanceTaken: "",
  officeNetAmountClaimed: "",
  officeRailFare: "",
  officeRoadMileage: "",
  officeLocalConveyance: "",
  officeFoodCharges: "",
  officeAccommodationCharges: "",
  officeOtherCharges: "",
  officeTotalAdmissibleAmount: "",
  lessAdvanceDta: "",
  lessAdvanceClaimant: "",
  netAmountWords: "",
};

const normalizePrefillValues = (prefill = {}) => {
  const normalized = {
    ...initialValues,
    journeys: createDefaultJourneys(),
    localConveyances: createDefaultLocalConveyances(),
  };

  Object.keys(initialValues).forEach((key) => {
    if (key === "journeys" || key === "localConveyances") {
      return;
    }
    if (prefill[key] !== undefined && prefill[key] !== null) {
      normalized[key] = prefill[key];
    }
  });

  const incomingJourneys = Array.isArray(prefill.journeys)
    ? prefill.journeys.map((journey) => sanitizeJourney(journey)).filter(hasJourneyContent)
    : [];

  const incomingLocalConveyances = Array.isArray(prefill.localConveyances)
    ? prefill.localConveyances
        .map((row) => sanitizeLocalConveyance(row))
        .filter(hasLocalConveyanceContent)
    : [];

  normalized.journeys =
    incomingJourneys.length >= DEFAULT_JOURNEY_COUNT
      ? incomingJourneys
      : [...incomingJourneys, ...createDefaultJourneys(DEFAULT_JOURNEY_COUNT - incomingJourneys.length)];

  normalized.localConveyances =
    incomingLocalConveyances.length >= DEFAULT_LOCAL_COUNT
      ? incomingLocalConveyances
      : [
          ...incomingLocalConveyances,
          ...createDefaultLocalConveyances(DEFAULT_LOCAL_COUNT - incomingLocalConveyances.length),
        ];

  return normalized;
};

const labelTextSx = {
  fontSize: 14,
  lineHeight: 1.4,
  fontWeight: 600,
};

const sectionTitleSx = {
  fontSize: 15,
  fontWeight: 700,
  mt: 1.5,
  mb: 1,
};

const floatingLabelInputProps = {
  ...standardInputProps,
  InputLabelProps: { shrink: true },
};

const tableHeaderCellSx = {
  borderRight: "1px solid #222",
  borderBottom: "1px solid #222",
  p: 0.6,
  fontWeight: 700,
  fontSize: 11,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  bgcolor: "#fafafa",
};

const tableBodyCellSx = {
  borderRight: "1px solid #222",
  borderBottom: "1px solid #222",
  p: 0.3,
  minHeight: 40,
  display: "flex",
  alignItems: "center",
};

const TravelAllowanceBillForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [templateId, setTemplateId] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const journeys = Array.isArray(values?.journeys) ? values.journeys : createDefaultJourneys();
  const localConveyances = Array.isArray(values?.localConveyances)
    ? values.localConveyances
    : createDefaultLocalConveyances();

  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill && typeof prefill === "object") {
      setValues(normalizePrefillValues(prefill));
    }
  }, [location.state]);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const { data } = await API.get(TEMPLATE_SLUG);
        setTemplateId(data?._id || "");
      } catch {
        setError("Failed to load form template.");
      }
    };

    loadTemplate();
  }, []);

  const canSubmit = useMemo(() => {
    const requiredFields = [
      "claimantName",
      "empNo",
      "designation",
      "departmentSection",
      "purposeOfJourney",
      "claimDate",
    ];

    const hasRequiredFields = requiredFields.every(
      (key) => String(values[key] || "").trim() !== ""
    );

    return hasRequiredFields && journeys.some(hasJourneyContent);
  }, [journeys, values]);

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleChange = (name) => (event) => {
    setFieldValue(name, event.target.value);
  };

  const handleJourneyChange = (index, key) => (event) => {
    const nextValue = event.target.value;
    setValues((prev) => {
      const nextJourneys = [...(Array.isArray(prev.journeys) ? prev.journeys : createDefaultJourneys())];
      nextJourneys[index] = {
        ...sanitizeJourney(nextJourneys[index]),
        [key]: nextValue,
      };
      return { ...prev, journeys: nextJourneys };
    });
    setError("");
    setSuccess("");
  };

  const handleLocalChange = (index, key) => (event) => {
    const nextValue = event.target.value;
    setValues((prev) => {
      const nextRows = [
        ...(Array.isArray(prev.localConveyances)
          ? prev.localConveyances
          : createDefaultLocalConveyances()),
      ];
      nextRows[index] = {
        ...sanitizeLocalConveyance(nextRows[index]),
        [key]: nextValue,
      };
      return { ...prev, localConveyances: nextRows };
    });
    setError("");
    setSuccess("");
  };

  const addJourneyRow = () => {
    setValues((prev) => ({
      ...prev,
      journeys: [
        ...(Array.isArray(prev.journeys) ? prev.journeys : createDefaultJourneys()),
        createEmptyJourney(),
      ],
    }));
  };

  const removeJourneyRow = (indexToRemove) => {
    if (journeys.length <= DEFAULT_JOURNEY_COUNT) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      journeys: (Array.isArray(prev.journeys) ? prev.journeys : createDefaultJourneys()).filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const addLocalRow = () => {
    setValues((prev) => ({
      ...prev,
      localConveyances: [
        ...(Array.isArray(prev.localConveyances)
          ? prev.localConveyances
          : createDefaultLocalConveyances()),
        createEmptyLocalConveyance(),
      ],
    }));
  };

  const removeLocalRow = (indexToRemove) => {
    if (localConveyances.length <= DEFAULT_LOCAL_COUNT) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      localConveyances: (
        Array.isArray(prev.localConveyances)
          ? prev.localConveyances
          : createDefaultLocalConveyances()
      ).filter((_, index) => index !== indexToRemove),
    }));
  };

  const buildSubmissionValues = () => ({
    ...values,
    journeys: journeys.map((journey) => sanitizeJourney(journey)).filter(hasJourneyContent),
    localConveyances: localConveyances
      .map((row) => sanitizeLocalConveyance(row))
      .filter(hasLocalConveyanceContent),
  });

  const submitForm = async () => {
    if (!canSubmit) {
      setError("Please fill the required fields and add at least one journey row.");
      return null;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!templateId) {
        setError("Form template is not ready. Please retry.");
        return null;
      }

      const cleanedValues = buildSubmissionValues();
      const { payload } = await prepareSubmissionPayload({
        templateId,
        templateSlug: TEMPLATE_SLUG,
        responses: cleanedValues,
        parentSubmissionId: location.state?.parentSubmissionId,
      });

      const { data } = await API.post("/submissions", payload);
      setSubmissionId(data._id);
      setSuccess("Form submitted successfully. It is visible in My Submissions.");
      return data._id;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save form."));
      return null;
    } finally {
      setSaving(false);
    }
  };

  const openPdf = async () => {
    let id = submissionId;

    if (!id) {
      id = await submitForm();
      if (!id) return;
    }

    setPdfLoading(true);
    setError("");

    try {
      const response = await API.get(`/submissions/${id}/pdf`, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setSuccess("PDF opened in new tab. Use browser print to print it.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={formContainerSx}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Typography variant="h5" fontWeight={700}>
          Travelling Allowance Bill
        </Typography>
        <Button variant="text" onClick={() => navigate("/forms")}>
          Back to Forms
        </Button>
      </Box>

      <Paper sx={formPaperSx}>
        <Typography align="center" fontWeight={700} sx={{ fontSize: 18 }}>
          INDIAN INSTITUTE OF TECHNOLOGY PATNA
        </Typography>
        <Typography align="center" fontWeight={700} sx={{ fontSize: 16, mt: 0.8 }}>
          TRAVELLING ALLOWANCE BILL
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ fontSize: 14, mt: 0.4 }}>
          Official Visit / Seminar & Conference Attended
        </Typography>

        <Typography sx={sectionTitleSx}>Claimant Details</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 1.75,
          }}
        >
          <TextField
            label="Name"
            value={values.claimantName}
            onChange={handleChange("claimantName")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Emp No."
            value={values.empNo}
            onChange={handleChange("empNo")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Designation"
            value={values.designation}
            onChange={handleChange("designation")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Account Head"
            value={values.accountHead}
            onChange={handleChange("accountHead")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Department / Section"
            value={values.departmentSection}
            onChange={handleChange("departmentSection")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Bank Account No."
            value={values.bankAccountNo}
            onChange={handleChange("bankAccountNo")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Grade Pay"
            value={values.gradePay}
            onChange={handleChange("gradePay")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Contact No."
            value={values.contactNo}
            onChange={handleChange("contactNo")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="IFSC"
            value={values.ifsc}
            onChange={handleChange("ifsc")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
          <TextField
            label="Date"
            type="date"
            value={values.claimDate}
            onChange={handleChange("claimDate")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Typography sx={sectionTitleSx}>1. Particulars of Journey (From Station to Station)</Typography>
        <Box sx={{ overflowX: "auto", border: "1px solid #222" }}>
          <Box
            sx={{
              minWidth: 1120,
              display: "grid",
              gridTemplateColumns: "60px 1.1fr 0.85fr 0.8fr 1.1fr 0.85fr 0.8fr 1fr 0.85fr 0.95fr 1.4fr",
            }}
          >
            <Box sx={tableHeaderCellSx}>Sl. No.</Box>
            <Box sx={tableHeaderCellSx}>Departure Station</Box>
            <Box sx={tableHeaderCellSx}>Date</Box>
            <Box sx={tableHeaderCellSx}>Time</Box>
            <Box sx={tableHeaderCellSx}>Arrival Station</Box>
            <Box sx={tableHeaderCellSx}>Date</Box>
            <Box sx={tableHeaderCellSx}>Time</Box>
            <Box sx={tableHeaderCellSx}>Mode</Box>
            <Box sx={tableHeaderCellSx}>Fare (Rs.)</Box>
            <Box sx={tableHeaderCellSx}>Distance (km)</Box>
            <Box sx={{ ...tableHeaderCellSx, borderRight: "none" }}>Ticket Nos. / Remarks</Box>

            {journeys.map((journey, index) => (
              <React.Fragment key={`journey-${index}`}>
                <Box sx={{ ...tableBodyCellSx, justifyContent: "space-between", fontSize: 12 }}>
                  <Box sx={{ pl: 0.5 }}>{index + 1}.</Box>
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={() => removeJourneyRow(index)}
                    disabled={journeys.length <= DEFAULT_JOURNEY_COUNT}
                    sx={{ minWidth: 36, px: 0.5, fontSize: 11 }}
                  >
                    Del
                  </Button>
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField value={journey.departureStation} onChange={handleJourneyChange(index, "departureStation")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField type="date" value={journey.departureDate} onChange={handleJourneyChange(index, "departureDate")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField type="time" value={journey.departureTime} onChange={handleJourneyChange(index, "departureTime")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField value={journey.arrivalStation} onChange={handleJourneyChange(index, "arrivalStation")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField type="date" value={journey.arrivalDate} onChange={handleJourneyChange(index, "arrivalDate")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField type="time" value={journey.arrivalTime} onChange={handleJourneyChange(index, "arrivalTime")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField value={journey.modeOfJourney} onChange={handleJourneyChange(index, "modeOfJourney")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField value={journey.fare} onChange={handleJourneyChange(index, "fare")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField value={journey.distanceTravelled} onChange={handleJourneyChange(index, "distanceTravelled")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={{ ...tableBodyCellSx, borderRight: "none" }}>
                  <TextField value={journey.ticketNosRemarks} onChange={handleJourneyChange(index, "ticketNosRemarks")} sx={tableFieldSx} fullWidth />
                </Box>
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Box sx={{ mt: 1.2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" size="small" onClick={addJourneyRow}>
            Add Journey Row
          </Button>
        </Box>

        <Typography sx={sectionTitleSx}>2. Particulars of Local Conveyance Used</Typography>
        <Box sx={{ overflowX: "auto", border: "1px solid #222" }}>
          <Box
            sx={{
              minWidth: 820,
              display: "grid",
              gridTemplateColumns: "60px 0.95fr 0.95fr 1.1fr 0.9fr 1fr 1.6fr",
            }}
          >
            <Box sx={tableHeaderCellSx}>Sl. No.</Box>
            <Box sx={tableHeaderCellSx}>From</Box>
            <Box sx={tableHeaderCellSx}>To</Box>
            <Box sx={tableHeaderCellSx}>Mode</Box>
            <Box sx={tableHeaderCellSx}>Fare (Rs.)</Box>
            <Box sx={tableHeaderCellSx}>Voucher Attached</Box>
            <Box sx={{ ...tableHeaderCellSx, borderRight: "none" }}>Remarks</Box>

            {localConveyances.map((row, index) => (
              <React.Fragment key={`local-${index}`}>
                <Box sx={{ ...tableBodyCellSx, justifyContent: "space-between", fontSize: 12 }}>
                  <Box sx={{ pl: 0.5 }}>{index + 1}.</Box>
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={() => removeLocalRow(index)}
                    disabled={localConveyances.length <= DEFAULT_LOCAL_COUNT}
                    sx={{ minWidth: 36, px: 0.5, fontSize: 11 }}
                  >
                    Del
                  </Button>
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField type="date" value={row.dateFrom} onChange={handleLocalChange(index, "dateFrom")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField type="date" value={row.dateTo} onChange={handleLocalChange(index, "dateTo")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField value={row.modeOfJourney} onChange={handleLocalChange(index, "modeOfJourney")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField value={row.fare} onChange={handleLocalChange(index, "fare")} sx={tableFieldSx} fullWidth />
                </Box>
                <Box sx={tableBodyCellSx}>
                  <TextField select value={row.voucherAttached} onChange={handleLocalChange(index, "voucherAttached")} sx={tableFieldSx} fullWidth>
                    <MenuItem value="">Select</MenuItem>
                    {YES_NO_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box sx={{ ...tableBodyCellSx, borderRight: "none" }}>
                  <TextField value={row.remarks} onChange={handleLocalChange(index, "remarks")} sx={tableFieldSx} fullWidth />
                </Box>
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Box sx={{ mt: 1.2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" size="small" onClick={addLocalRow}>
            Add Local Row
          </Button>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Typography sx={sectionTitleSx}>3. Other Expenses</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.75 }}>
          <TextField label="Registration Fee" value={values.registrationFee} onChange={handleChange("registrationFee")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Hotel / Lodging Charges" value={values.hotelLodgingCharges} onChange={handleChange("hotelLodgingCharges")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="VISA Fee" value={values.visaFee} onChange={handleChange("visaFee")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Food Charges" value={values.foodCharges} onChange={handleChange("foodCharges")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Insurance Premium" value={values.insurancePremium} onChange={handleChange("insurancePremium")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Other Charges" value={values.otherCharges} onChange={handleChange("otherCharges")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField
            label="Total Amount Claimed (in Rs.)"
            value={values.totalAmountClaimed}
            onChange={handleChange("totalAmountClaimed")}
            sx={standardInputSx}
            {...floatingLabelInputProps}
          />
        </Box>

        <Typography sx={sectionTitleSx}>4. Purpose of Journey</Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={values.purposeOfJourney}
          onChange={handleChange("purposeOfJourney")}
          placeholder="Describe the purpose of the journey"
        />

        <Typography sx={sectionTitleSx}>Declaration</Typography>
        <Typography sx={{ ...labelTextSx, fontWeight: 400, mb: 1.2 }}>
          I certify that the journeys were performed for official work and the claims mentioned in this bill have neither been preferred nor paid from any other source.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 1.75 }}>
          <TextField select label="Treated as Guest" value={values.treatedAsGuest} onChange={handleChange("treatedAsGuest")} sx={standardInputSx} {...floatingLabelInputProps}>
            <MenuItem value="">Select</MenuItem>
            {YES_NO_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Free Boarding / Lodging" value={values.freeBoardingLodging} onChange={handleChange("freeBoardingLodging")} sx={standardInputSx} {...floatingLabelInputProps}>
            <MenuItem value="">Select</MenuItem>
            {YES_NO_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Availed Free Transport" value={values.availedFreeTransport} onChange={handleChange("availedFreeTransport")} sx={standardInputSx} {...floatingLabelInputProps}>
            <MenuItem value="">Select</MenuItem>
            {YES_NO_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Typography sx={sectionTitleSx}>For Office Use Only (Finance & Accounts)</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.75 }}>
          <TextField label="Advance Taken (in Rs.)" value={values.advanceTaken} onChange={handleChange("advanceTaken")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Net Amount Claimed (in Rs.)" value={values.officeNetAmountClaimed} onChange={handleChange("officeNetAmountClaimed")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Rail / Air / Bus Fare (in Rs.)" value={values.officeRailFare} onChange={handleChange("officeRailFare")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Road Mileages (in Rs.)" value={values.officeRoadMileage} onChange={handleChange("officeRoadMileage")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Local Conveyance (in Rs.)" value={values.officeLocalConveyance} onChange={handleChange("officeLocalConveyance")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Food Charges (in Rs.)" value={values.officeFoodCharges} onChange={handleChange("officeFoodCharges")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Accommodation Charges (in Rs.)" value={values.officeAccommodationCharges} onChange={handleChange("officeAccommodationCharges")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Other Charges (in Rs.)" value={values.officeOtherCharges} onChange={handleChange("officeOtherCharges")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Total Admissible Amount (in Rs.)" value={values.officeTotalAdmissibleAmount} onChange={handleChange("officeTotalAdmissibleAmount")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Less: Advance Paid to DTA" value={values.lessAdvanceDta} onChange={handleChange("lessAdvanceDta")} sx={standardInputSx} {...floatingLabelInputProps} />
          <TextField label="Less: Paid to Claimant" value={values.lessAdvanceClaimant} onChange={handleChange("lessAdvanceClaimant")} sx={standardInputSx} {...floatingLabelInputProps} />
        </Box>

        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Net Amount (Rupees)"
          value={values.netAmountWords}
          onChange={handleChange("netAmountWords")}
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={submitForm} disabled={saving || pdfLoading}>
            {saving ? <CircularProgress size={18} /> : "Save Form"}
          </Button>
          <Button variant="contained" onClick={openPdf} disabled={saving || pdfLoading}>
            {pdfLoading ? <CircularProgress color="inherit" size={18} /> : "Open PDF / Print"}
          </Button>
        </Box>
      </Paper>

      {submissionId && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="text" onClick={() => navigate("/submissions")}>
            Go to My Submissions
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default TravelAllowanceBillForm;

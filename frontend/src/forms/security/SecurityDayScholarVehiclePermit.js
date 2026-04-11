import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Divider,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

const TEMPLATE_SLUG = "/forms/security-day-scholar-vehicle-permit/template";

const initialValues = {
  // Day Scholar Details
  nameRollNumber: "",
  mobileNumber: "",
  instituteEmail: "",
  department: "",
  // Vehicle Details
  ownerName: "",
  ownerRelationship: "",
  vehicleRegNo: "",
  engineNumber: "",
  chassisNumber: "",
  vehicleType: "",
  // Residential Address
  residentialAddress: "",
};

// ── Shared sx — module-level so identity is stable across re-renders ─────────
const lineInputSx = {
  "& .MuiInputBase-input": {
    pb: 0,
    pt: "1px",
    fontSize: 15,
    lineHeight: 1.4,
  },
  "& .MuiInput-underline:before": { borderBottomColor: "#222" },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "#222" },
};

const inlineField = {
  variant: "standard",
  size: "small",
  InputLabelProps: { shrink: false },
};

// ── Helper components must be MODULE-LEVEL to avoid focus loss on re-render ──
const InlineField = ({ label, fieldName, placeholder, minWidth = 180, flex, values, onChange }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 1, mt: 1.5 }}>
    <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{label}</Typography>
    <TextField
      value={values[fieldName]}
      onChange={onChange(fieldName)}
      placeholder={placeholder || ""}
      sx={{ ...lineInputSx, minWidth, flex: flex || 1 }}
      {...inlineField}
    />
  </Box>
);

const InlinePairField = ({
  label1, fieldName1, placeholder1,
  label2, fieldName2, placeholder2,
  values, onChange,
}) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 1, mt: 1.5 }}>
    <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{label1}</Typography>
    <TextField
      value={values[fieldName1]}
      onChange={onChange(fieldName1)}
      placeholder={placeholder1 || ""}
      sx={{ ...lineInputSx, minWidth: 160, flex: 1 }}
      {...inlineField}
    />
    <Typography sx={{ fontSize: 15, fontWeight: 700 }}>&amp; {label2}</Typography>
    <TextField
      value={values[fieldName2]}
      onChange={onChange(fieldName2)}
      placeholder={placeholder2 || ""}
      sx={{ ...lineInputSx, minWidth: 160, flex: 1 }}
      {...inlineField}
    />
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────

const SecurityDayScholarVehiclePermit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [values, setValues]         = useState(initialValues);
  const [saving, setSaving]         = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  React.useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill && typeof prefill === "object") {
      setValues((prev) => ({ ...prev, ...prefill }));
    }
  }, [location.state]);

  React.useEffect(() => {
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
    const required = ["nameRollNumber", "mobileNumber", "department", "ownerName", "vehicleRegNo", "vehicleType", "residentialAddress"];
    return required.every((k) => String(values[k]).trim() !== "");
  }, [values]);

  const handleChange = (name) => (event) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    setError("");
    setSuccess("");
  };

  const submitForm = async () => {
    if (!canSubmit) {
      setError("Please fill in all required fields before submitting.");
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
      const payload = { templateId, responses: values };
      if (location.state?.parentSubmissionId) {
        payload.parentSubmissionId = location.state.parentSubmissionId;
      }
      const { data } = await API.post("/submissions", payload);
      setSubmissionId(data._id);
      setSuccess("Form submitted successfully. It is visible in My Submissions.");
      return data._id;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save form.");
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
      const response = await API.get(`/submissions/${id}/pdf`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setSuccess("PDF opened in new tab. Use browser print to print it.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Top nav */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Day Scholar Vehicle Permit &amp; Parking Permission
        </Typography>
        <Button variant="text" onClick={() => navigate("/forms")}>
          Back to Forms
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, border: "1px solid #d8d8d8" }}>
        {/* ── Title ── */}
        <Typography
          align="center"
          sx={{ fontWeight: 700, fontSize: 14, mb: 3, letterSpacing: 0.3 }}
        >
          IIT PATNA – DAY SCHOLAR VEHICLE PERMIT &amp; PARKING PERMISSION FORM
        </Typography>

        {/* ── Day Scholar Details ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5 }}>
          Day Scholar Details:
        </Typography>

        <InlineField
          label="1. Name &amp; Roll Number:"
          fieldName="nameRollNumber"
          placeholder="Full name and roll number"
          values={values}
          onChange={handleChange}
        />

        <InlinePairField
          label1="2. Mobile Number:"
          fieldName1="mobileNumber"
          placeholder1="mobile number"
          label2="Institute Email:"
          fieldName2="instituteEmail"
          placeholder2="@iitp.ac.in"
          values={values}
          onChange={handleChange}
        />

        <InlineField
          label="3. Department:"
          fieldName="department"
          placeholder="department name"
          values={values}
          onChange={handleChange}
        />

        <Divider sx={{ my: 2.5 }} />

        {/* ── Vehicle Details ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5 }}>
          Vehicle Details
        </Typography>

        <InlineField
          label="1. Owner Name:"
          fieldName="ownerName"
          placeholder="vehicle owner name"
          values={values}
          onChange={handleChange}
        />

        <InlineField
          label="2. Relationship (if not owned by student):"
          fieldName="ownerRelationship"
          placeholder="e.g. Father, Mother"
          values={values}
          onChange={handleChange}
        />

        <InlineField
          label="3. Vehicle Registration Number (RC):"
          fieldName="vehicleRegNo"
          placeholder="e.g. BR01AB1234"
          values={values}
          onChange={handleChange}
        />

        <InlinePairField
          label1="4. Engine Number:"
          fieldName1="engineNumber"
          placeholder1="engine number"
          label2="Chassis Number:"
          fieldName2="chassisNumber"
          placeholder2="chassis number"
          values={values}
          onChange={handleChange}
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 1, mt: 1.5 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
            5. Type of Vehicle:
          </Typography>
          <TextField
            select
            value={values.vehicleType}
            onChange={handleChange("vehicleType")}
            sx={{ ...lineInputSx, minWidth: 200 }}
            {...inlineField}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled><em>Select type</em></MenuItem>
            <MenuItem value="Car">Car</MenuItem>
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Scooter">Scooter</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Residential Address ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}>
          Residential Address (Daily Commute From):
        </Typography>
        <TextField
          value={values.residentialAddress}
          onChange={handleChange("residentialAddress")}
          placeholder="Full residential address..."
          multiline
          rows={3}
          fullWidth
          variant="standard"
          size="small"
          sx={{
            "& .MuiInputBase-input": { fontSize: 15, pb: 0 },
            "& .MuiInput-underline:before": { borderBottomColor: "#222" },
          }}
        />

        <Divider sx={{ my: 3 }} />

        {/* ── Undertaking ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>
          Undertaking by the Student
        </Typography>
        <Typography sx={{ fontSize: 13, textAlign: "justify", lineHeight: 1.8 }}>
          I hereby declare that the above-mentioned vehicle will be used exclusively for commuting between my
          residence and the IIT Patna campus. I agree to park my vehicle only at the{" "}
          <strong>designated parking area adjacent to Block-IX,</strong> allocated by IIT Patna for Day Scholars.
          For commuting within the campus, I will use other permissible modes of conveyance as per institute
          guidelines. Violation of the parking or conveyance rules will result a penalty as per the Office Order
          IITP/R/OO/2023/1527.
        </Typography>

        <Typography sx={{ fontSize: 13, mt: 1.5, mb: 0.5 }}>
          I have enclosed the following self-attested documents:
        </Typography>
        <Typography sx={{ fontSize: 13, ml: 2 }}>1.&nbsp;&nbsp;Copy of Registration Certificate (RC) of the vehicle</Typography>
        <Typography sx={{ fontSize: 13, ml: 2 }}>2.&nbsp;&nbsp;Copy of Driving Licence</Typography>
        <Typography sx={{ fontSize: 13, ml: 2 }}>3.&nbsp;&nbsp;Copy of IIT Patna Identity Card</Typography>

        {/* Student signature row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
            Signature of the Day Scholar: ………………………..
          </Typography>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
            Date: ………………………
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ── Supervisor/PI Certification ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
          Supervisor/PI Certification
        </Typography>
        <Typography sx={{ fontSize: 13, mt: 0.5 }}>
          I hereby certify that the above student is a day scholar and is not residing in any hostel of IIT Patna.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
            Name &amp; Signature of Supervisor/PI………………………..
          </Typography>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
            Date: ………………………
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderWidth: 2 }} />

        {/* ── Verification by Dean's Office ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
          Verification by Office of the Dean of Student Affairs
        </Typography>
        <Typography sx={{ fontSize: 13, mt: 0.5 }}>
          This is to confirm that the details provided above have been checked, verified and found correct.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
            Verified by (Seal and Signature) ………………………..
          </Typography>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
            Date: ………………………
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ── For Office Use Only ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 3 }}>
          For Office Use Only
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
              Security Officer
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", color: "text.secondary" }}>
            PIC Security
          </Typography>
        </Box>

        {/* ── Status messages ── */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>
        )}

        {/* ── Action Buttons ── */}
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

export default SecurityDayScholarVehiclePermit;

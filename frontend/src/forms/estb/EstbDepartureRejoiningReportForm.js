import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  getErrorMessage,
  prepareSubmissionPayload,
} from "../../utils/formValidation";

const TEMPLATE_SLUG = "/forms/estb-departure-rejoining-report/template";

const initialValues = {
  // Departure Report
  departureFromDate: "",
  departureFnAn: "",
  departureOutOfStationTill: "",
  departureAddress: "",
  departureContactPhone: "",
  departureDate: "",
  departureName: "",
  departureEmpNo: "",
  departureDesignation: "",
  departureDepartment: "",

  // Re-joining Report
  rejoiningDate: "",
  rejoiningFnAn: "",
  rejoiningLeaveFrom: "",
  rejoiningLeaveTo: "",
  rejoiningSignDate: "",
  rejoiningName: "",
  rejoiningEmpNo: "",
  rejoiningDesignation: "",
  rejoiningDepartment: "",
};

const underlineFieldSx = {
  flex: 1,
  "& .MuiInputBase-root": { fontSize: 13 },
  "& .MuiInputBase-input": { py: 0.2, px: 0.5 },
  "& .MuiInput-underline:before": { borderBottomColor: "#333" },
  "& .MuiInput-underline:after": { borderBottomColor: "#333" },
};

const EstbDepartureRejoiningReportForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    return ["departureName", "departureEmpNo", "rejoiningName"].every(
      (k) => String(values[k]).trim() !== ""
    );
  }, [values]);

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
    setError(""); setSuccess("");
  };

  const submitForm = async () => {
    if (!canSubmit) { setError("Please fill in required fields."); return null; }
    setSaving(true); setError(""); setSuccess("");
    try {
      if (!templateId) { setError("Form template is not ready. Please retry."); return null; }
      const { payload } = await prepareSubmissionPayload({
        templateId,
        templateSlug: TEMPLATE_SLUG,
        responses: values,
        parentSubmissionId: location.state?.parentSubmissionId,
      });
      const { data } = await API.post("/submissions", payload);
      setSubmissionId(data._id);
      setSuccess("Form submitted successfully. It is visible in My Submissions.");
      return data._id;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save form."));
      return null;
    } finally { setSaving(false); }
  };

  const openPdf = async () => {
    let id = submissionId;
    if (!id) { id = await submitForm(); if (!id) return; }
    setPdfLoading(true); setError("");
    try {
      const response = await API.get(`/submissions/${id}/pdf`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setSuccess("PDF opened in new tab. Use browser print to print it.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate PDF.");
    } finally { setPdfLoading(false); }
  };

  // Reusable inline field with underline
  const InlineField = ({ value, name, width = 160 }) => (
    <TextField
      variant="standard"
      value={value}
      onChange={handleChange(name)}
      sx={{ ...underlineFieldSx, width }}
    />
  );

  const sectionHeaderSx = {
    border: "1.5px solid #222",
    borderRadius: 0,
    p: { xs: 2, md: 3 },
    mb: 3,
    position: "relative",
  };

  const HeaderBlock = ({ title }) => (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      {/* Logo + Hindi + English */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 0.5 }}>
        <Box
          component="img"
          src="/iitp-logo.png"
          alt="IITP Logo"
          sx={{ width: 52, height: 52, objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <Box>
          <Typography sx={{ fontSize: 13, fontFamily: "serif", color: "#222" }}>
            भारतीय प्रौद्योगिकी संस्थान पटना
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.3 }}>
            INDIAN INSTITUTE OF TECHNOLOGY PATNA
          </Typography>
        </Box>
      </Box>
      <Typography sx={{
        fontSize: 14, fontWeight: 800, textDecoration: "underline",
        fontVariant: "small-caps", letterSpacing: 0.5,
      }}>
        {title}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Departure &amp; Re-joining Report</Typography>
        <Button variant="text" onClick={() => navigate("/forms")}>Back to Forms</Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, border: "1px solid #d8d8d8" }}>

        {/* ── DEPARTURE REPORT ── */}
        <Box sx={sectionHeaderSx}>
          <HeaderBlock title="Departure Report" />

          <Typography sx={{ fontSize: 13, mb: 1 }}>
            This is to inform you that I am proceeding on station leave w.e.f.{" "}
            <InlineField value={values.departureFromDate} name="departureFromDate" width={180} />
            {" "}(FN / AN){" "}
            <InlineField value={values.departureFnAn} name="departureFnAn" width={60} />
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: 13, whiteSpace: "nowrap" }}>and will be out of station till</Typography>
            <InlineField value={values.departureOutOfStationTill} name="departureOutOfStationTill" width={220} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontSize: 13, whiteSpace: "nowrap" }}>Address during leave:</Typography>
            <InlineField value={values.departureAddress} name="departureAddress" width={380} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 2 }}>
            <InlineField value={values.departureAddress} name="departureAddress" width={240} />
            <Typography sx={{ fontSize: 13, whiteSpace: "nowrap" }}>Contact Phone No. (if any)</Typography>
            <InlineField value={values.departureContactPhone} name="departureContactPhone" width={160} />
          </Box>

          <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Date:</Typography>
              <TextField type="date" variant="standard" value={values.departureDate}
                onChange={handleChange("departureDate")}
                sx={{ ...underlineFieldSx, width: 150 }} InputLabelProps={{ shrink: true }} />
            </Box>
            <Box sx={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13, whiteSpace: "nowrap" }}>Signature of the employee:</Typography>
              <Box sx={{ flex: 1, borderBottom: "1px solid #333", minWidth: 180 }} />
            </Box>
          </Box>

          <Box sx={{ ml: "25%", display: "flex", flexDirection: "column", gap: 0.8 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Name:</Typography>
              <InlineField value={values.departureName} name="departureName" width={200} />
              <Typography sx={{ fontSize: 13 }}>Emp. No.:</Typography>
              <InlineField value={values.departureEmpNo} name="departureEmpNo" width={100} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Designation:</Typography>
              <InlineField value={values.departureDesignation} name="departureDesignation" width={280} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Department /Section:</Typography>
              <InlineField value={values.departureDepartment} name="departureDepartment" width={240} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, mb: 1 }}>
            <Typography sx={{ fontSize: 12 }}>Signature of the Coordinator /HOD</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>To</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, ml: 2 }}>Administration</Typography>
            </Box>
            <Typography sx={{ fontSize: 12 }}>Signature of the HOS/Registrar/Dean/Director</Typography>
          </Box>
        </Box>

        {/* Dashed separator */}
        <Box sx={{ borderTop: "2px dashed #aaa", my: 2 }} />

        {/* ── RE-JOINING REPORT ── */}
        <Box sx={sectionHeaderSx}>
          <HeaderBlock title="Re-joining Report" />

          <Typography sx={{ fontSize: 13, mb: 1 }}>
            This is to inform you that I have re-joined duty on{" "}
            <InlineField value={values.rejoiningDate} name="rejoiningDate" width={160} />
            {" "}(FN/ AN){" "}
            <InlineField value={values.rejoiningFnAn} name="rejoiningFnAn" width={60} />
            {" "}after availing leave
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: 13 }}>from</Typography>
            <InlineField value={values.rejoiningLeaveFrom} name="rejoiningLeaveFrom" width={130} />
            <Typography sx={{ fontSize: 13 }}>to</Typography>
            <InlineField value={values.rejoiningLeaveTo} name="rejoiningLeaveTo" width={130} />
          </Box>

          <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Date.:</Typography>
              <TextField type="date" variant="standard" value={values.rejoiningSignDate}
                onChange={handleChange("rejoiningSignDate")}
                sx={{ ...underlineFieldSx, width: 150 }} InputLabelProps={{ shrink: true }} />
            </Box>
            <Box sx={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13, whiteSpace: "nowrap" }}>Signature of the employee:</Typography>
              <Box sx={{ flex: 1, borderBottom: "1px solid #333", minWidth: 180 }} />
            </Box>
          </Box>

          <Box sx={{ ml: "25%", display: "flex", flexDirection: "column", gap: 0.8 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Name:</Typography>
              <InlineField value={values.rejoiningName} name="rejoiningName" width={200} />
              <Typography sx={{ fontSize: 13 }}>Emp. No.:</Typography>
              <InlineField value={values.rejoiningEmpNo} name="rejoiningEmpNo" width={100} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Designation:</Typography>
              <InlineField value={values.rejoiningDesignation} name="rejoiningDesignation" width={280} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <Typography sx={{ fontSize: 13 }}>Department/ Section:</Typography>
              <InlineField value={values.rejoiningDepartment} name="rejoiningDepartment" width={240} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, mb: 1 }}>
            <Typography sx={{ fontSize: 12 }}>Signature of the Coordinator /HOD</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>To</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, ml: 2 }}>Administration</Typography>
            </Box>
            <Typography sx={{ fontSize: 12 }}>Signature of the HOS/Registrar/Dean/Director</Typography>
          </Box>
        </Box>

        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={submitForm} disabled={saving || pdfLoading}>
            {saving ? <CircularProgress size={18} /> : "Save Form"}
          </Button>
          <Button variant="contained" onClick={openPdf} disabled={saving || pdfLoading}>
            {pdfLoading ? <CircularProgress color="inherit" size={18} /> : "Open PDF / Print"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EstbDepartureRejoiningReportForm;

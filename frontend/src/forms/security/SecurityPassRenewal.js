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
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

const TEMPLATE_SLUG = "/forms/security-pass-renewal/template";

const initialValues = {
  applicantName: "",
  date: "",
  flatNo: "",
  mobileNo: "",
  passNumber: "",
  passHolderNameMobile: "",
};

// ── Shared sx — module-level so identity is stable across re-renders ─────────
const lineInputSx = {
  "& .MuiInputBase-input": { pb: 0, pt: "1px", fontSize: 14, lineHeight: 1.4 },
  "& .MuiInput-underline:before": { borderBottomColor: "#222" },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "#222" },
};

const inlineField = { variant: "standard", size: "small", InputLabelProps: { shrink: false } };

// ── InlineField must be module-level to avoid focus loss on re-render ─────────
const InlineField = ({ label, fieldName, placeholder, minWidth = 160, flex, sublabel, values, onChange }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 0.5 }}>
    {label && (
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{label}</Typography>
        {sublabel && <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{sublabel}</Typography>}
      </Box>
    )}
    <TextField
      value={values[fieldName]}
      onChange={onChange(fieldName)}
      placeholder={placeholder || ""}
      sx={{ ...lineInputSx, minWidth, flex: flex || 1 }}
      {...inlineField}
    />
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────

const SecurityPassRenewal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [values, setValues]             = useState(initialValues);
  const [saving, setSaving]             = useState(false);
  const [pdfLoading, setPdfLoading]     = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [templateId, setTemplateId]     = useState("");
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");

  React.useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill && typeof prefill === "object") setValues((p) => ({ ...p, ...prefill }));
  }, [location.state]);

  React.useEffect(() => {
    API.get(TEMPLATE_SLUG)
      .then(({ data }) => setTemplateId(data?._id || ""))
      .catch(() => setError("Failed to load form template."));
  }, []);

  const canSubmit = useMemo(() => {
    return ["applicantName", "passNumber"].every((k) => String(values[k]).trim() !== "");
  }, [values]);

  const handleChange = (name) => (event) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    setError("");
    setSuccess("");
  };

  const submitForm = async () => {
    if (!canSubmit) { setError("Please fill Applicant Name and Pass Number at minimum."); return null; }
    setSaving(true); setError(""); setSuccess("");
    try {
      if (!templateId) { setError("Form template not ready."); return null; }
      const payload = { templateId, responses: values };
      if (location.state?.parentSubmissionId) payload.parentSubmissionId = location.state.parentSubmissionId;
      const { data } = await API.post("/submissions", payload);
      setSubmissionId(data._id);
      setSuccess("Form submitted successfully.");
      return data._id;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save form.");
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
      setSuccess("PDF opened — two copies printed on one page.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate PDF.");
    } finally { setPdfLoading(false); }
  };

  // Shared table cell sx
  const thSx = { fontWeight: 700, fontSize: 13, border: "1px solid #bbb", py: 0.8, px: 1, verticalAlign: "top" };
  const tdSx = { fontSize: 13, border: "1px solid #bbb", py: 0.6, px: 1, verticalAlign: "middle" };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Entry Pass Renewal Form</Typography>
        <Button variant="text" onClick={() => navigate("/forms")}>Back to Forms</Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, border: "1px solid #d8d8d8" }}>

        {/* ── Title ── */}
        <Typography
          align="center"
          sx={{ fontWeight: 700, fontSize: 14, textDecoration: "underline", mb: 2.5 }}
        >
          Requisition for Renewal of Entry Pass: Domestic Help/Tutor/Driver/Supplier
        </Typography>

        {/* ── Form table ── */}
        <Table size="small" sx={{ "& td, & th": { borderCollapse: "collapse" }, mb: 2 }}>
          <TableBody>

            {/* Row 1: Name | Date */}
            <TableRow>
              <TableCell sx={{ ...thSx, width: "45%" }}>
                Name of the Applicant
                <Typography sx={{ fontSize: 11, fontWeight: 400, color: "text.secondary" }}>
                  (To be filled by the applicant of the pass)
                </Typography>
              </TableCell>
              <TableCell sx={{ ...tdSx, width: "30%" }}>
                <TextField
                  value={values.applicantName}
                  onChange={handleChange("applicantName")}
                  placeholder="full name"
                  fullWidth
                  sx={lineInputSx}
                  {...inlineField}
                />
              </TableCell>
              <TableCell sx={{ ...tdSx, width: "25%" }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                  <Typography sx={{ fontSize: 13, whiteSpace: "nowrap" }}>Date: -</Typography>
                  <TextField
                    type="date"
                    value={values.date}
                    onChange={handleChange("date")}
                    sx={{ ...lineInputSx, minWidth: 120, flex: 1 }}
                    {...inlineField}
                  />
                </Box>
              </TableCell>
            </TableRow>

            {/* Row 2: Flat No | Mobile No */}
            <TableRow>
              <TableCell sx={thSx}>
                Flat No.(s)
                <Typography sx={{ fontSize: 11, fontWeight: 400, color: "text.secondary" }}>
                  (if working more than One Flat, all Flat Number to be mentioned)
                </Typography>
              </TableCell>
              <TableCell sx={tdSx}>
                <TextField
                  value={values.flatNo}
                  onChange={handleChange("flatNo")}
                  placeholder="flat number(s)"
                  fullWidth
                  sx={lineInputSx}
                  {...inlineField}
                />
              </TableCell>
              <TableCell sx={tdSx}>
                <Typography sx={{ fontSize: 12, mb: 0.3 }}>Mobile No.</Typography>
                <TextField
                  value={values.mobileNo}
                  onChange={handleChange("mobileNo")}
                  placeholder="mobile number"
                  fullWidth
                  sx={lineInputSx}
                  {...inlineField}
                />
              </TableCell>
            </TableRow>

            {/* Row 3: Pass Number */}
            <TableRow>
              <TableCell sx={thSx}>Pass Number</TableCell>
              <TableCell colSpan={2} sx={tdSx}>
                <TextField
                  value={values.passNumber}
                  onChange={handleChange("passNumber")}
                  placeholder="pass number"
                  fullWidth
                  sx={lineInputSx}
                  {...inlineField}
                />
              </TableCell>
            </TableRow>

            {/* Row 4: Pass Holder Name & Mobile */}
            <TableRow>
              <TableCell sx={thSx}>Name &amp; Mobile No. of the Pass Holder</TableCell>
              <TableCell colSpan={2} sx={tdSx}>
                <TextField
                  value={values.passHolderNameMobile}
                  onChange={handleChange("passHolderNameMobile")}
                  placeholder="name and mobile"
                  fullWidth
                  sx={lineInputSx}
                  {...inlineField}
                />
              </TableCell>
            </TableRow>

            {/* Row 5: Please renew / Signature */}
            <TableRow>
              <TableCell colSpan={3} sx={{ ...tdSx, height: 60 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Typography sx={{ fontWeight: 700, fontStyle: "italic", fontSize: 14 }}>
                    Please renew/further extend the above-mentioned pass.
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontStyle: "italic", color: "text.secondary" }}>
                    Signature of applicant with date
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>

            {/* Row 6: Security Officer | PIC Security */}
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{ ...tdSx, textAlign: "center", height: 52,
                      fontWeight: 700, fontStyle: "italic", fontSize: 13 }}
              >
                Security Officer
              </TableCell>
              <TableCell
                sx={{ ...tdSx, textAlign: "center", height: 52,
                      fontWeight: 700, fontStyle: "italic", fontSize: 13 }}
              >
                PIC Security
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>

        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
          ℹ️ The printed PDF will contain two copies of this form on a single page.
        </Typography>

        {/* ── Status ── */}
        {error   && <Typography color="error"        sx={{ mt: 1 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}

        {/* ── Buttons ── */}
        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap" }}>
          <Button variant="outlined"  onClick={submitForm} disabled={saving || pdfLoading}>
            {saving ? <CircularProgress size={18} /> : "Save Form"}
          </Button>
          <Button variant="contained" onClick={openPdf}    disabled={saving || pdfLoading}>
            {pdfLoading ? <CircularProgress color="inherit" size={18} /> : "Open PDF / Print"}
          </Button>
        </Box>
      </Paper>

      {submissionId && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="text" onClick={() => navigate("/submissions")}>Go to My Submissions</Button>
        </Box>
      )}
    </Container>
  );
};

export default SecurityPassRenewal;

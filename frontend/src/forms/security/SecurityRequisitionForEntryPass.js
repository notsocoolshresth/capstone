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

const TEMPLATE_SLUG = "/forms/security-entry-pass/template";

const initialValues = {
  applicantName: "",
  employeeNo: "",
  designation: "",
  department: "",
  emailId: "",
  flatNo: "",
  mobileNo: "",
  helperName: "",
  helperAadhar: "",
  helperMobileNo: "",
  visibleIdentificationMark: "",
  employedAs: "",
  campusEntryExitTime: "",
};

// ── Module-level sx — stable identity across re-renders ──────────────────────
const lineInputSx = {
  "& .MuiInputBase-input": { pb: 0, pt: "1px", fontSize: 13, lineHeight: 1.4 },
  "& .MuiInput-underline:before": { borderBottomColor: "#444" },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "#222" },
};
const inlineField = { variant: "standard", size: "small", InputLabelProps: { shrink: false } };

const thSx = {
  fontWeight: 700, fontSize: 13, border: "1px solid #bbb",
  py: 0.7, px: 1, verticalAlign: "top", whiteSpace: "nowrap",
};
const tdSx = { fontSize: 13, border: "1px solid #bbb", py: 0.5, px: 1, verticalAlign: "middle" };

// Module-level field component to avoid focus loss
const TdField = ({ fieldName, placeholder, values, onChange }) => (
  <TextField
    value={values[fieldName]}
    onChange={onChange(fieldName)}
    placeholder={placeholder || ""}
    fullWidth
    sx={lineInputSx}
    {...inlineField}
  />
);

// ─────────────────────────────────────────────────────────────────────────────

const SecurityRequisitionForEntryPass = () => {
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

  const canSubmit = useMemo(() =>
    ["applicantName", "helperName"].every((k) => String(values[k]).trim() !== ""),
    [values]
  );

  const handleChange = (name) => (event) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    setError(""); setSuccess("");
  };

  const submitForm = async () => {
    if (!canSubmit) { setError("Please fill Applicant Name and Helper Name at minimum."); return null; }
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
      setSuccess("PDF opened in new tab.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate PDF.");
    } finally { setPdfLoading(false); }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Entry Pass Requisition Form</Typography>
        <Button variant="text" onClick={() => navigate("/forms")}>Back to Forms</Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, border: "1px solid #d8d8d8" }}>

        {/* ── Header band ── */}
        <Box sx={{ background: "#e8e8e8", py: 1, mb: 1.5, textAlign: "center", border: "1px solid #ccc" }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
            भारतीय प्रौद्योगिकी संस्थान, पटना
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
            INDIAN INSTITUTE OF TECHNOLOGY PATNA
          </Typography>
        </Box>

        {/* ── Form title ── */}
        <Typography align="center" sx={{ fontWeight: 700, fontSize: 14, textDecoration: "underline", mb: 1.5 }}>
          Form for Entry Pass: Domestic Help/Tutor/Driver/Supplier
        </Typography>

        {/* ── Pass No. box (office use only) ── */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Box sx={{ border: "1px solid #999", width: 240 }}>
            <Typography sx={{ fontSize: 11, color: "red", fontWeight: 700, px: 1, pt: 0.5, borderBottom: "1px solid #999" }}>
              Pass No. &amp; issue date (for office use)
            </Typography>
            <Typography sx={{ fontSize: 11, px: 1, py: 0.4 }}>IITP/DH/202…/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dated-</Typography>
          </Box>
        </Box>

        {/* ── Table 1: Applicant Details ── */}
        <Table size="small" sx={{ mb: 1.5, "& td, & th": { borderCollapse: "collapse" } }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ ...thSx, width: "35%" }}>Name of the Applicant</TableCell>
              <TableCell colSpan={3} sx={tdSx}>
                <TdField fieldName="applicantName" placeholder="full name" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={thSx}>Employee No.</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="employeeNo" placeholder="" values={values} onChange={handleChange} />
              </TableCell>
              <TableCell sx={{ ...thSx, width: "18%" }}>Designation</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="designation" placeholder="" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={thSx}>Department /Section</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="department" placeholder="" values={values} onChange={handleChange} />
              </TableCell>
              <TableCell sx={thSx}>Email id</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="emailId" placeholder="" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={thSx}>Flat No.</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="flatNo" placeholder="" values={values} onChange={handleChange} />
              </TableCell>
              <TableCell sx={thSx}>Mobile No.</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="mobileNo" placeholder="" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* ── Table 2: Domestic Help Details ── */}
        <Table size="small" sx={{ mb: 1.5, "& td, & th": { borderCollapse: "collapse" } }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ ...thSx, width: "50%" }}>
                Name of the Domestic Help/Tutor/Driver/Supplier
              </TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="helperName" placeholder="name of helper" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={thSx}>Aadhar Card/ Photo Id No.</TableCell>
              <TableCell sx={tdSx}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "baseline" }}>
                  <TdField fieldName="helperAadhar" placeholder="aadhar / id no." values={values} onChange={handleChange} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>Mobile No.</Typography>
                  <TdField fieldName="helperMobileNo" placeholder="" values={values} onChange={handleChange} />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={thSx}>Visible identification mark</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="visibleIdentificationMark" placeholder="" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={thSx}>Employed as</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="employedAs" placeholder="domestic help / tutor / driver / supplier" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={thSx}>Campus entry &amp; exit time</TableCell>
              <TableCell sx={tdSx}>
                <TdField fieldName="campusEntryExitTime" placeholder="e.g. 08:00 AM – 06:00 PM" values={values} onChange={handleChange} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* ── Enclosure note box ── */}
        <Box sx={{ border: "1px solid #bbb", p: 1.5, mb: 2.5, minHeight: 72 }}>
          <Typography sx={{ fontSize: 13, fontStyle: "italic", mb: 3 }}>
            Please find the{" "}
            <Typography component="span" sx={{ fontWeight: 700, fontStyle: "italic", fontSize: 13 }}>
              enclosed attested Copy
            </Typography>
            {" "}of Photo Id /Aadhar card &amp; 02 passport size photographs of Domestic Help/Tutor/Driver/Supplier.
          </Typography>
          <Typography sx={{ fontSize: 12, textAlign: "right", color: "text.secondary", fontStyle: "italic" }}>
            Signature of applicant with date
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ── Office Note ── */}
        <Typography sx={{ fontSize: 13, textDecoration: "underline", mb: 5 }}>Office Note:</Typography>
        <Typography sx={{ fontSize: 12, textAlign: "right", color: "text.secondary", fontStyle: "italic", mb: 3 }}>
          Signature of Security Officer
        </Typography>

        {/* ── Remarks by PIC Security ── */}
        <Typography sx={{ fontSize: 13, textDecoration: "underline", mb: 5 }}>
          Remarks by PIC Security: -
        </Typography>
        <Typography sx={{ fontSize: 12, textAlign: "right", color: "text.secondary", fontStyle: "italic" }}>
          Signature of PIC Security
        </Typography>

        {/* ── Status ── */}
        {error   && <Typography color="error"        sx={{ mt: 2 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}

        {/* ── Buttons ── */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap" }}>
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

export default SecurityRequisitionForEntryPass;

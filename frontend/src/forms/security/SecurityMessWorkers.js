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
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

const TEMPLATE_SLUG = "/forms/security-mess-workers/template";
const MAX_WORKERS = 20;

const blankWorker = () => ({ name: "", aadhar: "" });

const initialFormValues = {
  hostelName: "",
  vendorName: "",
};

// ── Shared sx — module-level so identity is stable across re-renders ─────────
const lineInputSx = {
  "& .MuiInputBase-input": { pb: 0, pt: "1px", fontSize: 15, lineHeight: 1.4 },
  "& .MuiInput-underline:before": { borderBottomColor: "#222" },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "#222" },
};

const inlineField = { variant: "standard", size: "small", InputLabelProps: { shrink: false } };

// ── Module-level helper — must NOT be inside the page component ──────────────
const InlineField = ({ label, fieldName, placeholder, minWidth = 200, flex, values, onChange }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 1, mt: 1.5 }}>
    {label && <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{label}</Typography>}
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

const SecurityMessWorkers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fixed fields (hostel, vendor)
  const [values, setValues]             = useState(initialFormValues);
  // Dynamic worker rows — start with just 1
  const [workers, setWorkers]           = useState([blankWorker()]);

  const [saving, setSaving]             = useState(false);
  const [pdfLoading, setPdfLoading]     = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [templateId, setTemplateId]     = useState("");
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");

  // Prefill
  React.useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill && typeof prefill === "object") {
      // Extract fixed fields
      const { hostelName, vendorName, ...rest } = prefill;
      if (hostelName || vendorName) setValues({ hostelName: hostelName || "", vendorName: vendorName || "" });

      // Extract worker rows
      const prefillWorkers = [];
      for (let i = 1; i <= MAX_WORKERS; i++) {
        if (rest[`worker${i}Name`]) {
          prefillWorkers.push({ name: rest[`worker${i}Name`] || "", aadhar: rest[`worker${i}Aadhar`] || "" });
        }
      }
      if (prefillWorkers.length) setWorkers(prefillWorkers);
    }
  }, [location.state]);

  // Load template
  React.useEffect(() => {
    API.get(TEMPLATE_SLUG)
      .then(({ data }) => setTemplateId(data?._id || ""))
      .catch(() => setError("Failed to load form template."));
  }, []);

  const canSubmit = useMemo(() => {
    return (
      String(values.hostelName).trim() !== "" &&
      String(values.vendorName).trim() !== "" &&
      workers.some((w) => String(w.name).trim() !== "")
    );
  }, [values, workers]);

  // Handlers for fixed fields
  const handleChange = (name) => (event) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    setError("");
    setSuccess("");
  };

  // Handlers for worker rows
  const handleWorkerChange = (idx, field) => (event) => {
    setWorkers((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: event.target.value };
      return updated;
    });
    setError("");
    setSuccess("");
  };

  const addWorker = () => {
    if (workers.length < MAX_WORKERS) {
      setWorkers((prev) => [...prev, blankWorker()]);
    }
  };

  const removeWorker = (idx) => {
    // Always keep at least 1 row
    if (workers.length > 1) {
      setWorkers((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  // Flatten workers into workerNName / workerNAadhar for submission
  const buildResponses = () => {
    const responses = { ...values };
    workers.forEach((w, i) => {
      responses[`worker${i + 1}Name`]   = w.name;
      responses[`worker${i + 1}Aadhar`] = w.aadhar;
    });
    return responses;
  };

  const submitForm = async () => {
    if (!canSubmit) {
      setError("Please fill hostel name, vendor name, and at least one worker's name.");
      return null;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (!templateId) { setError("Form template not ready. Please retry."); return null; }
      const payload = { templateId, responses: buildResponses() };
      if (location.state?.parentSubmissionId) payload.parentSubmissionId = location.state.parentSubmissionId;
      const { data } = await API.post("/submissions", payload);
      setSubmissionId(data._id);
      setSuccess("Form submitted successfully. Visible in My Submissions.");
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
    if (!id) { id = await submitForm(); if (!id) return; }
    setPdfLoading(true);
    setError("");
    try {
      const response = await API.get(`/submissions/${id}/pdf`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setSuccess("PDF opened in new tab.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Mess Worker Initial Entry Form</Typography>
        <Button variant="text" onClick={() => navigate("/forms")}>Back to Forms</Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, border: "1px solid #d8d8d8" }}>

        {/* ── Title ── */}
        <Typography align="center" sx={{ fontWeight: 700, fontSize: 16, textDecoration: "underline", mb: 0.3 }}>
          Indian Institute of Technology Patna
        </Typography>
        <Typography align="center" sx={{ fontWeight: 700, fontSize: 14, mb: 3 }}>
          (Mess Worker Initial Entry Form)
        </Typography>

        {/* ── To block ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>To,</Typography>
        <Typography sx={{ fontSize: 15 }}>The Warden</Typography>
        <InlineField
          label=""
          fieldName="hostelName"
          placeholder="Hostel Name"
          minWidth={220}
          values={values}
          onChange={handleChange}
        />
        <Typography sx={{ fontSize: 14, color: "text.secondary", ml: 0.5, mb: 0.2 }}>Hostel</Typography>
        <Typography sx={{ fontSize: 15, mb: 2 }}>IIT Patna</Typography>

        {/* ── Subject ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1.5 }}>
          Subject: Request for Entry of Mess Vendor/Workers
        </Typography>

        {/* ── Body ── */}
        <Typography sx={{ fontSize: 14, textAlign: "justify", lineHeight: 1.8, mb: 2.5 }}>
          In accordance with the procedures for the entry and stay of workers deployed by the mess vendor for
          catering services, we hereby submit the following details for approval of entry for our workers:
        </Typography>

        {/* ── Worker Details ── */}
        <Typography sx={{ fontSize: 15, mb: 1.5 }}>
          <Typography component="span" sx={{ fontWeight: 700, fontSize: 15, textDecoration: "underline" }}>
            Worker Details:
          </Typography>
          {" "}
          <Typography component="span" sx={{ fontSize: 14, fontStyle: "italic" }}>
            (Enclose a copy of photo Id of each worker)
          </Typography>
        </Typography>

        <Table size="small" sx={{ mb: 1, "& td, & th": { border: "none", px: 1, py: 0.6 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: 14, width: 36 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Name of Worker</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>Aadhar Number</TableCell>
              <TableCell sx={{ width: 36 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map((worker, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ fontSize: 14, verticalAlign: "bottom" }}>{idx + 1}.</TableCell>
                <TableCell>
                  <TextField
                    value={worker.name}
                    onChange={handleWorkerChange(idx, "name")}
                    placeholder="worker name"
                    fullWidth
                    sx={lineInputSx}
                    {...inlineField}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={worker.aadhar}
                    onChange={handleWorkerChange(idx, "aadhar")}
                    placeholder="xxxx xxxx xxxx"
                    fullWidth
                    sx={lineInputSx}
                    {...inlineField}
                  />
                </TableCell>
                <TableCell sx={{ verticalAlign: "bottom", pb: 0.5 }}>
                  {workers.length > 1 && (
                    <Tooltip title="Remove row">
                      <IconButton
                        size="small"
                        onClick={() => removeWorker(idx)}
                        sx={{ color: "error.light", p: 0.3, fontSize: 18, fontWeight: 700 }}
                      >
                        −
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ── Add Worker button ── */}
        {workers.length < MAX_WORKERS && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 1, mb: 2 }}>
            <Button
              size="small"
              onClick={addWorker}
              variant="text"
              sx={{ textTransform: "none", fontSize: 14 }}
            >
              + Add Worker
            </Button>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* ── Undertaking ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.8 }}>Undertaking:</Typography>
        <Typography sx={{ fontSize: 14, mb: 1 }}>We, the undersigned, hereby undertake that:</Typography>
        {[
          "All workers listed above will follow the rules and regulations set forth by IIT Patna for security and campus safety.",
          "We will ensure the workers have valid Aadhar Cards and relevant documents for identification purposes.",
          "We will submit updated records for new workers as required and promptly inform the authorities of any changes to the worker list.",
          "We will comply with all IIT Patna campus regulations, including those regarding the use of vehicles for work-related purposes.",
          "We agree to provide timely exit details and remove any worker from the campus once their deployment ends.",
          "We will ensure that the workers maintain proper decorum and behave responsibly during their stay.",
        ].map((pt, idx) => (
          <Typography key={idx} sx={{ fontSize: 13, lineHeight: 1.8, textAlign: "justify", ml: 2, mb: 0.4 }}>
            {idx + 1}.&nbsp;&nbsp;{pt}
          </Typography>
        ))}

        <Divider sx={{ my: 2.5 }} />

        {/* ── Vendor signature ── */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ minWidth: 340 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontSize: 14 }}>Signature: ………………………&nbsp;&nbsp; Name:</Typography>
              <TextField
                value={values.vendorName}
                onChange={handleChange("vendorName")}
                placeholder="authorised representative name"
                sx={{ ...lineInputSx, minWidth: 180, flex: 1 }}
                {...inlineField}
              />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
              (Authorized representative of the Mess Vendor)
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ── Recommendation by the Warden ── */}
        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 4 }}>
          Recommendation by the Warden:
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 14 }}>Hostel Office Stamp</Typography>
            <Typography sx={{ fontSize: 13, mt: 2, color: "text.secondary", fontStyle: "italic" }}>
              Date:……………...
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 14, fontStyle: "italic", color: "text.secondary" }}>
            Signature of Warden
          </Typography>
        </Box>

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

export default SecurityMessWorkers;

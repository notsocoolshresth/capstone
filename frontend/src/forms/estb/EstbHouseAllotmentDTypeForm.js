import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

const TEMPLATE_SLUG = "/forms/estb-house-allotment-d-type/template";

const initialValues = {
  circularNo: "",
  name: "",
  employeeId: "",
  designation: "",
  payMatrixLevel: "",
  deptSection: "",
  dateOfJoining: "",
  email: "",
  maritalStatus: "Single",
  bachelorAccommodation: "N",
  quarterPreferences: "", // This will store the string of preferences
  presentQuarterAddress: "",
  signature: "",
};

const uSx = (width = 200) => ({
  width,
  "& .MuiInputBase-root": { fontSize: 13 },
  "& .MuiInputBase-input": { py: 0.3, px: 0.5 },
  "& .MuiInput-underline:before": { borderBottomColor: "#333" },
  "& .MuiInput-underline:after": { borderBottomColor: "#111" },
});

const labelSx = { fontSize: 13, minWidth: 320 };

const EstbHouseAllotmentDTypeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New state to hold text inputs for each quarter box
  const [quarterInputs, setQuarterInputs] = useState({});

  React.useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill && typeof prefill === "object") setValues((p) => ({ ...p, ...prefill }));
  }, [location.state]);

  React.useEffect(() => {
    const loadTemplate = async () => {
      try {
        const { data } = await API.get(TEMPLATE_SLUG);
        setTemplateId(data?._id || "");
      } catch { setError("Failed to load form template."); }
    };
    loadTemplate();
  }, []);

  const canSubmit = useMemo(() =>
    ["name", "employeeId", "designation"].every((k) => String(values[k]).trim() !== ""),
    [values]);

  const hc = (name) => (e) => {
    setValues((p) => ({ ...p, [name]: e.target.value }));
    setError(""); setSuccess("");
  };

  // Handles typing into the grid boxes
  const handleQuarterChange = (num, val) => {
    setQuarterInputs((prev) => {
      const updated = { ...prev, [num]: val };
      
      // Construct a string like "19: 1st, 20: 2nd" to save in the database
      const preferenceString = Object.entries(updated)
        .filter(([_, v]) => v.trim() !== "")
        .map(([k, v]) => `${k}(${v})`)
        .join(", ");
      
      setValues((v) => ({ ...v, quarterPreferences: preferenceString }));
      return updated;
    });
  };

  const submitForm = async () => {
    if (!canSubmit) { setError("Please fill in required fields."); return null; }
    setSaving(true); setError(""); setSuccess("");
    try {
      if (!templateId) { setError("Form template is not ready. Please retry."); return null; }
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
    } catch (err) { setError("Failed to generate PDF."); }
    finally { setPdfLoading(false); }
  };

  const quarterRows = [
    [1, 7, 13, 19, 25, 31, 37, 43],
    [2, 8, 14, 20, 26, 32, 38, 44],
    [3, 9, 15, 21, 27, 33, 39, 45],
    [4, 10, 16, 22, 28, 34, 40, 46],
    [5, 11, 17, 23, 29, 35, 41, null],
    [6, 12, 18, 24, 30, 36, 42, null],
  ];

  const fieldRow = (label, name, width = 220, type = "text") => (
    <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
      <Typography sx={labelSx}>{label}</Typography>
      <Typography sx={{ fontSize: 13, mr: 1 }}>:</Typography>
      <TextField variant="standard" type={type} value={values[name]} onChange={hc(name)}
        sx={uSx(width)} InputLabelProps={type === "date" ? { shrink: true } : undefined} />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          House Allotment Form – D Type Quarters
        </Typography>
        <Button variant="text" onClick={() => navigate("/forms")}>Back to Forms</Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 }, border: "1px solid #d8d8d8" }}>
        <Typography variant="h6" align="center" fontWeight={800} sx={{ mb: 2.5 }}>
          INDIAN INSTITUTE OF TECHNOLOGY PATNA
        </Typography>

        <Typography sx={{ fontSize: 13, mb: 0.5 }}>To,</Typography>
        <Typography sx={{ fontSize: 13, mb: 1.5 }}>The chairman HAC,</Typography>
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: 13, textAlign: "justify", lineHeight: 1.9 }}>
            I would like to be considered for allotment of the quarter(s) as per circular
            no.{" "}
            <TextField variant="standard" value={values.circularNo} onChange={hc("circularNo")}
              sx={{ ...uSx(200), display: "inline-flex", verticalAlign: "bottom" }} />
            {" "}I hereby declare that no Government provided accommodation is in the name of
            my spouse within 8 KM of radius from IIT Patna Campus.
          </Typography>
        </Box>

        <Box sx={{ pl: 2 }}>
          {fieldRow("1.   Name", "name")}
          {fieldRow("2.   Employee ID", "employeeId")}
          {fieldRow("3.   Designation", "designation")}
          {fieldRow("4.   Present Level in Pay Matrix", "payMatrixLevel")}
          {fieldRow("5.   Deptt./Section", "deptSection")}
          {fieldRow("6.   Date of joining", "dateOfJoining", 180, "date")}
          {fieldRow("7.   E-mail", "email", 260)}

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelSx}>8.   Marital Status</Typography>
            <Typography sx={{ fontSize: 13, mr: 1 }}>:</Typography>
            <RadioGroup row value={values.maritalStatus} onChange={hc("maritalStatus")}>
              <FormControlLabel value="Single" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 13 }}>Single</Typography>} />
              <FormControlLabel value="Married" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 13 }}>Married</Typography>} />
            </RadioGroup>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontSize: 13, minWidth: 320 }}>
              9.   If single, whether bachelor (shared)<br />
              <span style={{ paddingLeft: 16 }}>accommodation is preferred</span>
            </Typography>
            <Typography sx={{ fontSize: 13, mr: 1 }}>:</Typography>
            <RadioGroup row value={values.bachelorAccommodation} onChange={hc("bachelorAccommodation")}>
              <FormControlLabel value="Y" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 13 }}>Y</Typography>} />
              <FormControlLabel value="N" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 13 }}>N</Typography>} />
            </RadioGroup>
          </Box>

          {/* 10. Quarter preference input grid */}
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: 13, mb: 0.8 }}>
              10.  Type &amp; No. of quarter applied for :
            </Typography>
            <Box sx={{ border: "1px solid #555", display: "inline-block", ml: 2 }}>
              {quarterRows.map((row, ri) => (
                <Box key={ri} sx={{ display: "flex" }}>
                  {row.map((num, ci) => (
                    <Box key={ci}
                      sx={{
                        width: 40, height: 30, // Slightly larger for typing
                        border: "1px solid #555",
                        position: "relative",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center"
                      }}>
                      {num && (
                        <>
                          <Typography sx={{ fontSize: 9, position: "absolute", top: 1, left: 2, color: "#777" }}>
                            {num}
                          </Typography>
                          <input
                            type="text"
                            value={quarterInputs[num] || ""}
                            onChange={(e) => handleQuarterChange(num, e.target.value)}
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "none",
                              textAlign: "center",
                              fontSize: "12px",
                              outline: "none",
                              backgroundColor: "transparent",
                              paddingTop: "8px"
                            }}
                          />
                        </>
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: 11, color: "#555", mt: 0.5, ml: 2 }}>
              (Please indicate your preferences in the above boxes.)
            </Typography>
          </Box>

          {fieldRow("11.  Present quarter No./Present address", "presentQuarterAddress", 260)}

          <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
            <Typography sx={labelSx}>12.  Signature</Typography>
            <Typography sx={{ fontSize: 13, mr: 1 }}>:</Typography>
            <Box sx={{ width: 200, borderBottom: "1px solid #333" }} />
          </Box>
        </Box>

        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
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

export default EstbHouseAllotmentDTypeForm;
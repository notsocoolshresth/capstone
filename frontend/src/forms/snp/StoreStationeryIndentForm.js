import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";

const StoresStationeryIndentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ PREFILL DATA
  const prefill = location.state?.prefill || {};

  // ✅ STATES (with prefill)
  const [rows, setRows] = useState(() => {
    if (prefill.itemsJson) {
      try {
        return JSON.parse(prefill.itemsJson);
      } catch {}
    }
    return [{ particulars: "", quantity: "", remarks: "" }];
  });

  const [date, setDate] = useState(prefill.date || "");
  const [employeeName, setEmployeeName] = useState(prefill.employeeName || "");
  const [empNo, setEmpNo] = useState(prefill.empNo || "");
  const [designation, setDesignation] = useState(prefill.designation || "");
  const [deptSection, setDeptSection] = useState(prefill.deptSection || "");
  const [employeeSignature, setEmployeeSignature] = useState(prefill.employeeSignature || "");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { particulars: "", quantity: "", remarks: "" },
    ]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const body = {
        templateId: "stores-stationery-indent",
        responses: {
          employeeName,
          empNo,
          designation,
          deptSection,
          date,
          employeeSignature,
          itemsJson: JSON.stringify(rows),
        },
      };

      await API.post("/submissions", body);

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  const lineInput = {
    border: "none",
    borderBottom: "1px solid black",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
  };

  const tableInput = {
    border: "none",
    outline: "none",
    width: "100%",
    padding: "6px",
    background: "transparent",
  };

  return (
    <Box sx={{ maxWidth: "850px", margin: "auto", p: 4, fontFamily: "Times New Roman" }}>

      {/* BACK BUTTON */}
      <Box display="flex" justifyContent="space-between">
        <div />
        <Button variant="text" onClick={() => navigate("/forms")}>
          ← Back to Forms
        </Button>
      </Box>

      {/* HEADER */}
      <Typography align="center" fontWeight="bold" fontSize={20}>
        Indian Institute of Technology Patna
      </Typography>

      <Typography align="center" fontWeight="bold" mt={1}>
        STATIONARY INDENT FORM
      </Typography>

      {/* DATE */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <span>Date:&nbsp;</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ ...lineInput, width: "180px" }}
        />
      </Box>

      {/* NAME */}
      <Box mt={4} display="flex" alignItems="center">
        <span>Name of the employee&nbsp;</span>
        <input
          style={{ ...lineInput, flex: 1 }}
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <span>&nbsp;&nbsp;Emp. No.&nbsp;</span>
        <input
          style={{ ...lineInput, width: "120px" }}
          value={empNo}
          onChange={(e) => setEmpNo(e.target.value)}
        />
      </Box>

      {/* DESIGNATION */}
      <Box mt={3} display="flex" alignItems="center">
        <span>Designation&nbsp;</span>
        <input
          style={{ ...lineInput, width: "40%" }}
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <span>&nbsp;&nbsp;Dept./Section/Centre&nbsp;</span>
        <input
          style={{ ...lineInput, flex: 1 }}
          value={deptSection}
          onChange={(e) => setDeptSection(e.target.value)}
        />
      </Box>

      {/* TABLE */}
      <Box mt={5} border="1px solid black">
        <Box display="flex" borderBottom="1px solid black">
          <Box width="10%" borderRight="1px solid black" textAlign="center">
            Sl.<br />No.
          </Box>
          <Box width="50%" borderRight="1px solid black" textAlign="center">
            PARTICULARS
          </Box>
          <Box width="20%" borderRight="1px solid black" textAlign="center">
            QUANTITY
          </Box>
          <Box width="20%" textAlign="center">
            REMARKS
          </Box>
        </Box>

        {rows.map((row, i) => (
          <Box key={i} display="flex" borderBottom="1px solid black">
            <Box width="10%" borderRight="1px solid black" textAlign="center" py={1}>
              {i + 1}.
            </Box>

            <Box width="50%" borderRight="1px solid black">
              <input
                style={tableInput}
                value={row.particulars}
                onChange={(e) => handleChange(i, "particulars", e.target.value)}
              />
            </Box>

            <Box width="20%" borderRight="1px solid black">
              <input
                style={tableInput}
                value={row.quantity}
                onChange={(e) => handleChange(i, "quantity", e.target.value)}
              />
            </Box>

            <Box width="20%">
              <input
                style={tableInput}
                value={row.remarks}
                onChange={(e) => handleChange(i, "remarks", e.target.value)}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* ADD ROW */}
      <Box mt={2} textAlign="right">
        <Button variant="outlined" onClick={addRow}>
          + Add Row
        </Button>
      </Box>

      {/* SIGNATURE */}
      <Box mt={6} display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Signature of HOD/HOS/DEAN</Typography>

        <Box>
          <input
            value={employeeSignature}
            onChange={(e) => setEmployeeSignature(e.target.value)}
            style={{ ...lineInput, width: "200px" }}
          />
          <Typography fontSize={12} align="center">
            Signature of the employee
          </Typography>
        </Box>
      </Box>

      {/* STATUS */}
      {error && <Typography color="error" mt={2}>{error}</Typography>}
      {submitted && <Typography color="green" mt={2}>✅ Form submitted successfully!</Typography>}

      {/* SUBMIT */}
      <Box mt={4} textAlign="right">
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? <CircularProgress size={20} /> : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default StoresStationeryIndentForm;
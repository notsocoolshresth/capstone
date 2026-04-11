import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Input
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";

const CCRDRecommendationTwoBidPurchaseGeM = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = location.state?.prefill || {};
  const parentSubmissionId = location.state?.parentSubmissionId || null;

  const [values, setValues] = useState({
    projectNo:       prefill.projectNo       || "",
    date:            prefill.date            || "",
    purchaseOf:      prefill.purchaseOf      || "",
    supplyItem:      prefill.supplyItem      || "",
    gemBidRef:       prefill.gemBidRef       || "",
    gemBidDate:      prefill.gemBidDate      || "",
    vendorCount:     prefill.vendorCount     || "",
    techFirmsCount:  prefill.techFirmsCount  || "",
    openedOnDate:    prefill.openedOnDate    || "",
    annexureNo:      prefill.annexureNo      || "",
    orderForItem:    prefill.orderForItem    || "",
    vendorMsName:    prefill.vendorMsName    || "",
    fileNo:          prefill.fileNo          || "",
    yearOfSanction:  prefill.yearOfSanction  || "",
    department:      prefill.department      || "",
    category:        prefill.category        || "",
    vendorLabel:     prefill.vendorLabel     || "",
    vendorName:      prefill.vendorName      || "",
    vendorAddr1:     prefill.vendorAddr1     || "",
    vendorAddr2:     prefill.vendorAddr2     || "",
    item1Desc:       prefill.item1Desc       || "",
    item1Rate:       prefill.item1Rate       || "",
    item1Qty:        prefill.item1Qty        || "",
    item1Amount:     prefill.item1Amount     || "",
    item2Desc:       prefill.item2Desc       || "",
    item2Rate:       prefill.item2Rate       || "",
    item2Qty:        prefill.item2Qty        || "",
    item2Amount:     prefill.item2Amount     || "",
    item3Desc:       prefill.item3Desc       || "",
    item3Rate:       prefill.item3Rate       || "",
    item3Qty:        prefill.item3Qty        || "",
    item3Amount:     prefill.item3Amount     || "",
    extraRow1Label:  prefill.extraRow1Label  || "",
    extraRow1Amount: prefill.extraRow1Amount || "",
    extraRow2Label:  prefill.extraRow2Label  || "",
    extraRow2Amount: prefill.extraRow2Amount || "",
    gstPercent:      prefill.gstPercent      || "",
    gstAmount:       prefill.gstAmount       || "",
    totalAmount:     prefill.totalAmount     || "",
    member1Name:     prefill.member1Name     || "",
    member2Name:     prefill.member2Name     || "",
    member3Name:     prefill.member3Name     || "",
    member4Name:     prefill.member4Name     || "",
    jtsName:         prefill.jtsName         || "",
    hodCCName:       prefill.hodCCName       || "",
    investigatorName: prefill.investigatorName || "",
    arRDName:        prefill.arRDName        || "",
    drRDName:        prefill.drRDName        || "",
    aDeanRDName:     prefill.aDeanRDName     || "",
    directorName:    prefill.directorName    || "",
  });

  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const res = await API.get("/forms/computer-center-rd-two-bid-gem/template");
        setTemplateId(res.data._id);
      } catch {
        setTemplateId("cc-rd-two-bid-gem");
      } finally {
        setLoading(false);
      }
    };
    loadTemplate();
  }, []);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const body = {
        templateId: templateId || "cc-rd-two-bid-gem",
        responses: { ...values },
      };
      if (parentSubmissionId) body.parentSubmissionId = parentSubmissionId;
      await API.post("/submissions", body);
      navigate("/submissions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sectionLabel = (text) => (
    <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 0.5, color: "#1976d2" }}>
      {text}
    </Typography>
  );

  const F = (label, name, type = "text", multiline = false) => (
    <TextField
      key={name}
      label={label}
      fullWidth
      type={type}
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      value={values[name] ?? ""}
      onChange={handleChange(name)}
      margin="normal"
      size="small"
      InputLabelProps={type === "date" ? { shrink: true } : undefined}
    />
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Container maxWidth="md">
    <Paper sx={{ p: 5, fontFamily: "Times New Roman", fontSize: 14, color: "#000" }}>

      {/* Top Header Line */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography fontSize={12}>
          Project No.{" "}
          <Input
            disableUnderline
            value={values.projectNo}
            onChange={handleChange("projectNo")}
            sx={{ borderBottom: "1px solid black", width: 180 }}
          />
        </Typography>

        <Typography fontSize={12}>Form No. P004</Typography>
      </Box>

      <Typography align="center" fontWeight={700}>
        Format for procurement in INR using Double Bid Tendering process
      </Typography>

      <Typography align="center" fontSize={13} mb={2}>
        Recommendation cum Sanction Sheet for the purchase of
      </Typography>

      {/* Top row */}
      <Box display="flex" justifyContent="space-between" mb={2}>

        <Typography>
          Date:{" "}
          <Input
            type="date"
            disableUnderline
            value={values.date}
            onChange={handleChange("date")}
            sx={{ borderBottom: "1px solid black", width: 150 }}
          />
        </Typography>
      </Box>

      {/* Paragraph EXACT */}
      <Typography>
        Quotations for the supply of{" "}
        <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 250 }} value={values.supplyItem} onChange={handleChange("supplyItem")} />{" "}
        were invited, through GeM bid{" "}
        <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.gemBidRef} onChange={handleChange("gemBidRef")} />, dated{" "}
        <Input type="date" disableUnderline sx={{ borderBottom: "1px solid black", width: 150 }} value={values.gemBidDate} onChange={handleChange("gemBidDate")} />.
      </Typography>

      <Typography mt={1}>
        Responses were received from{" "}
        <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 60 }} value={values.vendorCount} onChange={handleChange("vendorCount")} /> vendors as given in the quotation opening report.
      </Typography>

      <Typography mt={1}>
        The price bids of{" "}
        <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 60 }} value={values.techFirmsCount} onChange={handleChange("techFirmsCount")} /> technically satisfied firms were opened on{" "}
        <Input type="date" disableUnderline sx={{ borderBottom: "1px solid black", width: 150 }} value={values.openedOnDate} onChange={handleChange("openedOnDate")} />, in the presence of purchase committee members.
      </Typography>

      <Typography mt={1}>
        The item wise details of rate are given in Annexure-{" "}
        <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 80 }} value={values.annexureNo} onChange={handleChange("annexureNo")} />.
      </Typography>

      <Typography mt={1}>
        The purchase committee recommends to place the order for{" "}
        <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.orderForItem} onChange={handleChange("orderForItem")} /> with M/s{" "}
        <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.vendorMsName} onChange={handleChange("vendorMsName")} />, the lowest quoter.
      </Typography>

      {/* File section */}
      <Box mt={2}>
        <Typography>File No.: <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.fileNo} onChange={handleChange("fileNo")} /></Typography>
        <Typography>Year of Sanction: <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.yearOfSanction} onChange={handleChange("yearOfSanction")} /></Typography>
        <Typography>Department: <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.department} onChange={handleChange("department")} /></Typography>
        <Typography>Category: <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.category} onChange={handleChange("category")} /></Typography>
      </Box>

      {/* Vendor */}
      <Box mt={2}>
        <Typography>
          Vendor:{" "}
          <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 120 }} value={values.vendorLabel} onChange={handleChange("vendorLabel")} />{" "}
          M/s{" "}
          <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.vendorName} onChange={handleChange("vendorName")} />
        </Typography>

        <Typography>
          <Input disableUnderline fullWidth sx={{ borderBottom: "1px solid black" }} value={values.vendorAddr1} onChange={handleChange("vendorAddr1")} />
        </Typography>

        <Typography>
          <Input disableUnderline fullWidth sx={{ borderBottom: "1px solid black" }} value={values.vendorAddr2} onChange={handleChange("vendorAddr2")} />
        </Typography>
      </Box>

      {/* TABLE */}
      <Box mt={3} border="1px solid black">
        <Box display="grid" gridTemplateColumns="60px 1fr 100px 100px 120px" borderBottom="1px solid black">
          {["Sl. No.", "Item description (with product code, if any)", "Rate", "Quantity", "Amount"].map((h, i) => (
            <Typography key={i} p={1} borderRight="1px solid black" fontWeight={600}>
              {h}
            </Typography>
          ))}
        </Box>

        {[1, 2, 3].map((i) => (
          <Box key={i} display="grid" gridTemplateColumns="60px 1fr 100px 100px 120px" borderBottom="1px solid black">
            <Typography p={1} borderRight="1px solid black">{i}</Typography>
            <Box p={1} borderRight="1px solid black"><Input disableUnderline fullWidth sx={{ borderBottom: "1px solid black" }} value={values[`item${i}Desc`]} onChange={handleChange(`item${i}Desc`)} /></Box>
            <Box p={1} borderRight="1px solid black"><Input disableUnderline fullWidth sx={{ borderBottom: "1px solid black" }} value={values[`item${i}Rate`]} onChange={handleChange(`item${i}Rate`)} /></Box>
            <Box p={1} borderRight="1px solid black"><Input disableUnderline fullWidth sx={{ borderBottom: "1px solid black" }} value={values[`item${i}Qty`]} onChange={handleChange(`item${i}Qty`)} /></Box>
            <Box p={1}><Input disableUnderline fullWidth sx={{ borderBottom: "1px solid black" }} value={values[`item${i}Amount`]} onChange={handleChange(`item${i}Amount`)} /></Box>
          </Box>
        ))}

        {/* GST */}
        <Box p={1} borderTop="1px solid black">
          GST @ <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 60 }} value={values.gstPercent} onChange={handleChange("gstPercent")} /> %
        </Box>

        <Box p={1}>
          Total Amount: <Input disableUnderline sx={{ borderBottom: "1px solid black", width: 200 }} value={values.totalAmount} onChange={handleChange("totalAmount")} />
        </Box>
      </Box>

      <Typography mt={2}>
        Amount as per details given in the above table may be sanctioned.
      </Typography>

      {/* SIGNATURES */}
      <Box mt={5}>
        <Typography mb={1}>
          Amount as per details given in the above table may be sanctioned.
        </Typography>

        {/* Members */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} textAlign="center">
              <Box borderTop="1px solid black" width={140} mb={1}></Box>
              <Typography fontSize={12}>(Member {i})</Typography>
            </Box>
          ))}
        </Box>

        {/* GeM Account */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Typography>For GeM Account:</Typography>
          <Box textAlign="center">
            <Box borderTop="1px solid black" width={160} mb={1}></Box>
            <Typography fontSize={12}>JTS/TS (CC)</Typography>
          </Box>

          <Box textAlign="center">
            <Box borderTop="1px solid black" width={160} mb={1}></Box>
            <Typography fontSize={12}>HoD (CC)</Typography>
          </Box>
        </Box>

        {/* Investigators */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Box textAlign="center">
            <Box borderTop="1px solid black" width={160} mb={1}></Box>
            <Typography fontSize={12}>Investigator(s)</Typography>
          </Box>

          <Box textAlign="center">
            <Box borderTop="1px solid black" width={160} mb={1}></Box>
            <Typography fontSize={12}>AR(R&D)</Typography>
          </Box>

          <Box textAlign="center">
            <Box borderTop="1px solid black" width={160} mb={1}></Box>
            <Typography fontSize={12}>DR(R&D)</Typography>
          </Box>
        </Box>

        {/* Bottom */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Box textAlign="center">
            <Box borderTop="1px solid black" width={160} mb={1}></Box>
            <Typography fontSize={12}>A Dean(R&D)</Typography>
          </Box>

          <Box textAlign="center">
            <Typography fontWeight={700}>Director</Typography>
            <Typography fontWeight={700}>IIT Patna</Typography>
          </Box>
        </Box>
      </Box>

      {/* NOTE */}
      <Box mt={5}>
        <Typography fontWeight={600}>Note:</Typography>

        <Typography fontWeight={600} mb={1}>
          Delegation of Financial Power
        </Typography>

        <Box border="1px solid black">

          {/* Header */}
          <Box display="grid" gridTemplateColumns="80px 1fr 200px" borderBottom="1px solid black">
            <Typography p={1} borderRight="1px solid black">Sl No.</Typography>
            <Typography p={1} borderRight="1px solid black">Functionaries</Typography>
            <Typography p={1}>Amount (Rs.)</Typography>
          </Box>

          {/* Row 1 */}
          <Box display="grid" gridTemplateColumns="80px 1fr 200px" borderBottom="1px solid black">
            <Typography p={1} borderRight="1px solid black">I</Typography>
            <Typography p={1} borderRight="1px solid black">Investigator(s)</Typography>
            <Typography p={1}>Upto 01 Lakh</Typography>
          </Box>

          {/* Row 2 */}
          <Box display="grid" gridTemplateColumns="80px 1fr 200px" borderBottom="1px solid black">
            <Typography p={1} borderRight="1px solid black"></Typography>
            <Typography p={1} borderRight="1px solid black">Associate Dean (R&D)</Typography>
            <Typography p={1}>&gt; 01 Lakh ≤ 02 Lakh</Typography>
          </Box>

          {/* Row 3 */}
          <Box display="grid" gridTemplateColumns="80px 1fr 200px">
            <Typography p={1} borderRight="1px solid black">II</Typography>
            <Typography p={1} borderRight="1px solid black">Director</Typography>
            <Typography p={1}>&gt; 02 Lakh</Typography>
          </Box>

        </Box>
      </Box>

      <Typography align="center" mt={2} fontSize={12}>
        Page 1 of 1
      </Typography>

    </Paper>
    <Box mt={2} display="flex" justifyContent="space-between">
    <Button variant="text" onClick={() => navigate("/forms")}>
      Back to Forms
    </Button>

    <Button
      variant="contained"
      onClick={handleSubmit}
      disabled={submitting}
    >
      {submitting ? "Submitting..." : "Submit"}
    </Button>
  </Box>
  </Container>
);
};

export default CCRDRecommendationTwoBidPurchaseGeM;
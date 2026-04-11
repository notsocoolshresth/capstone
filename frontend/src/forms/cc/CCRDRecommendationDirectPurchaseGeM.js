import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";

// table cell style
const cell = {
  border: "1px solid black",
  padding: "6px",
  fontSize: "13px",
};

// underline input style
const input = {
  border: "none",
  borderBottom: "1px solid black",
  outline: "none",
  fontFamily: "Times New Roman",
  fontSize: "14px",
};

const ComputerCenterRDRecommendationGeM = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    projectNo: "",
    date: "",
    itemDescription: "",
    indentDate: "",
    indentItemName: "",
    recommendedItemName: "",

    // 🔥 table fields
    srNo_1: "1",
    srNo_2: "2",
    srNo_3: "3",

    itemDesc_1: "",
    itemDesc_2: "",
    itemDesc_3: "",

    rate_1: "",
    rate_2: "",
    rate_3: "",

    qty_1: "",
    qty_2: "",
    qty_3: "",

    totalPrice_1: "",
    totalPrice_2: "",
    totalPrice_3: "",
  });

  const handleChange = (key) => (e) => {
    setValues({ ...values, [key]: e.target.value });
  };

  // Handle prefill data when "Edit as New" is clicked
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill && typeof prefill === "object") {
      setValues((prev) => ({
        ...prev,
        ...prefill,
      }));
    }
  }, [location.state]);

  const handleSubmit = async () => {
    await API.post("/submissions", {
      templateId: "cc-rd-recommendation-gem",
      responses: values,
    });
    navigate("/submissions");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          fontFamily: "Times New Roman",
          fontSize: "14px",
          lineHeight: "1.3",
          padding: "40px",
          background: "#fff",
        }}
      >

        {/* HEADER */}
        <Box textAlign="right">
          <Typography>Form No. P002</Typography>
          <Typography>
            Project No{" "}
            <input
              style={{ ...input, width: 180 }}
              value={values.projectNo}
              onChange={handleChange("projectNo")}
            />{" "}
            (If applicable)
          </Typography>
        </Box>

        {/* TITLE */}
        <Typography align="center" fontWeight="bold" mt={2}>
          Format for procurement by Local Purchase Committee
        </Typography>

        {/* DATE */}
        <Box textAlign="right" mt={1}>
          Date:{" "}
          <input
            type="date"
            style={input}
            value={values.date}
            onChange={handleChange("date")}
          />
        </Box>

        {/* TITLE LINE */}
        <Typography mt={2}>
          <b>Recommendation cum Sanction Sheet for the purchase of </b>
          <input
            style={{ ...input, width: 250 }}
            value={values.itemDescription}
            onChange={handleChange("itemDescription")}
          />
        </Typography>

        {/* PARAGRAPH */}
        <Typography mt={1}>
          An indent dated{" "}
          <input
            type="date"
            style={input}
            value={values.indentDate}
            onChange={handleChange("indentDate")}
          />{" "}
          for the purchase of “
          <input
            style={input}
            value={values.indentItemName}
            onChange={handleChange("indentItemName")}
          />
          ” has been approved by the competent authority. The specification was
          compared on GeM portal by Computer Centre, and a comparison sheet for
          three different items is generated (attached). Based on the comparison
          sheet, the L1 item matching the required specification is as follows: -
        </Typography>

        {/* ✅ EDITABLE TABLE */}
        <Box mt={2}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e8d0bd" }}>
                <th style={cell}>Sr. No.</th>
                <th style={cell}>Item Description</th>
                <th style={cell}>Rate</th>
                <th style={cell}>Qty.</th>
                <th style={cell}>Total Price in ₹</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td style={cell}>
                    <input
                      style={{ width: "100%", border: "none", outline: "none", textAlign: "center", fontFamily: "Times New Roman" }}
                      value={values[`srNo_${i}`]}
                      onChange={handleChange(`srNo_${i}`)}
                    />
                  </td>

                  <td style={cell}>
                    <input
                      style={{ width: "100%", border: "none", outline: "none", fontFamily: "Times New Roman" }}
                      value={values[`itemDesc_${i}`]}
                      onChange={handleChange(`itemDesc_${i}`)}
                    />
                  </td>

                  <td style={cell}>
                    <input
                      style={{ width: "100%", border: "none", outline: "none", fontFamily: "Times New Roman" }}
                      value={values[`rate_${i}`]}
                      onChange={handleChange(`rate_${i}`)}
                    />
                  </td>

                  <td style={cell}>
                    <input
                      style={{ width: "100%", border: "none", outline: "none", fontFamily: "Times New Roman" }}
                      value={values[`qty_${i}`]}
                      onChange={handleChange(`qty_${i}`)}
                    />
                  </td>

                  <td style={cell}>
                    <input
                      style={{ width: "100%", border: "none", outline: "none", fontFamily: "Times New Roman" }}
                      value={values[`totalPrice_${i}`]}
                      onChange={handleChange(`totalPrice_${i}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* AMOUNT */}
        <Typography align="center" mt={2}>
          <b>(Amount in words)</b>
        </Typography>

        {/* CERTIFIED */}
        <Typography mt={2}>
          Certified that we, members of the purchase committee are jointly and
          individually satisfied that the goods recommended for purchase are of
          the requisite specification and quality, priced at the prevailing
          market rate.
        </Typography>

        <Typography mt={1}>
          Keeping above point in view, the committee recommends that procurement
          of “
          <input
            style={input}
            value={values.recommendedItemName}
            onChange={handleChange("recommendedItemName")}
          />
          ” may be placed for the L1 item on GeM portal.
        </Typography>

        <Typography mt={1}>
          Amount as per details given in the above table may be sanctioned.
        </Typography>

        {/* MEMBERS */}
        <Box display="flex" justifyContent="space-between" mt={5}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} width="22%" textAlign="center">
              <Box borderBottom="1px solid black" mb={1}></Box>
              <Typography>(Member {i})</Typography>
            </Box>
          ))}
        </Box>

        {/* GEM ACCOUNT */}
        <Box mt={4}>
          <Typography>For GeM Account:</Typography>

          <Box display="flex" justifyContent="space-between" mt={1}>
            <Box width="30%">
              <Box borderBottom="1px solid black"></Box>
              <Typography align="center">JTS/TS (CC)</Typography>
            </Box>

            <Box width="30%">
              <Box borderBottom="1px solid black"></Box>
              <Typography align="center">HoD (CC)</Typography>
            </Box>
          </Box>
        </Box>

        {/* INVESTIGATORS */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Box width="30%">
            <Box borderBottom="1px solid black"></Box>
            <Typography align="center">Investigator(s)</Typography>
          </Box>

          <Box width="30%">
            <Box borderBottom="1px solid black"></Box>
            <Typography align="center">AR(R&D)</Typography>
          </Box>

          <Box width="30%">
            <Box borderBottom="1px solid black"></Box>
            <Typography align="center">DR(R&D)</Typography>
          </Box>
        </Box>

        {/* A DEAN */}
        <Box mt={4} textAlign="center">
          <Box borderBottom="1px solid black" width="200px" mx="auto"></Box>
          <Typography>A Dean(R&D)</Typography>
        </Box>

        {/* DIRECTOR */}
        <Box mt={3} textAlign="right">
          <Typography fontWeight="bold">Director</Typography>
          <Typography fontWeight="bold">IIT Patna</Typography>
        </Box>

        {/* NOTE */}
        <Box mt={4}>
          <Typography><b>Note:</b></Typography>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "5px" }}>
            <thead>
              <tr>
                <th style={cell}>Sl No.</th>
                <th style={cell}>Functionaries</th>
                <th style={cell}>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cell}>I</td>
                <td style={cell}>Investigator(s)</td>
                <td style={cell}>Upto 01 Lakh</td>
              </tr>
              <tr>
                <td style={cell}>II</td>
                <td style={cell}>Associate Dean (R&D)</td>
                <td style={cell}>&gt; 01 Lakh ≤ 02 Lakh</td>
              </tr>
              <tr>
                <td style={cell}>III</td>
                <td style={cell}>Director</td>
                <td style={cell}>&gt; 02 Lakh</td>
              </tr>
            </tbody>
          </table>
        </Box>

        {/* FOOTER */}
        <Typography align="center" mt={3}>
          Page 1 of 1
        </Typography>

        {/* SUBMIT */}
        <Box mt={3} textAlign="right">
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>

      </Box>
    </Container>
  );
};

export default ComputerCenterRDRecommendationGeM;
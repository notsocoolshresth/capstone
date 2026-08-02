import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import {
  getErrorMessage,
  prepareSubmissionPayload,
} from "../utils/formValidation";

const createEmptyTableRow = (field = {}) =>
  Object.fromEntries(
    (Array.isArray(field.columns) ? field.columns : []).map((column) => [
      column.name,
      "",
    ])
  );

const getInitialFieldValue = (field = {}, prefillValue) => {
  if (field.type !== "table") {
    return prefillValue ?? "";
  }

  const parsedValue =
    typeof prefillValue === "string"
      ? (() => {
          try {
            return JSON.parse(prefillValue);
          } catch {
            return [];
          }
        })()
      : prefillValue;

  if (Array.isArray(parsedValue) && parsedValue.length > 0) {
    return parsedValue;
  }

  const rowCount = Math.max(Number(field.defaultRows) || 0, Number(field.minRows) || 0, 1);
  return Array.from({ length: rowCount }, () => createEmptyTableRow(field));
};

const renderFieldInput = ({
  field,
  value,
  onChange,
}) => {
  if (field.type === "radio") {
    return (
      <Box key={field.name} sx={{ mt: 2 }}>
        <FormControl component="fieldset" required={field.required}>
          <FormLabel component="legend">{field.label}</FormLabel>
          <RadioGroup row value={value} onChange={onChange}>
            {(field.options || []).map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    );
  }

  const commonProps = {
    key: field.name,
    label: field.label,
    fullWidth: true,
    required: field.required,
    value,
    onChange,
    margin: "normal",
    helperText: field.helperText || "",
    placeholder: field.placeholder || "",
  };

  if (field.type === "textarea") {
    return (
      <TextField
        {...commonProps}
        multiline
        minRows={field.minRows || 3}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  if (field.type === "select") {
    return (
      <TextField
        {...commonProps}
        select
        InputLabelProps={{ shrink: true }}
      >
        {(field.options || []).map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (field.type === "number") {
    return <TextField {...commonProps} type="number" InputLabelProps={{ shrink: true }} />;
  }

  if (field.type === "date") {
    return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />;
  }

  if (field.type === "email") {
    return <TextField {...commonProps} type="email" InputLabelProps={{ shrink: true }} />;
  }

  return <TextField {...commonProps} InputLabelProps={{ shrink: true }} />;
};

const FormFill = () => {
  const { templateId, templateRef } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const resolvedTemplateRef = templateRef || templateId || "";
  const prefill = location.state?.prefill;
  const parentSubmissionId = location.state?.parentSubmissionId;

  const [template, setTemplate] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/forms/templates");
        const templates = res.data || [];
        const found =
          templates.find((item) => item?._id === resolvedTemplateRef) ||
          templates.find((item) => item?.code === resolvedTemplateRef);

        if (!found) {
          setError("Form template not found");
          setTemplate(null);
          setValues({});
          return;
        }

        const initialValues = {};
        const incomingPrefill =
          prefill && typeof prefill === "object" ? prefill : {};

        (found.fields || []).forEach((field) => {
          initialValues[field.name] = getInitialFieldValue(field, incomingPrefill[field.name]);
        });

        Object.entries(incomingPrefill).forEach(([key, value]) => {
          if (!(key in initialValues)) {
            initialValues[key] = value;
          }
        });

        setTemplate(found);
        setValues(initialValues);
      } catch {
        setError("Failed to load form template");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [prefill, resolvedTemplateRef]);

  const handleFieldChange = (name) => (event) => {
    setValues((previous) => ({
      ...previous,
      [name]: event.target.value,
    }));
  };

  const handleTableCellChange = (fieldName, rowIndex, columnName) => (event) => {
    const nextValue = event.target.value;
    setValues((previous) => {
      const existingRows = Array.isArray(previous[fieldName]) ? previous[fieldName] : [];
      const nextRows = existingRows.map((row, index) =>
        index === rowIndex ? { ...row, [columnName]: nextValue } : row
      );
      return {
        ...previous,
        [fieldName]: nextRows,
      };
    });
  };

  const addTableRow = (field) => {
    setValues((previous) => {
      const existingRows = Array.isArray(previous[field.name]) ? previous[field.name] : [];
      return {
        ...previous,
        [field.name]: [...existingRows, createEmptyTableRow(field)],
      };
    });
  };

  const removeTableRow = (field, rowIndex) => {
    setValues((previous) => {
      const existingRows = Array.isArray(previous[field.name]) ? previous[field.name] : [];
      const minimumRows = Math.max(Number(field.minRows) || 0, 1);

      if (existingRows.length <= minimumRows) {
        return previous;
      }

      return {
        ...previous,
        [field.name]: existingRows.filter((_, index) => index !== rowIndex),
      };
    });
  };

  const handleSubmit = async () => {
    if (!template) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { payload } = await prepareSubmissionPayload({
        template,
        templateId: template._id,
        responses: values,
        parentSubmissionId,
      });

      await API.post("/submissions", payload);
      navigate("/submissions");
    } catch (submissionError) {
      setError(getErrorMessage(submissionError, "Failed to submit form. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!template) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error || "Form not found"}</Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate("/forms")}>
            Back to Forms
          </Button>
        </Box>
      </Container>
    );
  }

  let previousSection = "";

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mt: 1, mb: 3, display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {template.title}
          </Typography>
          {template.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 900 }}>
              {template.description}
            </Typography>
          )}
        </Box>
        <Button variant="text" onClick={() => navigate("/forms")}>
          Back to Forms
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        {(template.fields || []).map((field) => {
          const currentSection = String(field.section || "").trim();
          const shouldRenderSectionHeader = currentSection && currentSection !== previousSection;
          previousSection = currentSection || previousSection;

          if (field.type === "table") {
            const rows = Array.isArray(values[field.name]) ? values[field.name] : [];
            const minimumRows = Math.max(Number(field.minRows) || 0, 1);

            return (
              <Box key={field.name} sx={{ mt: 3 }}>
                {shouldRenderSectionHeader && (
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {currentSection}
                  </Typography>
                )}

                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {field.label}
                </Typography>
                {field.helperText && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {field.helperText}
                  </Typography>
                )}

                <Box sx={{ overflowX: "auto", border: "1px solid #d8dbe3", borderRadius: 1 }}>
                  <Box
                    sx={{
                      minWidth: Math.max((field.columns || []).length * 180, 720),
                      display: "grid",
                      gridTemplateColumns: `${(field.columns || []).map(() => "minmax(180px, 1fr)").join(" ")} 110px`,
                    }}
                  >
                    {(field.columns || []).map((column) => (
                      <Box
                        key={`${field.name}-${column.name}-header`}
                        sx={{
                          p: 1,
                          borderBottom: "1px solid #d8dbe3",
                          bgcolor: "#f7f8fb",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {column.label}
                      </Box>
                    ))}
                    <Box
                      sx={{
                        p: 1,
                        borderBottom: "1px solid #d8dbe3",
                        bgcolor: "#f7f8fb",
                        fontWeight: 700,
                        fontSize: 13,
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </Box>

                    {rows.map((row, rowIndex) => (
                      <React.Fragment key={`${field.name}-row-${rowIndex}`}>
                        {(field.columns || []).map((column) => (
                          <Box
                            key={`${field.name}-${column.name}-${rowIndex}`}
                            sx={{
                              p: 1,
                              borderBottom: "1px solid #edf0f5",
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              label={column.label}
                              type={
                                column.type === "date" || column.type === "number" || column.type === "email"
                                  ? column.type
                                  : "text"
                              }
                              select={column.type === "select"}
                              multiline={column.type === "textarea"}
                              minRows={column.type === "textarea" ? 2 : undefined}
                              InputLabelProps={{ shrink: true }}
                              value={row?.[column.name] ?? ""}
                              onChange={handleTableCellChange(field.name, rowIndex, column.name)}
                            >
                              {column.type === "select" &&
                                (column.options || []).map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Box>
                        ))}
                        <Box
                          sx={{
                            p: 1,
                            borderBottom: "1px solid #edf0f5",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            color="error"
                            variant="text"
                            onClick={() => removeTableRow(field, rowIndex)}
                            disabled={rows.length <= minimumRows}
                          >
                            Remove
                          </Button>
                        </Box>
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={() => addTableRow(field)}>
                    Add Row
                  </Button>
                </Box>
              </Box>
            );
          }

          return (
            <Box key={field.name} sx={{ mt: 2 }}>
              {shouldRenderSectionHeader && (
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                  {currentSection}
                </Typography>
              )}
              {renderFieldInput({
                field,
                value: values[field.name] ?? "",
                onChange: handleFieldChange(field.name),
              })}
            </Box>
          );
        })}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/forms")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FormFill;

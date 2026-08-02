const mongoose = require("mongoose");

const tableColumnSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "number", "date", "textarea", "select", "radio", "file", "email"],
      default: "text",
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [String],
      default: [],
    },
    width: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "number", "date", "textarea", "select", "radio", "file", "email", "table"],
    default: "text",
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [String],
    default: [],
  },
  section: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  helperText: {
    type: String,
    default: "",
  },
  minRows: {
    type: Number,
    default: 0,
  },
  defaultRows: {
    type: Number,
    default: 0,
  },
  columns: {
    type: [tableColumnSchema],
    default: [],
  },
});

const formTemplateSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    section: {
      type: String,
      trim: true,
      default: "",
    },
    fields: [fieldSchema],
    // Ordered list of roles that must approve this form.
    // Example: ["HOD", "Dean", "Director"] or ["HOD"] etc.
    approvalStages: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormTemplate", formTemplateSchema);

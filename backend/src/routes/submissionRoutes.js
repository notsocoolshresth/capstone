const express = require("express");
const multer = require("multer");

const {
  submitForm,
  getMySubmissions,
  getSubmissionById,
  getPendingApprovals,
  actOnSubmission,
  generateSubmissionPDF,
} = require("../controllers/submissionController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (String(file.mimetype || "").toLowerCase().startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image uploads are allowed"));
  },
});

function handleSubmissionUpload(req, res, next) {
  upload.single("responses[photo]")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    next();
  });
}

router.post("/", protect, handleSubmissionUpload, submitForm);
router.get("/me", protect, getMySubmissions);
router.get("/pending/list", protect, getPendingApprovals);
router.get("/:id", protect, getSubmissionById);
router.post("/:id/act", protect, actOnSubmission);
router.get("/:id/pdf", protect, generateSubmissionPDF);

module.exports = router;

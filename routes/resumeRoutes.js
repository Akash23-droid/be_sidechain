const express = require("express");
const multer = require("multer");
const os = require("os");
const ResumeController = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

router.post("/upload", upload.single("resume"), ResumeController.uploadResume);
router.get("/data", ResumeController.getData);

module.exports = router;

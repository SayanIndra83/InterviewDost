import express from "express"
import { isAuthinticated } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/file.middlewares.js";
import { generateResumePdf, getReport, getReports, interviewResumeController } from "../controllers/interview.controllers.js";
const router = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate an interview report based on the candidate's resume pdf, self-description, and job description.
 * @access for only authiricated users
 */
router.post("/", isAuthinticated, upload.single("resume"), interviewResumeController)
router.get("/report/:interviewId", isAuthinticated, getReport)
router.get("/reports", isAuthinticated, getReports)
router.post("/resume/pdf/:interviewId",isAuthinticated, generateResumePdf )
export default router;
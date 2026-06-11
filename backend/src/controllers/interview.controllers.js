import { createRequire } from "module";
import {generateInterviewReport, ResumePdf} from "../services/ai.service.js"
import Report from "../models/interview.models.js"

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const interviewResumeController = async (req, res) => {

try {
    // get resume file from req.file
    // console.log(req.body)
    const resumeFile = req.file
    
    if(!resumeFile) {
        return res.status(400).json({
            success: false,
            message: "No resume provided"
        })
    }

    // console.log("Resume found")
    // get the contents of resume by pdf-parse
    const uint8ArrayData = new Uint8Array(resumeFile.buffer);

const resumeContent = await (new pdfParse.PDFParse(uint8ArrayData)).getText();
    
    // console.log("Resume Content :", resumeContent)
    // get selfDescription and jobDescription
    const {selfDescription, jobDescription} = req.body
    // console.log("selfDescription, jd and ai generating started", selfDescription)
    // send it to ai
    const interviewReportbyAI = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    })
    
    if(!interviewReportbyAI){
        return res.status(400).json({
            success: false,
            message: "Failed to generate interview report"
        })

    }

    // console.log("Got response from ai :", interviewReportbyAI)
    // get the ai response and create report in db
    
    const interviewReport = await Report.create({
        user: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportbyAI
    })

    if(!interviewReport){
        return res.status(400).json({
            success: false,
            message: "Failed to create interview report in database"
        })
    }   
    
    // console.log("Database creationg done successfully", interviewReport)
    return res.status(200).json({
        message: "Report generated",
        interviewReport
    })
} catch (error) {
    console.log("Error:", error)
    return res.status(500).json({
        success: false,
        message: "Something went wrong while creating interview reeport"
    })
}
}

const getReport = async (req, res) => {
try {
        const {interviewId} = req.params
        console.log("Req.params", req.params, req.user)
        const report = await Report.findOne({_id: interviewId, user: req.user._id});
        if(!report){
            return res.status(404).json({
                success: false,
                message: "Report not found"
            })
        }
        return res.status(200).json({
            report,
            message:"Report fetched successfully"
        })  
} catch (error) {
    console.log("Error:", error)
    return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching the report"
    })
}
}

const getReports = async (req, res) => {
    const user = req.user;
    //    console.log("Fetching reports for user:", user )
    try {
       const reports = await Report.find({ user: user._id }).select("-resume -selfDescription -jobDescription -preparationPlan -technicalQuestions -behavioralQuestions -skillGaps -__v -ATSscore").sort({ createdAt: -1 });
       return res.json({
           success: true,
           reports
       });
    } catch (error) {
        console.log("Fetching all reports Error:", error)
        return res.json({
            success: false,
            message: "Something went wrong while fetching the reports"
        })
    }
}


const generateResumePdf = async(req, res) => {
    try {
        const {interviewId} = req.params
    
       const interviewReport = await Report.findById(interviewId);
    
       if(!interviewReport){
        return res.status(404).json(
            {
                message: "Report not found"
            }
        )
       }
    
       const {resume, selfDescription, jobDescription} = interviewReport;
    
       const pdf = await ResumePdf({jobDescription, resume, selfDescription})
       
       res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition":`attachment; fileName=resume_${interviewId}.pdf`
       })
    
       res.send(pdf)
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        return res.status(500).json({
            message: "Failed to generate resume PDF"
        })
    }
}
export { interviewResumeController, getReport, getReports, generateResumePdf }
const mongoose = require("mongoose")
const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, generateNewQuestions } = require("../services/ai.service")
const logger = require("../utils/logger")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription, title } = req.body

        // Resume is optional — user may provide only a self-description
        let resumeText = ""
        if (req.file?.buffer) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
        }

        if (!resumeText && !selfDescription?.trim()) {
            return res.status(400).json({ message: "Please provide either a resume file or a self-description." })
        }

        if (!jobDescription?.trim()) {
            return res.status(400).json({ message: "Job description is required." })
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            title,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        logger.error("Error generating interview report: %O", error)
        res.status(500).json({ message: `Failed to generate interview report. Error: ${error?.message || error}` })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid report ID." })
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        logger.error("Error fetching interview report: %O", error)
        res.status(500).json({ message: "Failed to fetch interview report." })
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        logger.error("Error fetching all interview reports: %O", error)
        res.status(500).json({ message: "Failed to fetch interview reports." })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, selfDescription, jobDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        logger.error("Error generating resume PDF: %O", error)
        res.status(500).json({
            message: `Failed to generate resume PDF. Error: ${error?.message || error}`
        })
    }
}

/**
 * @description Controller to delete an interview report by interviewId.
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid report ID." })
        }

        const interviewReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report deleted successfully."
        })
    } catch (error) {
        logger.error("Error deleting interview report: %O", error)
        res.status(500).json({ message: "Failed to delete interview report." })
    }
}

/**
 * @description Controller to regenerate technical or behavioral questions.
 */
async function regenerateQuestionsController(req, res) {
    try {
        const { interviewId } = req.params
        const { type } = req.body

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid report ID." })
        }

        if (!["technical", "behavioral"].includes(type)) {
            return res.status(400).json({ message: "Invalid question type." })
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const existingQuestions = type === "technical" ? interviewReport.technicalQuestions : interviewReport.behavioralQuestions;

        const newQuestions = await generateNewQuestions({
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription,
            existingQuestions,
            type
        })

        if (!newQuestions || newQuestions.length === 0) {
            return res.status(500).json({ message: "AI failed to generate new questions. Please try again." })
        }

        if (type === "technical") {
            interviewReport.technicalQuestions = newQuestions
        } else {
            interviewReport.behavioralQuestions = newQuestions
        }

        await interviewReport.save()

        res.status(200).json({
            message: `${type} questions regenerated successfully.`,
            interviewReport
        })
    } catch (error) {
        logger.error("Error regenerating questions: %O", error)
        res.status(500).json({ message: "Failed to generate new questions due to a server error. Please try again." })
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteInterviewReportController, regenerateQuestionsController }
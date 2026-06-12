const express = require("express")
const rateLimit = require("express-rate-limit")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

// Rate limiter only for AI-generating endpoints
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: "Too many AI requests. Please try again after some time." },
    standardHeaders: true,
    legacyHeaders: false,
})

/**
 * @route POST /api/interview
 * @description Generate new interview report on the basis of user self description,resume pdf and job description.
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, aiLimiter, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewId", authMiddleware.authUser, aiLimiter, interviewController.generateResumePdfController)

/**
 * @route DELETE /api/interview/:interviewId
 * @description Delete an interview report by ID.
 * @access private
 */
interviewRouter.delete("/:interviewId", authMiddleware.authUser, interviewController.deleteInterviewReportController)

/**
 * @route POST /api/interview/questions/regenerate/:interviewId
 * @description Regenerate questions.
 * @access private
 */
interviewRouter.post("/questions/regenerate/:interviewId", authMiddleware.authUser, aiLimiter, interviewController.regenerateQuestionsController)

module.exports = interviewRouter
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const logger = require('./utils/logger')

const app = express()

// Trust proxy to allow express-rate-limit to get the correct client IP on Render
app.set('trust proxy', 1)

app.use(helmet())

// Define Rate Limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per 15 mins
    message: { message: "Too many authentication attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
})

const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 AI requests per hour
    message: { message: "Too many interview requests. Please try again after sometime." },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://skillbridge-ai-prep.vercel.app",
    credentials: true
}))

// Health check endpoint for UptimeRobot monitoring
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" })
})

/* require all the routes here */
const authRouter = require("./routs/auth.routs")
const interviewRouter = require("./routs/interview.routs")

/* using all the routes here with rate limiting */
app.use("/api/auth", authLimiter, authRouter)
app.use("/api/interview", interviewRouter)

// Centralized error handler
app.use((err, req, res, next) => {
    logger.error(err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

module.exports = app
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('./utils/logger')

const app = express()

// Trust proxy to allow express-rate-limit to get the correct client IP on Render
app.set('trust proxy', 1)

app.use(helmet())


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
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Centralized error handler
app.use((err, req, res, next) => {
    logger.error(err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

module.exports = app
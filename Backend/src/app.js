const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routs/auth.routs")
const interviewRouter = require("./routs/interview.routs")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app
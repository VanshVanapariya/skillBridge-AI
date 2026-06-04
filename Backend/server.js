require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const logger = require("./src/utils/logger")

connectToDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})
const mongoose = require("mongoose")


const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'
    }
}, {
    timestamps: true
})

const tokenBlacklistModel = mongoose.model("Blacklist", blacklistSchema)

module.exports = tokenBlacklistModel


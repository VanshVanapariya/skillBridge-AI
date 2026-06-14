const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 //3MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["application/pdf"]; // Only PDF — DOCX has no parser in this project
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PDF format is allowed."), false);
        }
    }
})

module.exports = upload
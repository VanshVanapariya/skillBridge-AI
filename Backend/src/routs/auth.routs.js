const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const authRouter = Router()

// Rate limit only write/sensitive auth actions, NOT get-me (called on every refresh)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: "Too many authentication attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
})

/**
 * @route POST /api/auth/register
 * @description Register a new user 
 * @access Public
 */
authRouter.post("/register", authLimiter, authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
authRouter.post("/login", authLimiter, authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Clear token in user cookie and add token in blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Get the current logged in user details
 * @access Private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

/**
 * @route POST /api/auth/forgot-password
 * @description Request a password reset link
 * @access Public
 */
authRouter.post("/forgot-password", authLimiter, authController.forgotPasswordController)

/**
 * @route POST /api/auth/reset-password/:token
 * @description Reset user password
 * @access Public
 */
authRouter.post("/reset-password/:token", authLimiter, authController.resetPasswordController)

module.exports = authRouter

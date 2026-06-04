const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPasswordResetEmail = async (to, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Password Reset Request | SkillBridge AI',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <!-- Container Card -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;">
                            <!-- Top Accent Bar -->
                            <tr>
                                <td height="6" style="background: linear-gradient(90deg, #ff2d78 0%, #9333ea 100%);"></td>
                            </tr>
                            <!-- Header / Brand -->
                            <tr>
                                <td style="padding: 32px 40px 24px 40px; text-align: left; border-bottom: 1px solid #f0f0f0;">
                                    <span style="font-size: 20px; font-weight: 800; color: #0d1117; letter-spacing: -0.5px;">SkillBridge <span style="color: #ff2d78;">AI</span></span>
                                </td>
                            </tr>
                            <!-- Content Body -->
                            <tr>
                                <td style="padding: 40px; text-align: left;">
                                    <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #0d1117; line-height: 1.3;">Reset Your Password</h1>
                                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4a5568;">Hello,</p>
                                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4a5568;">
                                        We received a request to reset the password for your SkillBridge AI account. Click the button below to choose a new password:
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                        <tr>
                                            <td align="center" style="border-radius: 12px; background: linear-gradient(90deg, #ff2d78 0%, #9333ea 100%);">
                                                <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px;">Reset Password</a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin: 24px 0 12px 0; font-size: 13px; line-height: 1.5; color: #718096; font-style: italic;">
                                        Note: This password reset link is only valid for the next 60 minutes and can be used only once.
                                    </p>
                                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #718096; border-top: 1px solid #f0f0f0; padding-top: 20px;">
                                        If you did not request this, you can safely ignore this email. Your password will remain secure and unchanged.
                                    </p>
                                    
                                    <!-- Backup Link -->
                                    <div style="margin-top: 30px; padding: 16px; background-color: #f7fafc; border-radius: 8px; border: 1px solid #edf2f7;">
                                        <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px;">Having trouble with the button?</p>
                                        <p style="margin: 0; font-size: 12px; line-height: 1.4; word-break: break-all;">
                                            <a href="${resetUrl}" target="_blank" style="color: #ff2d78; text-decoration: underline;">${resetUrl}</a>
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 32px 40px; background-color: #fafbfc; border-top: 1px solid #f0f0f0; text-align: center;">
                                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #a0aec0;">
                                        You received this email because you requested a password reset.
                                    </p>
                                    <p style="margin: 0; font-size: 12px; color: #a0aec0; font-weight: 500;">
                                        © 2026 SkillBridge AI. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };

import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp, type = 'register') => {
  const subject =
    type === 'register'
      ? 'Verify Your Email - One-Time Password (OTP)'
      : 'Reset Your Password - One-Time Password (OTP)';

  const heading =
    type === 'register'
      ? 'Welcome to <span style="color:#2f1cd9;">Adhunika</span>!'
      : 'Password Reset Request';

  const message =
    type === 'register'
      ? `Thank you for registering with <strong>Adhunika E-com Platform</strong>. To complete your sign-up process, please verify your email address by entering the OTP below:`
      : `You’ve requested to reset your password for your <strong>Adhunika</strong> account. Use the OTP below to proceed with resetting your password:`;

  const ignoreNote =
    type === 'register'
      ? `If you did not request this registration, please ignore this email.`
      : `If you did not request a password reset, you can safely ignore this email.`;

  const mailOptions = {
    from: `"Adhunika E-com Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #2b2d42;">${heading}</h2>
          <p>Hello there,</p>
          <p>${message}</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 30px; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #ffffff; background:#141e73; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p>This OTP is valid for the next <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p>${ignoreNote} No changes will be made to your account.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 14px; color: #888888;">Regards,<br><strong>Adhunika Team</strong></p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendNewPasswordEmail = async (email, newPassword) => {
  const mailOptions = {
    from: `"Adhunika E-com Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your New Password - Adhunika E-com Platform',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #2b2d42;">Your Password Has Been Reset</h2>
          <p>Hello,</p>
          <p>Your password has been successfully reset by our system. Below is your new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 12px 24px; background-color: #ef233c; color: #fff; font-size: 20px; font-weight: bold; border-radius: 6px;">
              ${newPassword}
            </span>
          </div>
          <p>We recommend you log in using this password and change it immediately from your profile settings for security purposes.</p>
          <p>If you did not request this change, please contact our support team immediately.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 14px; color: #888;">Best regards,<br><strong>Adhunika Team</strong></p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

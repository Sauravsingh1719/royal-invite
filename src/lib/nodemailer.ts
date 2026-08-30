import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 465;

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port,
  // Port 465 uses direct SSL (secure: true). Port 587 uses STARTTLS (secure: false).
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Prevents serverless lambdas from hanging on socket connections
  connectionTimeout: 8000,
  greetingTimeout: 5000,
  socketTimeout: 8000,
});

// Fallback to the authenticated SMTP user to prevent Gmail delivery rejections
export const EMAIL_FROM =
  process.env.EMAIL_FROM || `"RoyalInvites" <${process.env.SMTP_USER}>`;
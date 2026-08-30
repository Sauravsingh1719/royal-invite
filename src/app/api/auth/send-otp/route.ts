import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { transporter, EMAIL_FROM } from "@/lib/nodemailer";
import { getOtpTemplate } from "@/lib/email-templates";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    // 1. Generate & Hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 2. Persist to MongoDB
    user.otpToken = hashedOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity
    await user.save();

    // 3. Await SMTP delivery before terminating the serverless lambda
   await transporter.sendMail({
  from: EMAIL_FROM,
  to: user.email,
  subject: `${otp} is your RoyalInvites verification code`,
  text: `Your RoyalInvites verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this code, you can safely ignore this email.`,
  html: getOtpTemplate(otp),
  headers: {
    "X-Priority": "1",
    "Precedence": "bulk",
  },
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error: any) {
    console.error("[OTP Send Error]:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
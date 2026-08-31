import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { transporter, EMAIL_FROM } from "@/lib/nodemailer";
import { getOtpTemplate } from "@/lib/email-templates";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await dbConnect();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    user.otpToken = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send Signin OTP
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

    return NextResponse.json(
      { message: "Verification code sent to your email" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Signin OTP Send Error]:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process signin" },
      { status: 500 }
    );
  }
}
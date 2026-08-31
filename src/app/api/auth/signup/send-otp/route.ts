import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { transporter, EMAIL_FROM } from "@/lib/nodemailer";
import { getOtpTemplate } from "@/lib/email-templates";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await dbConnect();

    // Check if verified account already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name || existingUser.name;
      existingUser.password = hashedPassword;
      existingUser.otpToken = hashedOtp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      await User.create({
        name: name || "Creator",
        email: normalizedEmail,
        password: hashedPassword,
        otpToken: hashedOtp,
        otpExpires,
        isVerified: false,
        role: "user",
      });
    }

    // Send Verification Email (using normalizedEmail)
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: normalizedEmail,
      subject: `${otp} is your RoyalInvites verification code`,
      text: `Welcome to RoyalInvites!\n\nYour 6-digit verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not create an account, please disregard this email.`,
      html: getOtpTemplate(otp),
      headers: {
        "X-Priority": "1",
        "Precedence": "bulk",
      },
    });

    return NextResponse.json(
      { message: "Verification code sent to your email successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Signup OTP Send Error]:", error);
    return NextResponse.json(
      { message: error.message || "Failed to send verification code" },
      { status: 500 }
    );
  }
}
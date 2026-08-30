import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { transporter, EMAIL_FROM } from "@/lib/nodemailer";
import { getOtpTemplate } from "@/lib/email-templates";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    // Reject if a verified account already exists
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser) {
      // Re-use unverified record
      existingUser.name = name.trim();
      existingUser.password = hashedPassword;
      existingUser.otpToken = hashedOtp;
      existingUser.otpExpires = otpExpires;
      existingUser.isVerified = false;
      await existingUser.save();
    } else {
      // Create new unverified user
      const newUser = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        otpToken: hashedOtp,
        otpExpires,
      });
      await newUser.save();
    }

    // Fire-and-forget background email dispatch
    transporter
      .sendMail({
        from: EMAIL_FROM,
        to: normalizedEmail,
        subject: "Verify Your RoyalInvites Account",
        html: getOtpTemplate(otp),
      })
      .then((info) => console.log(`[Signup OTP Sent]: ${info.messageId} to ${normalizedEmail}`))
      .catch((err) => console.error("[Signup Email Error]:", err));

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error: any) {
    console.error("Signup OTP error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
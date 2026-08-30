import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ message: "Registration session not found. Please sign up again." }, { status: 400 });
    }

    if (!user.otpToken || !user.otpExpires) {
      return NextResponse.json({ message: "No verification code requested." }, { status: 400 });
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json({ message: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(otp.trim(), user.otpToken);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid verification code. Please try again." }, { status: 400 });
    }

    // Finalize registration
    user.isVerified = true;
    user.otpToken = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error: any) {
    console.error("Signup verification error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
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

    // 2. Persist to MongoDB first to ensure authorization will succeed
    user.otpToken = hashedOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // 3. Fire-and-Forget: Dispatch email in background without blocking response
    transporter
      .sendMail({
        from: EMAIL_FROM,
        to: user.email,
        subject: "Your RoyalInvites Verification Code",
        html: getOtpTemplate(otp),
      })
      .then((info) => {
        console.log(`[Background OTP Sent]: ${info.messageId} to ${user.email}`);
      })
      .catch((err) => {
        console.error("[Background Email Failed]:", err);
      });

    // 4. Return instant response to client
    return NextResponse.json({
      success: true,
      message: "Verification code generated and dispatched",
    });
  } catch (error) {
    console.error("OTP generation error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
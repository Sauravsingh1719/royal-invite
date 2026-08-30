import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();

    const existingUser = await User.findOne({ email: "admin@royalinvites.com" });
    if (existingUser) {
      return NextResponse.json({
        message: "Admin already exists. You can log in directly.",
        email: "admin@royalinvites.com",
        password: "Admin@123",
      });
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const user = new User({
      name: "Saurav Singh",
      email: "admin@royalinvites.com",
      password: hashedPassword,
      role: "admin",
    });

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully!",
      credentials: {
        email: "admin@royalinvites.com",
        password: "Admin@123",
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ message: error.message || "Failed to seed admin" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Wedding from "@/models/Wedding";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
  }

  await dbConnect();

  try {
    const totalUsersCount = await User.countDocuments();
    const totalInvitesCount = await Wedding.countDocuments();
    const verifiedUsersCount = await User.countDocuments({ isVerified: true });

    const users = await User.find({}, "-password -otpToken").sort({ createdAt: -1 }).lean();

    const weddingCounts = await Wedding.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    weddingCounts.forEach((item) => {
      if (item._id) countMap.set(item._id.toString(), item.count);
    });

    const formattedUsers = users.map((u: any) => ({
      ...u,
      invitesCreated: countMap.get(u._id.toString()) || 0,
    }));

    return NextResponse.json(
      {
        stats: {
          totalUsers: totalUsersCount,
          totalInvites: totalInvitesCount,
          verifiedUsers: verifiedUsersCount,
        },
        users: formattedUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin user fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch admin data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
  }

  await dbConnect();

  try {
    const { name, email, password, role, isVerified } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ message: "A user with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "user",
      isVerified: isVerified === "yes" || isVerified === true,
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "User account created successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified,
          createdAt: newUser.createdAt,
          invitesCreated: 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to create user" }, { status: 500 });
  }
}
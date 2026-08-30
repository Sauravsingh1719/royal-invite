import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const userId = (session.user as any).id;
    const weddings = await Wedding.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(weddings, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch weddings:", error);
    return NextResponse.json({ message: "Error fetching invitations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const data = await req.json();
    const userId = (session.user as any).id;

    const existing = await Wedding.findOne({ slug: data.slug.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ message: "This URL slug is already taken" }, { status: 409 });
    }

    const newWedding = new Wedding({
      ...data,
      userId,
      slug: data.slug.toLowerCase().trim(),
    });

    await newWedding.save();
    return NextResponse.json({ message: "Wedding invitation created", wedding: newWedding }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating wedding:", error);
    return NextResponse.json({ message: error.message || "Failed to create invitation" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ message: "Slug is required" }, { status: 400 });

  await dbConnect();

  try {
    const wedding = await Wedding.findOne({ slug: slug.toLowerCase().trim() });
    if (!wedding) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }
    return NextResponse.json(wedding, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Error fetching wedding details" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  await dbConnect();

  try {
    const userId = (session.user as any).id;
    const deleted = await Wedding.findOneAndDelete({
      slug: slug.toLowerCase().trim(),
      userId,
    });

    if (!deleted) {
      return NextResponse.json({ message: "Invitation not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Invitation deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to delete invitation" }, { status: 500 });
  }
}
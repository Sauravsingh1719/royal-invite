import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";

// Save a newly generated guest link
export async function POST(
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
    const body = await req.json();
    const userId = (session.user as any).id;

    const wedding = await Wedding.findOne({ slug: slug.toLowerCase().trim(), userId });
    if (!wedding) {
      return NextResponse.json({ message: "Wedding not found" }, { status: 404 });
    }

    wedding.guestInvites.unshift({
      name: body.name,
      familySuffix: body.familySuffix,
      customNote: body.customNote,
      famSignOff: body.famSignOff,
      url: body.url,
      createdAt: new Date(),
    });

    await wedding.save();

    return NextResponse.json({
      success: true,
      guestInvites: wedding.guestInvites,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to save guest link" }, { status: 500 });
  }
}

// Delete a guest link record
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const guestId = searchParams.get("guestId");

  if (!guestId) {
    return NextResponse.json({ message: "Guest ID is required" }, { status: 400 });
  }

  await dbConnect();

  try {
    const userId = (session.user as any).id;
    const wedding = await Wedding.findOneAndUpdate(
      { slug: slug.toLowerCase().trim(), userId },
      { $pull: { guestInvites: { _id: guestId } } },
      { new: true }
    );

    if (!wedding) {
      return NextResponse.json({ message: "Wedding not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      guestInvites: wedding.guestInvites,
    });
  } catch {
    return NextResponse.json({ message: "Failed to delete guest link" }, { status: 500 });
  }
}
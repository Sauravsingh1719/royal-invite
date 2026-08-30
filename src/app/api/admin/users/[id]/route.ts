import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Wedding from "@/models/Wedding";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    if ((session.user as any).id === id) {
      return NextResponse.json({ message: "You cannot delete your own admin account" }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Cascade delete any wedding invitations associated with this user
    await Wedding.deleteMany({ userId: id });

    return NextResponse.json({ success: true, message: "User and associated invitations deleted" });
  } catch {
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
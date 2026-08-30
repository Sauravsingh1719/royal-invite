import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ message: "Please provide a valid invitation slug" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/^\/+/, "");
    const wedding = await Wedding.findOne({ slug: cleanSlug });

    if (!wedding) {
      return NextResponse.json({ message: "No invitation found with this slug" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    wedding.userId = userId;
    await wedding.save();

    return NextResponse.json({
      success: true,
      message: "Invitation successfully linked to your account!",
      wedding,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to link invitation" }, { status: 500 });
  }
}
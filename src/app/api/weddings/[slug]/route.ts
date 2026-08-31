import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import { deleteCloudinaryImage } from "@/actions/upload";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug)
    return NextResponse.json({ message: "Slug is required" }, { status: 400 });

  await dbConnect();

  try {
    const wedding = await Wedding.findOne({ slug: slug.toLowerCase().trim() });
    if (!wedding) {
      return NextResponse.json(
        { message: "Invitation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(wedding, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Error fetching wedding details" },
      { status: 500 }
    );
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
    const normalizedSlug = slug.toLowerCase().trim();

    // 1. Find the wedding first
    const wedding = await Wedding.findOne({
      slug: normalizedSlug,
      userId,
    });

    if (!wedding) {
      return NextResponse.json(
        { message: "Invitation not found or unauthorized" },
        { status: 404 }
      );
    }

    // 2. Collect all attached image URLs
    const imagesToDelete = [
      wedding.bride?.image,
      wedding.groom?.image,
      wedding.couple?.image,
    ].filter((url): url is string => Boolean(url && typeof url === "string"));

    // 3. Delete all images from Cloudinary concurrently
    await Promise.allSettled(
      imagesToDelete.map((imgUrl) => deleteCloudinaryImage(imgUrl))
    );

    // 4. Delete the document from MongoDB
    await Wedding.deleteOne({ _id: wedding._id });

    return NextResponse.json({
      success: true,
      message: "Invitation and associated photos deleted successfully",
    });
  } catch (error: any) {
    console.error("[Delete Wedding Error]:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete invitation" },
      { status: 500 }
    );
  }
}
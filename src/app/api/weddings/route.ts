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
    return NextResponse.json(
      { message: "Error fetching invitations" },
      { status: 500 }
    );
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
    let finalSlug = (data.slug || "royal-wedding").toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    // Auto-resolve slug collision by appending a unique 3-digit suffix
    let existing = await Wedding.findOne({ slug: finalSlug });
    while (existing) {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      finalSlug = `${data.slug.toLowerCase().trim()}-${randomSuffix}`;
      existing = await Wedding.findOne({ slug: finalSlug });
    }

    // Sanitize and structure ritual functions array
    const sanitizedFunctions = Array.isArray(data.functions)
      ? data.functions.map((fn: any) => ({
          title: fn.title?.trim() || "Ceremony",
          dateText: fn.dateText?.trim() || "",
          timeText: fn.timeText?.trim() || "",
          venueTitle: fn.venueTitle?.trim() || "",
          venueAddress: fn.venueAddress?.trim() || "",
          googleMapsUrl: fn.googleMapsUrl?.trim() || "",
        }))
      : [];

    const newWedding = new Wedding({
      ...data,
      userId,
      slug: finalSlug,
      displayOrder: data.displayOrder === "groom_first" ? "groom_first" : "bride_first",
      functions: sanitizedFunctions,
    });

    await newWedding.save();
    return NextResponse.json(
      { message: "Wedding invitation created", wedding: newWedding },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating wedding:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create invitation" },
      { status: 500 }
    );
  }
}
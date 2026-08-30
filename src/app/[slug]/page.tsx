import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Wedding from "@/models/Wedding";
import AudioPlayer from "@/components/AudioPlayer";
import { getTemplate } from "@/templates/registry";
import { Metadata } from "next";
import { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return { title: "Invitation Not Found | RoyalInvites" };
  }

  await dbConnect();
  const wedding = await Wedding.findOne({ slug: slug.toLowerCase().trim() }).lean();

  if (!wedding) {
    return { title: "Invitation Not Found | RoyalInvites" };
  }

  return {
    title: `Wedding Invitation: ${wedding.bride.name} & ${wedding.groom.name}`,
    description: `Join us in celebrating the union of ${wedding.bride.name} and ${wedding.groom.name} on ${wedding.event.dateText}.`,
    openGraph: {
      title: `${wedding.bride.name} & ${wedding.groom.name}'s Wedding Invitation`,
      description: `Wedding celebration on ${wedding.event.dateText} at ${wedding.event.venueTitle}.`,
      images: [wedding.couple?.image || wedding.bride?.image || ""],
    },
  };
}

export default async function WeddingInvitePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  await dbConnect();
  const wedding = await Wedding.findOne({ slug: slug.toLowerCase().trim() }).lean();

  if (!wedding) {
    notFound();
  }

  // Serialize Mongoose document to plain JSON object
  const serializedWedding = JSON.parse(JSON.stringify(wedding));

  // Dynamically resolve the template from the central registry
  const selectedTemplate = getTemplate(serializedWedding.templateId);
  const TemplateComponent = selectedTemplate.component;

  return (
    <div className="relative min-h-screen bg-[#FDFBF7]">
      <Suspense fallback={null}>
        <AudioPlayer
          musicUrl={serializedWedding.musicUrl}
          brideName={serializedWedding.bride.name}
          groomName={serializedWedding.groom.name}
        />
      </Suspense>

      {/* Dynamic Component Mount */}
      <TemplateComponent wedding={serializedWedding} />
    </div>
  );
}
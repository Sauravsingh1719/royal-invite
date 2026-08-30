"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, Eye, CheckCircle2, Heart, Award } from "lucide-react";
import Link from "next/link";
import { getAllTemplates } from "@/templates/registry";

function TemplatesContent() {
  const searchParams = useSearchParams();
  const previewParam = searchParams.get("preview");
  const templates = getAllTemplates();

  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    previewParam || templates[0]?.id || "design-one"
  );

  // Sync active template if URL query param changes
  useEffect(() => {
    if (previewParam && templates.some((t) => t.id === previewParam)) {
      setActiveTemplateId(previewParam);
    }
  }, [previewParam, templates]);

  const activeTemplate =
    templates.find((t) => t.id === activeTemplateId) || templates[0];
  const ActiveComponent = activeTemplate?.component;

  // Mock wedding data for live template demonstration
  const sampleWeddingData = {
    slug: "sample-preview",
    templateId: activeTemplate?.id,
    musicUrl: "/audio/audio1.mp3",
    bride: {
      name: "Kalyani",
      parents: "D/o Smt. Sangeeta & Shri Manoj Singh",
      image: "/bride.jpg",
      traits: [
        "💖 Ghar Ki Ladli Beti",
        "🤪 Fun Loving & Clumsy",
        "🗣️ Talkative & Cheerful",
      ],
    },
    groom: {
      name: "Sachin",
      parents: "S/o Smt. Rekha & Shri Arvind Rai",
      image: "/groom.jpg",
      traits: [
        "👔 Ghar Ka Ladla Beta",
        "🧘‍♂️ Responsible & Calm",
        "📅 Always Well-Planned",
      ],
    },
    couple: {
      image: "/couple.jpg",
      quote: "Different hearts. Different worlds. One beautiful destiny.",
    },
    event: {
      dateText: "Thursday, 11th December 2026",
      timeText: "11:00 AM Onwards",
      isoDate: new Date("2026-12-11T11:00:00.000Z"),
      venueTitle: "The Bliss Motel & Resort",
      venueAddress: "New Delhi, 110036",
      googleMapsUrl: "https://maps.google.com",
    },
    defaultFamilySignOff: "Singh",
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B1E41]/10 border border-[#8B1E41]/20 rounded-full text-[#8B1E41] text-xs font-bold font-[family-name:var(--font-cinzel)] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Royal Design Showcase
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-cinzel)] text-[#8B1E41]">
            Experience Templates
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            Browse our royal handcrafted invitation themes. Select a theme to preview it live below with sample celebration data.
          </p>
        </div>

        {/* Template Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((tpl) => {
            const isSelected = activeTemplateId === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => setActiveTemplateId(tpl.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "border-[#8B1E41] bg-[#8B1E41]/5 shadow-md ring-2 ring-[#8B1E41]/30"
                    : "border-gray-200 hover:border-[#D4AF37] bg-white shadow-xs"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#8B1E41] border border-[#D4AF37]/30">
                      {tpl.category}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#8B1E41]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1E41]" /> Active Preview
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-[#8B1E41] font-[family-name:var(--font-cinzel)]">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 font-mono">By {tpl.author.name}</span>
                  <span className="text-[#8B1E41] font-bold flex items-center gap-1 hover:underline">
                    <Eye className="w-3 h-3" /> Select
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-2xl border border-[#D4AF37]/40 shadow-sm gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-gray-900 font-[family-name:var(--font-cinzel)]">
              Love the <span className="text-[#8B1E41]">{activeTemplate?.name}</span> theme?
            </h4>
            <p className="text-xs text-gray-500">
              Launch your wedding invitation using this template in minutes.
            </p>
          </div>
          <Link
            href="/builder"
            className="px-6 py-3 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white text-xs font-bold rounded-xl shadow-md hover:brightness-110 transition-all font-[family-name:var(--font-cinzel)] uppercase tracking-wider flex items-center gap-2 flex-shrink-0"
          >
            Create With This Template <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Template Frame */}
        <div className="bg-white rounded-3xl border border-[#D4AF37]/40 shadow-xl overflow-hidden">
          <div className="bg-[#8B1E41] text-[#FDFBF7] px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                Live Interactive Preview: {activeTemplate?.name}
              </span>
            </div>
            <span className="text-[10px] text-[#D4AF37] font-mono font-bold tracking-widest uppercase">
              Interactive Demo
            </span>
          </div>

          <div className="p-2 md:p-6 bg-[#FDFBF7]">
            {ActiveComponent && (
              <ActiveComponent
                wedding={sampleWeddingData as any}
                guestName="Honored Guest & Family"
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
          <div className="w-8 h-8 border-4 border-[#8B1E41] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { getAllTemplates, getTemplate } from "@/templates/registry";
import { sampleDesignOneWedding } from "@/lib/sample-wedding";

export const dynamic = "force-dynamic";

export default function TemplatesShowcasePage() {
  const templates = getAllTemplates();
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    templates[0]?.id || "design-one"
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeDefinition = getTemplate(activeTemplateId);
  const ActiveComponent = activeDefinition.component;

  return (
    <div className="relative min-h-screen bg-[#FDFBF7]">
      {/* Sticky Switcher Header */}
      <div className="sticky top-16 z-40 px-4 py-3 bg-[#2A0410]/95 backdrop-blur-md border-b border-[#D4AF37]/50 shadow-xl text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wider text-[#D4AF37]">
                Template: {activeDefinition.name} (by {activeDefinition.author.name})
              </p>
              <p className="text-[11px] text-gray-300 font-medium">
                Bracketed text <span className="text-[#D4AF37] font-bold font-mono">[like this]</span> shows customizable fields.
              </p>
            </div>
          </div>

          {/* Dynamic Tabs from Registry */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex bg-black/40 p-1 rounded-full border border-[#D4AF37]/40">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplateId(t.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-[family-name:var(--font-cinzel)] uppercase font-bold tracking-wider transition-all ${
                    activeTemplateId === t.id
                      ? "bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white shadow-md border border-[#D4AF37]/50"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <Link
              href="/builder"
              className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2A0410] font-bold rounded-full text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Use Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Audio Envelope with Suspense Boundary */}
      <Suspense fallback={null}>
        <AudioPlayer
          brideName={sampleDesignOneWedding.bride.name}
          groomName={sampleDesignOneWedding.groom.name}
        />
      </Suspense>

      {/* Dynamic Template Mount */}
      {!mounted ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#8B1E41] animate-spin" />
        </div>
      ) : (
        <ActiveComponent wedding={sampleDesignOneWedding as any} />
      )}
    </div>
  );
}
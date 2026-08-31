"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Smile,
  Eye,
  ExternalLink,
  Check,
  Plus,
  Trash2,
  Copy,
  Calendar,
  Clock,
  MapPin,
  HeartHandshake,
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import AudioSelector from "@/components/AudioSelector";
import { getAllTemplates } from "@/templates/registry";
import { AUDIO_PRESETS } from "@/lib/audio-presets";
import Link from "next/link";

interface FunctionItem {
  title: string;
  dateText: string;
  timeText: string;
  venueTitle: string;
  venueAddress: string;
  googleMapsUrl: string;
}

const RITUAL_PRESETS = [
  "Haldi Ceremony",
  "Mehendi & Sangeet",
  "Ring Ceremony",
  "Reception Celebration",
  "Cocktail Evening",
  "Baraat & Phere",
];

export default function BuilderPage() {
  const router = useRouter();
  const availableTemplates = getAllTemplates();

  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    templateId: availableTemplates[0]?.id || "design-one",
    displayOrder: "bride_first" as "bride_first" | "groom_first",
    musicUrl: AUDIO_PRESETS[0]?.url || "/audio/audio1.mp3",
    bride: {
      name: "",
      parents: "D/o Smt. Sangeeta & Shri Manoj Singh",
      image: "",
      traits: [
        "💖 Ghar Ki Ladli Beti",
        "🤪 Fun Loving & Clumsy",
        "🗣️ Talkative & Cheerful",
      ],
    },
    groom: {
      name: "",
      parents: "S/o Smt. Rekha & Shri Arvind Rai",
      image: "",
      traits: [
        "👔 Ghar Ka Ladla Beta",
        "🧘‍♂️ Responsible & Calm",
        "📅 Always Well-Planned",
      ],
    },
    couple: {
      image: "",
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
    functions: [] as FunctionItem[],
    defaultFamilySignOff: "Singh",
  });

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/signin?callbackUrl=/builder";
    }
  }, [status]);

  // Recalculate slug based on active display order
  const generateSlug = (
    brideName: string,
    groomName: string,
    order: "bride_first" | "groom_first"
  ) => {
    const b = brideName.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
    const g = groomName.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (!b && !g) return "";
    if (order === "groom_first") {
      return [g, b].filter(Boolean).join("-and-");
    }
    return [b, g].filter(Boolean).join("-and-");
  };

  const updateBrideName = (name: string) => {
    const updatedBride = { ...formData.bride, name };
    let newSlug = formData.slug;
    if (!isSlugCustomized) {
      newSlug = generateSlug(name, formData.groom.name, formData.displayOrder);
    }
    setFormData({ ...formData, bride: updatedBride, slug: newSlug });
  };

  const updateGroomName = (name: string) => {
    const updatedGroom = { ...formData.groom, name };
    let newSlug = formData.slug;
    if (!isSlugCustomized) {
      newSlug = generateSlug(formData.bride.name, name, formData.displayOrder);
    }
    setFormData({ ...formData, groom: updatedGroom, slug: newSlug });
  };

  const handleDisplayOrderChange = (newOrder: "bride_first" | "groom_first") => {
    let newSlug = formData.slug;
    if (!isSlugCustomized) {
      newSlug = generateSlug(formData.bride.name, formData.groom.name, newOrder);
    }
    setFormData({ ...formData, displayOrder: newOrder, slug: newSlug });
  };

  const handleBrideTraitChange = (index: number, value: string) => {
    const updatedTraits = [...formData.bride.traits];
    updatedTraits[index] = value;
    setFormData({ ...formData, bride: { ...formData.bride, traits: updatedTraits } });
  };

  const handleGroomTraitChange = (index: number, value: string) => {
    const updatedTraits = [...formData.groom.traits];
    updatedTraits[index] = value;
    setFormData({ ...formData, groom: { ...formData.groom, traits: updatedTraits } });
  };

  // Additional Rituals / Functions Management
  const handleAddFunction = (presetTitle?: string) => {
    setFormData({
      ...formData,
      functions: [
        ...formData.functions,
        {
          title: presetTitle || "Haldi Ceremony",
          dateText: formData.event.dateText || "Wednesday, 10th December 2026",
          timeText: "04:00 PM Onwards",
          venueTitle: formData.event.venueTitle || "",
          venueAddress: formData.event.venueAddress || "",
          googleMapsUrl: formData.event.googleMapsUrl || "",
        },
      ],
    });
  };

  const handleUpdateFunction = (
    index: number,
    field: keyof FunctionItem,
    val: string
  ) => {
    const updated = [...formData.functions];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, functions: updated });
  };

  const handleCopyMainVenue = (index: number) => {
    const updated = [...formData.functions];
    updated[index] = {
      ...updated[index],
      venueTitle: formData.event.venueTitle,
      venueAddress: formData.event.venueAddress,
      googleMapsUrl: formData.event.googleMapsUrl,
    };
    setFormData({ ...formData, functions: updated });
  };

  const handleRemoveFunction = (index: number) => {
    const updated = formData.functions.filter((_, i) => i !== index);
    setFormData({ ...formData, functions: updated });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-8 h-8 border-4 border-[#8B1E41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.bride.image || !formData.groom.image || !formData.couple.image) {
      setError("Please upload photos for Bride, Groom, and Couple before proceeding.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create invitation");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Profile Form Blocks for Bride and Groom
  const renderBrideProfile = () => (
    <div className="space-y-4 bg-[#FDFBF7]/60 p-5 rounded-2xl border border-[#D4AF37]/30">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase flex items-center gap-1.5">
          <span>👰</span> Bride Profile
        </h3>
        {formData.displayOrder === "bride_first" && (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#8B1E41] text-[#D4AF37] rounded-full">
            Featured First
          </span>
        )}
      </div>

      <ImageUploader
        label="Bride Photo"
        value={formData.bride.image}
        onChange={(url) =>
          setFormData({ ...formData, bride: { ...formData.bride, image: url } })
        }
        aspectRatio="portrait"
      />
      <input
        type="text"
        required
        placeholder="Bride First Name (e.g. Kalyani)"
        value={formData.bride.name}
        onChange={(e) => updateBrideName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
      />
      <input
        type="text"
        required
        placeholder="Bride Parents Description"
        value={formData.bride.parents}
        onChange={(e) =>
          setFormData({
            ...formData,
            bride: { ...formData.bride, parents: e.target.value },
          })
        }
        className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
      />

      <div className="pt-2 space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-900 font-[family-name:var(--font-cinzel)]">
          <Smile className="w-3.5 h-3.5 text-[#8B1E41]" /> Bride Fun Personality Points (3)
        </label>
        <div className="space-y-2">
          <input
            type="text"
            required
            placeholder="Point 1 (e.g. 💖 Ghar Ki Ladli Beti)"
            value={formData.bride.traits[0]}
            onChange={(e) => handleBrideTraitChange(0, e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
          />
          <input
            type="text"
            required
            placeholder="Point 2 (e.g. 🤪 Fun Loving & Clumsy)"
            value={formData.bride.traits[1]}
            onChange={(e) => handleBrideTraitChange(1, e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
          />
          <input
            type="text"
            required
            placeholder="Point 3 (e.g. 🗣️ Talkative & Cheerful)"
            value={formData.bride.traits[2]}
            onChange={(e) => handleBrideTraitChange(2, e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );

  const renderGroomProfile = () => (
    <div className="space-y-4 bg-[#FDFBF7]/60 p-5 rounded-2xl border border-[#D4AF37]/30">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase flex items-center gap-1.5">
          <span>🤵</span> Groom Profile
        </h3>
        {formData.displayOrder === "groom_first" && (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#8B1E41] text-[#D4AF37] rounded-full">
            Featured First
          </span>
        )}
      </div>

      <ImageUploader
        label="Groom Photo"
        value={formData.groom.image}
        onChange={(url) =>
          setFormData({ ...formData, groom: { ...formData.groom, image: url } })
        }
        aspectRatio="portrait"
      />
      <input
        type="text"
        required
        placeholder="Groom First Name (e.g. Sachin)"
        value={formData.groom.name}
        onChange={(e) => updateGroomName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
      />
      <input
        type="text"
        required
        placeholder="Groom Parents Description"
        value={formData.groom.parents}
        onChange={(e) =>
          setFormData({
            ...formData,
            groom: { ...formData.groom, parents: e.target.value },
          })
        }
        className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
      />

      <div className="pt-2 space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-900 font-[family-name:var(--font-cinzel)]">
          <Smile className="w-3.5 h-3.5 text-[#8B1E41]" /> Groom Fun Personality Points (3)
        </label>
        <div className="space-y-2">
          <input
            type="text"
            required
            placeholder="Point 1 (e.g. 👔 Ghar Ka Ladla Beta)"
            value={formData.groom.traits[0]}
            onChange={(e) => handleGroomTraitChange(0, e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
          />
          <input
            type="text"
            required
            placeholder="Point 2 (e.g. 🧘‍♂️ Responsible & Calm)"
            value={formData.groom.traits[1]}
            onChange={(e) => handleGroomTraitChange(1, e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
          />
          <input
            type="text"
            required
            placeholder="Point 3 (e.g. 📅 Always Well-Planned)"
            value={formData.groom.traits[2]}
            onChange={(e) => handleGroomTraitChange(2, e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-[#D4AF37]/40 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
          <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#8B1E41]">
            Create Royal Wedding Invitation
          </h1>
          <p className="text-gray-600 text-sm mt-2 font-medium">
            Customize host priority, schedule multiple rituals, pick soundtracks, and launch your wedding website.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm rounded-xl border border-red-200 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* 1. Host Invitation Side & Profile Display Order */}
          <div className="p-5 bg-[#8B1E41]/5 rounded-2xl border border-[#8B1E41]/20 space-y-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#8B1E41]" />
              <label className="block text-xs font-bold uppercase text-gray-900 font-[family-name:var(--font-cinzel)]">
                Invitation Host & Profile Priority
              </label>
            </div>
            <p className="text-xs text-gray-600">
              Select whose side this invitation represents. The selected profile will appear first on the invitation cards and in the generated website link.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleDisplayOrderChange("bride_first")}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  formData.displayOrder === "bride_first"
                    ? "border-[#8B1E41] bg-white ring-2 ring-[#8B1E41] shadow-sm font-bold text-[#8B1E41]"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#D4AF37]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">👰</span>
                  <div>
                    <p className="text-xs font-bold">Bride Side First</p>
                    <p className="text-[10px] text-gray-500 font-normal">
                      Shows Bride details first
                    </p>
                  </div>
                </div>
                {formData.displayOrder === "bride_first" && (
                  <Check className="w-4 h-4 text-[#8B1E41]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDisplayOrderChange("groom_first")}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  formData.displayOrder === "groom_first"
                    ? "border-[#8B1E41] bg-white ring-2 ring-[#8B1E41] shadow-sm font-bold text-[#8B1E41]"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#D4AF37]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤵</span>
                  <div>
                    <p className="text-xs font-bold">Groom Side First</p>
                    <p className="text-[10px] text-gray-500 font-normal">
                      Shows Groom details first
                    </p>
                  </div>
                </div>
                {formData.displayOrder === "groom_first" && (
                  <Check className="w-4 h-4 text-[#8B1E41]" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Template Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase text-gray-900 font-[family-name:var(--font-cinzel)]">
                Choose Experience Template ({availableTemplates.length} Available)
              </label>
              <span className="text-[11px] text-gray-500 font-medium">
                Click card to select, or preview in new tab
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTemplates.map((template) => {
                const isSelected = formData.templateId === template.id;

                return (
                  <div
                    key={template.id}
                    onClick={() => setFormData({ ...formData, templateId: template.id })}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer relative group ${
                      isSelected
                        ? "border-[#8B1E41] bg-[#8B1E41]/5 shadow-sm ring-2 ring-[#8B1E41]/20"
                        : "border-gray-300 hover:border-[#D4AF37] bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-[#8B1E41] font-[family-name:var(--font-cinzel)]">
                            {template.name}
                          </p>
                          {isSelected && (
                            <span className="p-0.5 bg-[#8B1E41] text-[#D4AF37] rounded-full">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#8B1E41] border border-[#D4AF37]/30 flex-shrink-0">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1.5 font-medium leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 font-mono">
                        By {template.author.name}
                      </p>

                      <a
                        href={`/templates?preview=${template.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B1E41] hover:text-[#5C1027] bg-[#8B1E41]/10 hover:bg-[#8B1E41]/20 px-2.5 py-1 rounded-lg transition-all border border-[#8B1E41]/20"
                        title={`Preview ${template.name} in a new tab`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Bride & Groom Profiles in Chosen Display Order */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-sm font-bold uppercase text-gray-900 mb-4 font-[family-name:var(--font-cinzel)]">
              Couple Profiles ({formData.displayOrder === "groom_first" ? "Groom & Bride" : "Bride & Groom"})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.displayOrder === "groom_first" ? (
                <>
                  {renderGroomProfile()}
                  {renderBrideProfile()}
                </>
              ) : (
                <>
                  {renderBrideProfile()}
                  {renderGroomProfile()}
                </>
              )}
            </div>
          </div>

          {/* 4. Couple Portrait & Tagline */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase">
              Together Portrait & Love Tagline
            </h3>
            <ImageUploader
              label="Together Portrait Photo"
              value={formData.couple.image}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  couple: { ...formData.couple, image: url },
                })
              }
              aspectRatio="portrait"
            />
            <input
              type="text"
              placeholder="Love Quote / Tagline"
              value={formData.couple.quote}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  couple: { ...formData.couple, quote: e.target.value },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
            />
          </div>

          {/* 5. Main Wedding Celebration Details */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase">
              Main Wedding Day (Mandap / Main Ceremony)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Date Text (e.g. Thursday, 11th December 2026)"
                value={formData.event.dateText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event: { ...formData.event, dateText: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
              />
              <input
                type="text"
                required
                placeholder="Time Text (e.g. 11:00 AM Onwards)"
                value={formData.event.timeText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event: { ...formData.event, timeText: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Venue Title (e.g. The Bliss Motel & Resort)"
                value={formData.event.venueTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event: { ...formData.event, venueTitle: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
              />
              <input
                type="text"
                required
                placeholder="Venue Address (e.g. New Delhi, 110036)"
                value={formData.event.venueAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event: { ...formData.event, venueAddress: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
              />
            </div>
            <input
              type="text"
              required
              placeholder="Google Maps URL"
              value={formData.event.googleMapsUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  event: { ...formData.event, googleMapsUrl: e.target.value },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
            />
          </div>

          {/* 6. Multi-Function / Rituals Manager */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase">
                  Other Wedding Rituals & Functions
                </h3>
                <p className="text-xs text-gray-500">
                  Add details for Haldi, Mehendi, Sangeet, Cocktail, or Reception.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAddFunction()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#8B1E41] text-white rounded-xl text-xs font-bold hover:brightness-110 shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Add Custom Function
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] font-bold text-gray-500 py-1 select-none">
                Quick Add:
              </span>
              {RITUAL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddFunction(preset)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-[#8B1E41] hover:text-white text-[#8B1E41] border border-[#D4AF37]/40 rounded-lg text-xs font-semibold transition-all shadow-2xs"
                >
                  + {preset}
                </button>
              ))}
            </div>

            {/* List of Added Rituals */}
            {formData.functions.length === 0 ? (
              <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                No additional rituals added yet. Use the buttons above to add Haldi, Mehendi, Sangeet, or Reception.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {formData.functions.map((fn, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#8B1E41] text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          value={fn.title}
                          onChange={(e) =>
                            handleUpdateFunction(idx, "title", e.target.value)
                          }
                          placeholder="Event Title (e.g. Haldi Ceremony)"
                          className="font-bold text-sm text-[#8B1E41] font-[family-name:var(--font-cinzel)] border-b border-transparent hover:border-gray-300 focus:border-[#8B1E41] outline-none px-1 py-0.5 bg-transparent"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyMainVenue(idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-[#8B1E41] bg-gray-100 hover:bg-amber-50 px-2 py-1 rounded-lg transition-all border border-gray-200"
                          title="Copy address and maps URL from main wedding venue"
                        >
                          <Copy className="w-3 h-3" /> Same as Wedding Venue
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveFunction(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete ceremony"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Date Text (e.g. Wednesday, 10th Dec 2026)"
                          value={fn.dateText}
                          onChange={(e) =>
                            handleUpdateFunction(idx, "dateText", e.target.value)
                          }
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold"
                        />
                      </div>

                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Time Text (e.g. 04:00 PM Onwards)"
                          value={fn.timeText}
                          onChange={(e) =>
                            handleUpdateFunction(idx, "timeText", e.target.value)
                          }
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Venue Title"
                          value={fn.venueTitle}
                          onChange={(e) =>
                            handleUpdateFunction(idx, "venueTitle", e.target.value)
                          }
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold"
                        />
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Venue Address"
                        value={fn.venueAddress}
                        onChange={(e) =>
                          handleUpdateFunction(idx, "venueAddress", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Google Maps URL (Optional)"
                      value={fn.googleMapsUrl}
                      onChange={(e) =>
                        handleUpdateFunction(idx, "googleMapsUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. Sound Preset Selector */}
          <div className="pt-6 border-t border-gray-200">
            <AudioSelector
              value={formData.musicUrl}
              onChange={(url) => setFormData({ ...formData, musicUrl: url })}
            />
          </div>

          {/* 8. Public Website URL Link Preview */}
          <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#D4AF37]/40 space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8B1E41]" />
              <label className="block text-xs font-bold uppercase text-gray-900 font-[family-name:var(--font-cinzel)]">
                Your Public Website Link
              </label>
            </div>
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono">
              <span className="text-gray-500 font-bold select-none">royalinvites.com/</span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  setIsSlugCustomized(true);
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  });
                }}
                placeholder="bride-and-groom"
                className="w-full bg-transparent outline-none font-bold text-black pl-1"
              />
            </div>
            <p className="text-[11px] text-gray-600 font-medium">
              Auto-generated based on selected priority:{" "}
              <span className="font-bold text-[#8B1E41]">
                {formData.displayOrder === "groom_first"
                  ? "groom-and-bride"
                  : "bride-and-groom"}
              </span>
              . You can customize it at any time.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] font-bold rounded-2xl shadow-lg hover:brightness-110 transition-all uppercase tracking-widest text-xs font-[family-name:var(--font-cinzel)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Publishing Invitation..." : "Launch Royal Invitation"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <div>
          <p className="text-[11px] text-gray-500 text-center leading-relaxed mt-3 font-medium">
  By publishing, you confirm you have permission to use these photographs and agree to our{" "}
  <Link href="/privacy" className="text-[#8B1E41] underline hover:text-[#5C1027]">
    Privacy Policy
  </Link>.
</p>
        </div>
      </div>
    </div>
  );
}
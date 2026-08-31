    "use client";

    import React, { useState, useEffect } from "react";
    import { useSession } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import { Sparkles, ArrowRight, Globe, Smile, Eye, ExternalLink, Check } from "lucide-react";
    import ImageUploader from "@/components/ImageUploader";
    import AudioSelector from "@/components/AudioSelector";
    import { getAllTemplates } from "@/templates/registry";
    import { AUDIO_PRESETS } from "@/lib/audio-presets";

    export default function BuilderPage() {
      const router = useRouter();
      const availableTemplates = getAllTemplates();

      // Smooth session resolution without premature client-side unauthenticated triggers
      const { data: session, status } = useSession();

      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const [isSlugCustomized, setIsSlugCustomized] = useState(false);

      const [formData, setFormData] = useState({
        slug: "",
        templateId: availableTemplates[0]?.id || "design-one",
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
        defaultFamilySignOff: "Singh",
      });

      // Only redirect if NextAuth has definitively finished checking and confirmed unauthenticated
      useEffect(() => {
        if (status === "unauthenticated") {
          window.location.href = "/signin?callbackUrl=/builder";
        }
      }, [status]);

      const updateBrideName = (name: string) => {
        const updatedBride = { ...formData.bride, name };
        let newSlug = formData.slug;
        if (!isSlugCustomized && (name || formData.groom.name)) {
          const b = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
          const g = formData.groom.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
          newSlug = [b, g].filter(Boolean).join("-and-");
        }
        setFormData({ ...formData, bride: updatedBride, slug: newSlug });
      };

      const updateGroomName = (name: string) => {
        const updatedGroom = { ...formData.groom, name };
        let newSlug = formData.slug;
        if (!isSlugCustomized && (formData.bride.name || name)) {
          const b = formData.bride.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
          const g = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
          newSlug = [b, g].filter(Boolean).join("-and-");
        }
        setFormData({ ...formData, groom: updatedGroom, slug: newSlug });
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

      return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-[#D4AF37]/40 shadow-xl">
            <div className="text-center mb-10">
              <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#8B1E41]">
                Create Royal Wedding Invitation
              </h1>
              <p className="text-gray-600 text-sm mt-2 font-medium">
                Enter the couple details, traits, soundtrack, upload photos, and generate your dynamic wedding website.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm rounded-xl border border-red-200 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dynamic Template Selection Grid with Live Preview Action */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase text-gray-900 font-[family-name:var(--font-cinzel)]">
                    Choose Experience Template ({availableTemplates.length} Available)
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Click a card to select, or preview in a new tab
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

              {/* Bride & Groom Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                {/* Bride Column */}
                <div className="space-y-4">
                  <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase">
                    Bride Profile
                  </h3>
                  <ImageUploader
                    label="Bride Photo"
                    value={formData.bride.image}
                    onChange={(url) => setFormData({ ...formData, bride: { ...formData.bride, image: url } })}
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
                      setFormData({ ...formData, bride: { ...formData.bride, parents: e.target.value } })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
                  />

                  {/* Bride Traits Section */}
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

                {/* Groom Column */}
                <div className="space-y-4">
                  <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase">
                    Groom Profile
                  </h3>
                  <ImageUploader
                    label="Groom Photo"
                    value={formData.groom.image}
                    onChange={(url) => setFormData({ ...formData, groom: { ...formData.groom, image: url } })}
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
                      setFormData({ ...formData, groom: { ...formData.groom, parents: e.target.value } })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
                  />

                  {/* Groom Traits Section */}
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
              </div>

              {/* Sound Preset Selector */}
              <div className="pt-6 border-t border-gray-200">
                <AudioSelector
                  value={formData.musicUrl}
                  onChange={(url) => setFormData({ ...formData, musicUrl: url })}
                />
              </div>

              {/* Website Link Preview */}
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
                  Auto-generated from bride & groom names. You can edit it if you want a custom link.
                </p>
              </div>

              {/* Couple Photo */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase">
                  Couple Portrait
                </h3>
                <ImageUploader
                  label="Together Portrait Photo"
                  value={formData.couple.image}
                  onChange={(url) => setFormData({ ...formData, couple: { ...formData.couple, image: url } })}
                  aspectRatio="portrait"
                />
                <input
                  type="text"
                  placeholder="Love Quote / Tagline"
                  value={formData.couple.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, couple: { ...formData.couple, quote: e.target.value } })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
                />
              </div>

              {/* Celebration Details */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-[#8B1E41] text-sm uppercase">
                  Celebration Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Date Text (e.g. 11th December 2026)"
                    value={formData.event.dateText}
                    onChange={(e) =>
                      setFormData({ ...formData, event: { ...formData.event, dateText: e.target.value } })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Time Text (e.g. 11:00 AM Onwards)"
                    value={formData.event.timeText}
                    onChange={(e) =>
                      setFormData({ ...formData, event: { ...formData.event, timeText: e.target.value } })
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
                      setFormData({ ...formData, event: { ...formData.event, venueTitle: e.target.value } })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Venue Address (e.g. New Delhi, 110036)"
                    value={formData.event.venueAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, event: { ...formData.event, venueAddress: e.target.value } })
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
                    setFormData({ ...formData, event: { ...formData.event, googleMapsUrl: e.target.value } })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B1E41] bg-white text-black font-semibold placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] font-bold rounded-2xl shadow-lg hover:brightness-110 transition-all uppercase tracking-widest text-xs font-[family-name:var(--font-cinzel)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Publishing Invitation..." : "Launch Royal Invitation"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      );
    }
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Share2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Send,
  MessageSquareText,
} from "lucide-react";
import { encodeGuestPayload } from "@/lib/guest-utils";
import { getTemplate } from "@/templates/registry";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Guest Generator State
  const [selectedWedding, setSelectedWedding] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [signOffFamily, setSignOffFamily] = useState("");
  const [generating, setGenerating] = useState(false);

  // Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/dashboard");
    } else if (status === "authenticated") {
      fetchWeddings();
    }
  }, [status, router]);

  const fetchWeddings = async () => {
    try {
      const res = await fetch("/api/weddings");
      if (res.ok) {
        const data = await res.json();
        setWeddings(data);
        if (data.length > 0 && !selectedWedding) {
          setSelectedWedding(data[0].slug);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentWedding = weddings.find((w) => w.slug === selectedWedding) || weddings[0];

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWedding || !guestName.trim()) return;

    setGenerating(true);

    const payload = {
      n: guestName.trim(),
      fn: familyName.trim() || undefined,
      m: customNote.trim() || undefined,
      fam: signOffFamily.trim() || undefined,
    };

    const token = encodeGuestPayload(payload);
    const domain = window.location.origin;
    const url = `${domain}/${selectedWedding}?id=${token}`;

    try {
      const res = await fetch(`/api/weddings/${selectedWedding}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName.trim(),
          familySuffix: familyName.trim() || undefined,
          customNote: customNote.trim() || undefined,
          famSignOff: signOffFamily.trim() || undefined,
          url,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWeddings((prev) =>
          prev.map((w) => (w.slug === selectedWedding ? { ...w, guestInvites: data.guestInvites } : w))
        );
        setGuestName("");
        setFamilyName("");
        setCustomNote("");
        setSignOffFamily("");
      }
    } catch (err) {
      console.error("Failed to persist guest link:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!selectedWedding) return;

    try {
      const res = await fetch(`/api/weddings/${selectedWedding}/guests?guestId=${guestId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        setWeddings((prev) =>
          prev.map((w) => (w.slug === selectedWedding ? { ...w, guestInvites: data.guestInvites } : w))
        );
      }
    } catch (err) {
      console.error("Failed to delete guest link:", err);
    }
  };

  const handleDeleteWedding = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete /${slug}? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/weddings/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setWeddings((prev) => prev.filter((w) => w.slug !== slug));
        if (selectedWedding === slug && weddings.length > 1) {
          setSelectedWedding(weddings.find((w) => w.slug !== slug)?.slug || "");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. WhatsApp Share for Master Website Link (No Guest Details)
  const shareMasterLink = (wedding: any) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/${wedding.slug}`;
    const coupleNames = wedding.displayOrder === "groom_first"
      ? `${wedding.groom.name} & ${wedding.bride.name}`
      : `${wedding.bride.name} & ${wedding.groom.name}`;

    const text = encodeURIComponent(
      `*Dear Family & Friends,*\n\n` +
      `We cordially invite you to celebrate the wedding of\n` +
      `*${coupleNames}* 💍✨\n\n` +
      `📅 *Date:* ${wedding.event?.dateText || ""}\n` +
      `⏰ *Time:* ${wedding.event?.timeText || ""}\n` +
      `📍 *Venue:* ${wedding.event?.venueTitle || ""}\n\n` +
      `Please open our royal wedding invitation here:\n` +
      `🔗 ${fullUrl}\n\n` +
      `Warm Regards,\n` +
      `— *The ${wedding.defaultFamilySignOff || "Royal"} Family*`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // 2. WhatsApp Share for Personalized Guest Link
  const shareGuestLink = (wedding: any, guest: any) => {
    const guestDisplayName = `${guest.name} ${guest.familySuffix ? `& ${guest.familySuffix}` : ""}`.trim();
    const coupleNames = wedding.displayOrder === "groom_first"
      ? `${wedding.groom.name} & ${wedding.bride.name}`
      : `${wedding.bride.name} & ${wedding.groom.name}`;
    const signOff = guest.famSignOff || wedding.defaultFamilySignOff || "Royal";

    const text = encodeURIComponent(
      `*Dear ${guestDisplayName},*\n\n` +
      `You are cordially invited to celebrate the wedding of\n` +
      `*${coupleNames}* 💍✨\n\n` +
      `📅 *Date:* ${wedding.event?.dateText || ""}\n` +
      `📍 *Venue:* ${wedding.event?.venueTitle || ""}\n\n` +
      `Please open your personalized royal invitation here:\n` +
      `🔗 ${guest.url}\n\n` +
      `Warm Regards,\n` +
      `— *The ${signOff} Family*`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-8 h-8 border-4 border-[#8B1E41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/30">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-[family-name:var(--font-cinzel)] font-bold">
              Command Center
            </span>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold text-[#8B1E41] mt-1">
              Welcome, {session?.user?.name || "Creator"}
            </h1>
            <p className="text-gray-700 text-sm mt-1 font-medium">
              Manage your published wedding websites and generate personalized invitations for your guests.
            </p>
          </div>

          <Link
            href="/builder"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] rounded-full font-[family-name:var(--font-cinzel)] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create New Wedding
          </Link>
        </div>

        {/* Section 1: Published Cards */}
        <div className="space-y-4">
          <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#8B1E41] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Your Wedding Invitations ({weddings.length})
          </h2>

          {weddings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-[#D4AF37]/50 text-center space-y-4">
              <p className="font-[family-name:var(--font-cormorant)] italic text-2xl text-gray-700">
                You haven&apos;t created any wedding invitations yet.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B1E41] text-white text-xs uppercase font-[family-name:var(--font-cinzel)] tracking-wider font-bold rounded-full"
              >
                <Plus className="w-4 h-4" /> Build Your First Invitation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddings.map((w) => {
                const fullUrl = `${origin}/${w.slug}`;
                const title = w.displayOrder === "groom_first"
                  ? `${w.groom.name} & ${w.bride.name}`
                  : `${w.bride.name} & ${w.groom.name}`;
                const templateMeta = getTemplate(w.templateId);

                return (
                  <div
                    key={w._id}
                    className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
                      selectedWedding === w.slug
                        ? "border-[#8B1E41] ring-2 ring-[#8B1E41]/20 shadow-md"
                        : "border-[#D4AF37]/30 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Card Banner */}
                      <div className="relative h-48 w-full bg-[#2A0410] overflow-hidden">
                        {w.couple?.image || w.bride?.image || w.groom?.image ? (
                          <Image
                            src={w.couple?.image || w.bride?.image || w.groom?.image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover object-top opacity-85"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-[family-name:var(--font-great-vibes)] text-4xl">
                            {title}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[#8B1E41] text-[10px] font-bold rounded-full border border-[#D4AF37]/40 uppercase tracking-wider shadow-sm">
                            {templateMeta.badge || templateMeta.name}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="font-[family-name:var(--font-great-vibes)] text-3xl text-white drop-shadow-md">
                            {title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-black font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-200 truncate font-semibold">
                          <Link2 className="w-3.5 h-3.5 text-[#8B1E41] flex-shrink-0" />
                          <span className="truncate">/{w.slug}</span>
                        </div>

                        <div className="space-y-1.5 text-xs text-gray-800 font-medium">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {w.event?.dateText}
                          </p>
                          <p className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" /> {w.event?.venueTitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-5 pt-0 border-t border-gray-100 mt-2 space-y-2">
                      <div className="grid grid-cols-3 gap-2 pt-3">
                        <button
                          onClick={() => copyToClipboard(fullUrl, w._id)}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-xs font-bold border border-gray-200 transition-colors"
                          title="Copy Master Link"
                        >
                          {copiedId === w._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-700" />
                          )}
                          <span>Copy</span>
                        </button>

                        <button
                          onClick={() => shareMasterLink(w)}
                          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
                          title="Share Invitation on WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Share</span>
                        </button>

                        <Link
                          href={`/${w.slug}`}
                          target="_blank"
                          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#8B1E41]/10 hover:bg-[#8B1E41]/20 text-[#8B1E41] rounded-xl text-xs font-bold border border-[#8B1E41]/20 transition-colors"
                          title="Open Live Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          onClick={() => setSelectedWedding(w.slug)}
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            selectedWedding === w.slug
                              ? "text-[#8B1E41] font-bold"
                              : "text-gray-600 hover:text-[#8B1E41]"
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{selectedWedding === w.slug ? "Active in Guest Hub" : "Manage Guests"}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteWedding(w.slug)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete Invitation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Guest Invites Hub */}
        {weddings.length > 0 && currentWedding && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">

            {/* Left Column: Guest Link Generator Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-[#D4AF37]/40 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#8B1E41]" />
                <div>
                  <h3 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#8B1E41]">
                    Generate Guest Invite
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    For: <span className="font-bold text-black">
                      {currentWedding.displayOrder === "groom_first"
                        ? `${currentWedding.groom.name} & ${currentWedding.bride.name}`
                        : `${currentWedding.bride.name} & ${currentWedding.groom.name}`}
                    </span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleGenerateLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                    Target Wedding
                  </label>
                  <select
                    value={selectedWedding}
                    onChange={(e) => setSelectedWedding(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold"
                  >
                    {weddings.map((w) => (
                      <option key={w._id} value={w.slug}>
                        {w.displayOrder === "groom_first"
                          ? `${w.groom.name} & ${w.bride.name}`
                          : `${w.bride.name} & ${w.groom.name}`}{" "}
                        (/{w.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                      Family Suffix
                    </label>
                    <input
                      type="text"
                      placeholder="Family or +1"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                    Personalized Message
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. We can't wait to celebrate together!"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-900 mb-1 font-[family-name:var(--font-cinzel)]">
                    Family Sign-Off (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Singh"
                    value={signOffFamily}
                    onChange={(e) => setSignOffFamily(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={generating || !guestName.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all font-[family-name:var(--font-cinzel)] uppercase tracking-wider text-xs disabled:opacity-50"
                >
                  {generating ? "Saving Link..." : "Create & Save Guest Link"}
                </button>
              </form>
            </div>

            {/* Right Column: Guest Directory */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[#D4AF37]/40 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-gray-900">
                      Generated Guest Directory
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-[#8B1E41]/10 text-[#8B1E41] rounded-full text-xs font-bold font-mono">
                    {currentWedding.guestInvites?.length || 0} Guests
                  </span>
                </div>

                {(!currentWedding.guestInvites || currentWedding.guestInvites.length === 0) ? (
                  <div className="py-16 text-center space-y-2">
                    <MessageSquareText className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="font-[family-name:var(--font-cormorant)] italic text-xl text-gray-600">
                      No personalized guest links generated for this wedding yet.
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Use the form on the left to generate unique links for individual guests.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto pr-1">
                    {currentWedding.guestInvites.map((guest: any) => {
                      const guestDisplayName = `${guest.name} ${guest.familySuffix ? `& ${guest.familySuffix}` : ""}`.trim();

                      return (
                        <div key={guest._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-black flex items-center gap-2">
                              {guestDisplayName}
                              {guest.famSignOff && (
                                <span className="text-[10px] font-bold text-[#8B1E41] px-2 py-0.5 bg-amber-50 rounded-md border border-[#D4AF37]/30">
                                  The {guest.famSignOff} Family
                                </span>
                              )}
                            </h4>
                            {guest.customNote && (
                              <p className="text-xs text-gray-700 italic font-[family-name:var(--font-cormorant)] font-semibold">
                                &ldquo;{guest.customNote}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                            <button
                              onClick={() => copyToClipboard(guest.url, guest._id)}
                              className="p-2 bg-gray-50 hover:bg-gray-100 text-black rounded-lg text-xs font-bold border border-gray-200 transition-colors flex items-center gap-1"
                              title="Copy Link"
                            >
                              {copiedId === guest._id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-black" />
                              )}
                            </button>

                            <button
                              onClick={() => shareGuestLink(currentWedding, guest)}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                              title="Send on WhatsApp"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteGuest(guest._id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Guest"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
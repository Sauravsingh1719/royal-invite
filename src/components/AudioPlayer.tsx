"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, MailOpen, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { decodeGuestPayload, GuestPayload } from "@/lib/guest-utils";

interface AudioPlayerProps {
  musicUrl?: string;
  brideName: string;
  groomName: string;
}

export default function AudioPlayer({
  musicUrl = "/audio/royal-shehnai.mp3",
  brideName,
  groomName,
}: AudioPlayerProps) {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const [guest, setGuest] = useState<GuestPayload | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (rawId) {
      setGuest(decodeGuestPayload(rawId));
    }

    if (typeof window !== "undefined" && sessionStorage.getItem("envelopeOpened") === "true") {
      setIsOpened(true);
    }
  }, [rawId]);

  const handleOpenEnvelope = () => {
    sessionStorage.setItem("envelopeOpened", "true");
    setIsOpened(true);
    window.dispatchEvent(new Event("envelopeOpened"));

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio autoplay restriction:", err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio playback error:", err));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />

      {/* Floating Audio Controller */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-auto"
          >
            <button
              onClick={toggleMute}
              aria-label="Toggle Music"
              className="w-12 h-12 rounded-full bg-[#8B1E41]/90 text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_10px_25px_rgba(139,30,65,0.4)] flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300"
            >
              {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen-Blocking Wax Seal Envelope */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2A0410] p-4 select-none"
          >
            <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-lg bg-[#FDFBF7] border-2 border-[#D4AF37]/50 rounded-3xl p-8 md:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.6)] text-center overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#8B1E41]/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.3em] uppercase text-xs">
                  Exclusive Royal Invitation
                </p>
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>

              <h1 className="font-[family-name:var(--font-great-vibes)] text-5xl md:text-6xl text-[#8B1E41] mb-2">
                {brideName} & {groomName}
              </h1>

              <div className="w-20 h-[1.5px] bg-[#D4AF37]/60 mx-auto my-6" />

              {guest?.n ? (
                <div className="mb-8">
                  <p className="font-[family-name:var(--font-cinzel)] text-gray-500 tracking-wider text-xs uppercase mb-1">
                    Cordially Invited
                  </p>
                  <h3 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl font-bold text-gray-900">
                    {guest.n} {guest.fn ? `& ${guest.fn}` : ""}
                  </h3>
                  {guest.c && (
                    <span className="inline-block mt-2 px-3 py-1 bg-[#8B1E41]/10 text-[#8B1E41] rounded-full text-xs font-semibold">
                      Reserved Seats: {guest.c}
                    </span>
                  )}
                </div>
              ) : (
                <p className="font-[family-name:var(--font-cormorant)] italic text-lg text-gray-600 mb-8">
                  Request the honor of your gracious presence
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenEnvelope}
                className="w-full flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] rounded-full font-[family-name:var(--font-cinzel)] tracking-widest text-sm uppercase shadow-[0_15px_30px_rgba(139,30,65,0.35)] border border-[#D4AF37]/40 hover:brightness-110 transition-all"
              >
                <MailOpen className="w-5 h-5 text-[#D4AF37]" />
                <span>Open Royal Invitation</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
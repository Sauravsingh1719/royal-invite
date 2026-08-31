"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (rawId) {
      setGuest(decodeGuestPayload(rawId));
    }

    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("envelopeOpened") === "true"
    ) {
      setIsOpened(true);
    }
  }, [rawId]);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpened) return;

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio autoplay restriction:", err));
    }

    setIsOpening(true);

    setTimeout(() => {
      sessionStorage.setItem("envelopeOpened", "true");
      setIsOpened(true);
      window.dispatchEvent(new Event("envelopeOpened"));
    }, 1800);
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
              {isPlaying ? (
                <Volume2 className="w-5 h-5 animate-pulse" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen-Blocking Realistic Wax-Sealed Envelope Overlay */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A020A]/95 backdrop-blur-md p-4 select-none overflow-hidden"
          >
            {/* Background luxury texture & ambient glows */}
            <div className="absolute inset-0 opacity-20 mix-blend-color-dodge bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#8B1E41]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Subtitle / Header hint */}
            <motion.div
              animate={isOpening ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 mb-6 z-10"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.35em] uppercase text-xs sm:text-sm font-semibold text-center drop-shadow-md">
                Royal Wedding Invitation
              </p>
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            </motion.div>

            {/* 3D Envelope Container */}
            <div className="relative w-full max-w-[460px] h-[310px] sm:h-[330px] [perspective:1400px] flex items-center justify-center">
              
              {/* 1. Envelope Back Plate */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#4A0A1D] to-[#2E0410] rounded-2xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
              </div>

              {/* 2. Invitation Letter (Tucked inside, rises up on open) */}
              <motion.div
                initial={{ y: 0, scale: 0.94 }}
                animate={
                  isOpening
                    ? {
                        y: -140,
                        scale: 1.02,
                        zIndex: 35,
                      }
                    : { y: 0, scale: 0.94, zIndex: 10 }
                }
                transition={{
                  delay: isOpening ? 0.45 : 0,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-x-3 sm:inset-x-4 top-3 bottom-3 bg-[#FDFBF7] rounded-xl p-6 sm:p-8 text-center border-2 border-[#D4AF37]/60 shadow-[0_10px_35px_rgba(0,0,0,0.35)] flex flex-col justify-between overflow-hidden"
              >
                {/* Gold filigree corner accents */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/70" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/70" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/70" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/70" />

                <div>
                  <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.25em] text-[10px] sm:text-xs uppercase mb-1">
                    The Wedding Of
                  </p>
                  <h1 className="font-[family-name:var(--font-great-vibes)] text-4xl sm:text-5xl text-[#8B1E41] leading-tight my-1 drop-shadow-sm">
                    {brideName} & {groomName}
                  </h1>
                  <div className="w-16 h-[1.5px] bg-[#D4AF37]/70 mx-auto my-2" />
                </div>

                {guest?.n ? (
                  <div className="my-auto">
                    <p className="font-[family-name:var(--font-cinzel)] text-gray-500 tracking-wider text-[10px] uppercase">
                      Cordially Invited
                    </p>
                    <h3 className="font-[family-name:var(--font-cinzel)] text-base sm:text-lg font-bold text-gray-900 mt-0.5">
                      {guest.n} {guest.fn ? `& ${guest.fn}` : ""}
                    </h3>
                    {guest.c && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#8B1E41]/10 text-[#8B1E41] rounded-full text-[11px] font-semibold border border-[#8B1E41]/20">
                        Seats Reserved: {guest.c}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="font-[family-name:var(--font-cormorant)] italic text-sm sm:text-base text-gray-600 my-auto">
                    Request the honor of your gracious presence & blessings
                  </p>
                )}

                <p className="font-[family-name:var(--font-cinzel)] text-[#8B1E41] text-[10px] tracking-widest uppercase font-semibold">
                  Together With Their Families
                </p>
              </motion.div>

              {/* 3. Envelope Front Pocket */}
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#500B20] to-[#68102B] border-l border-[#D4AF37]/30"
                  style={{ clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)" }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-l from-[#500B20] to-[#68102B] border-r border-[#D4AF37]/30"
                  style={{ clipPath: "polygon(100% 0%, 50% 50%, 100% 100%)" }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#3D0616] to-[#5C0D24] shadow-[0_-5px_15px_rgba(0,0,0,0.3)] border-b border-[#D4AF37]/30"
                  style={{ clipPath: "polygon(0% 100%, 50% 48%, 100% 100%)" }}
                />
              </div>

              {/* 4. Top Flap with 3D Flip Animation */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                }}
                className={`absolute top-0 inset-x-0 h-[175px] ${
                  isOpening ? "z-10" : "z-30"
                }`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#6A122D] to-[#4A0A1D] drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] border-t border-[#D4AF37]/40"
                  style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:12px_12px]" />
                </div>
              </motion.div>

              {/* 5. Wax Seal with Ganesha / Logo */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={
                  isOpening
                    ? { scale: 1.4, opacity: 0, filter: "blur(4px)" }
                    : { scale: 1, opacity: 1, filter: "blur(0px)" }
                }
                transition={{ duration: 0.4 }}
                onClick={handleOpenEnvelope}
                className="absolute top-[135px] z-40 cursor-pointer group select-none"
              >
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#A8244B] via-[#801334] to-[#450518] shadow-[0_8px_20px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.3)] border-2 border-[#D4AF37]/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                  {/* Outer Wax Texture Border */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#D4AF37]/60" />

                  {/* Embossed Ganesha / Logo Icon */}
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
                    <Image
                      src="/ganesha.svg" // Switch to "/logo.png" if preferred
                      alt="Royal Wax Seal Emblem"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      priority
                    />
                  </div>

                  {/* Pulsing glow ring */}
                  <div className="absolute -inset-1.5 rounded-full border border-[#D4AF37]/50 animate-ping pointer-events-none opacity-40" />
                </div>
              </motion.div>
            </div>

            {/* Action Button */}
            <motion.div
              animate={isOpening ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 z-10 w-full max-w-[320px]"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenEnvelope}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-gradient-to-r from-[#8B1E41] via-[#A8244B] to-[#5C1027] text-[#FDFBF7] rounded-full font-[family-name:var(--font-cinzel)] tracking-widest text-xs sm:text-sm uppercase shadow-[0_12px_28px_rgba(139,30,65,0.45)] border border-[#D4AF37]/60 hover:brightness-110 transition-all cursor-pointer"
              >
                <MailOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>Break Seal & Open</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
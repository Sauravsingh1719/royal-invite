"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { decodeGuestPayload } from "@/lib/guest-utils";
import { 
  Heart, 
  MapPin, 
  Clock, 
  CalendarHeart, 
  Sparkles, 
  Flower2,
  Crown,
  Leaf
} from "lucide-react";

interface DesignTwoProps {
  wedding: {
    bride: { name: string; parents: string; image: string; traits?: string[] };
    groom: { name: string; parents: string; image: string; traits?: string[] };
    couple: { quote?: string; image?: string };
    event: {
      dateText: string;
      timeText: string;
      venueTitle: string;
      venueAddress: string;
      googleMapsUrl: string;
    };
    defaultFamilySignOff: string;
  };
}

/* ─── Ambient Effects ─── */

const FloatingMarigolds = () => {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 12 + Math.random() * 10,
    size: 12 + Math.random() * 16,
    color: Math.random() > 0.5 ? "#D4AF37" : "#FF9933",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute opacity-20"
          style={{ left: `${petal.x}%`, top: "-5%" }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, Math.sin(petal.id * 1.3) * 40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill={petal.color}>
            <path d="M12 2C12 2 14 6 14 10C14 14 12 18 12 18C12 18 10 14 10 10C10 6 12 2 12 2Z" />
            <path d="M12 18C12 18 16 16 20 16C20 16 16 14 12 14C8 14 4 16 4 16C4 16 8 18 12 18Z" opacity="0.6" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const OrnateFrame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    {/* Corner ornaments */}
    <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-lg" />
    <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-lg" />
    <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-lg" />
    <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] rounded-br-lg" />
    {/* Inner dot accents */}
    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rotate-45" />
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rotate-45" />
    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rotate-45" />
    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 bg-[#D4AF37] rotate-45" />
    {children}
  </div>
);

const RoyalBadge = ({ text, position = "right" }: { text: string; position?: "left" | "right" }) => (
  <motion.div
    className={`absolute -top-4 ${position === "right" ? "-right-3" : "-left-3"} bg-gradient-to-br from-[#8B1E41] to-[#4A1023] text-[#FDFBF7] px-4 py-2 rounded-full shadow-xl border border-[#D4AF37] font-[family-name:var(--font-cinzel)] text-[10px] uppercase font-bold tracking-wider z-30`}
    style={{ rotate: position === "right" ? 12 : -12 }}
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
  >
    {text}
  </motion.div>
);

/* ─── Slide Content Components ─── */

const SlideOne = ({ startEntrance }: { startEntrance: boolean }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      animate={startEntrance ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
      className="text-center relative"
    >
      {/* Decorative mandala behind */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.06] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(12)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 100 100)`}>
              <path d="M100 10 Q105 50 100 100 Q95 50 100 10" fill="#D4AF37" />
              <circle cx="100" cy="25" r="4" fill="#8B1E41" />
            </g>
          ))}
        </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6 inline-block"
      >
        <div className="relative w-32 h-32 md:w-32 md:h-32">
    <Image
      src="/ganesha.svg"
      alt="Lord Ganesha Blessing"
      fill
      priority
      className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
    />
  </div>
      </motion.div>

      <motion.h2 
        className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.5em] uppercase text-sm md:text-base mb-6 font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={startEntrance ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Shree Ganeshay Namah
      </motion.h2>

      <motion.div
        className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"
        initial={{ scaleX: 0 }}
        animate={startEntrance ? { scaleX: 1 } : {}}
        transition={{ delay: 0.6, duration: 1 }}
      />

      <motion.p 
        className="font-[family-name:var(--font-cormorant)] text-gray-500 italic text-lg md:text-xl"
        initial={{ opacity: 0 }}
        animate={startEntrance ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 1 }}
      >
        A royal celebration of love, tradition, and togetherness
      </motion.p>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={startEntrance ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
);

const SlideTwo = ({ wedding }: { wedding: DesignTwoProps["wedding"] }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-3xl"
    >
      <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase font-bold mb-6">
        Introducing
      </p>

      <div className="relative inline-block mb-8">
        <OrnateFrame className="p-1 md:p-2">
          <div className="relative w-[280px] h-[380px] md:w-[360px] md:h-[480px] overflow-hidden rounded-t-full rounded-b-2xl bg-[#FDF4F6]">
            {wedding.couple.image ? (
              <Image
                src={wedding.couple.image}
                alt="The Couple"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 280px, 360px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#8B1E41]/10 to-[#FDFBF7]">
                <Heart className="w-16 h-16 text-[#D4AF37]/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Names overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <p className="font-[family-name:var(--font-great-vibes)] text-4xl md:text-5xl text-[#FDFBF7] drop-shadow-lg">
                {wedding.bride.name} <span className="text-[#D4AF37] mx-1">&</span> {wedding.groom.name}
              </p>
            </div>
          </div>
        </OrnateFrame>

        {/* Rotating decorative ring */}
        <motion.div
          className="absolute -inset-6 rounded-full border border-dashed border-[#D4AF37]/30 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {wedding.couple.quote && (
        <motion.p 
          className="font-[family-name:var(--font-cormorant)] italic text-xl md:text-2xl text-gray-600 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[#D4AF37] text-2xl">"</span>
          {wedding.couple.quote}
          <span className="text-[#D4AF37] text-2xl">"</span>
        </motion.p>
      )}
    </motion.div>
  </div>
);

const SlideThree = ({ wedding }: { wedding: DesignTwoProps["wedding"] }) => (
  <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
    <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
      {/* Portrait */}
      <motion.div
        className="relative flex-shrink-0"
        initial={{ opacity: 0, x: -80, rotate: -5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="relative p-2 bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30">
          <RoyalBadge text="The Bride" position="right" />
          <div className="relative w-[240px] h-[320px] md:w-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-[#FDF4F6]">
            <Image
              src={wedding.bride.image}
              alt={wedding.bride.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 240px, 300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#8B1E41]/20 to-transparent" />
          </div>
        </div>
        {/* Glow */}
        <div className="absolute -inset-4 bg-[#D4AF37]/10 rounded-full blur-3xl -z-10" />
      </motion.div>

      {/* Details */}
      <motion.div
        className="text-center md:text-left flex-1"
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase font-bold mb-3">
          Introducing
        </p>
        <h2 className="font-[family-name:var(--font-great-vibes)] text-6xl md:text-7xl text-[#8B1E41] mb-3">
          {wedding.bride.name}
        </h2>
        <p className="font-[family-name:var(--font-cormorant)] text-gray-600 italic text-lg md:text-xl font-semibold mb-6">
          {wedding.bride.parents}
        </p>

        {wedding.bride.traits && (
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {wedding.bride.traits.map((trait, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="inline-block bg-white/80 border border-[#D4AF37]/30 rounded-full px-4 py-2 font-[family-name:var(--font-cormorant)] italic text-[#8B1E41] text-sm shadow-sm"
              >
                {trait}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  </div>
);

const SlideFour = ({ wedding }: { wedding: DesignTwoProps["wedding"] }) => (
  <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
    <div className="max-w-4xl w-full flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
      {/* Portrait */}
      <motion.div
        className="relative flex-shrink-0"
        initial={{ opacity: 0, x: 80, rotate: 5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="relative p-2 bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30">
          <RoyalBadge text="The Groom" position="left" />
          <div className="relative w-[240px] h-[320px] md:w-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-[#F4F7F4]">
            <Image
              src={wedding.groom.image}
              alt={wedding.groom.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 240px, 300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#8B1E41]/20 to-transparent" />
          </div>
        </div>
        <div className="absolute -inset-4 bg-[#D4AF37]/10 rounded-full blur-3xl -z-10" />
      </motion.div>

      {/* Details */}
      <motion.div
        className="text-center md:text-right flex-1"
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase font-bold mb-3">
          Introducing
        </p>
        <h2 className="font-[family-name:var(--font-great-vibes)] text-6xl md:text-7xl text-[#8B1E41] mb-3">
          {wedding.groom.name}
        </h2>
        <p className="font-[family-name:var(--font-cormorant)] text-gray-600 italic text-lg md:text-xl font-semibold mb-6">
          {wedding.groom.parents}
        </p>

        {wedding.groom.traits && (
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {wedding.groom.traits.map((trait, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="inline-block bg-white/80 border border-[#D4AF37]/30 rounded-full px-4 py-2 font-[family-name:var(--font-cormorant)] italic text-[#8B1E41] text-sm shadow-sm"
              >
                {trait}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  </div>
);

const SlideFive = ({ wedding }: { wedding: DesignTwoProps["wedding"] }) => (
  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
    {/* Dark royal background */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#1a0410] via-[#2a0410] to-[#1a0410]">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#D4AF37]"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>

    <motion.div
      className="relative z-10 text-center px-6 max-w-3xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6 inline-block"
      >
        <Crown className="w-10 h-10 text-[#D4AF37] mx-auto opacity-80" />
      </motion.div>

      <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase font-bold mb-8">
        You are cordially invited to
      </p>

      <h2 className="font-[family-name:var(--font-great-vibes)] text-5xl md:text-7xl text-[#FDFBF7] mb-2 drop-shadow-lg">
        The Wedding of
      </h2>
      
      <h3 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-4xl text-[#D4AF37] font-bold tracking-wider mb-8">
        {wedding.bride.name} <span className="text-[#FDFBF7]/60 text-xl">&</span> {wedding.groom.name}
      </h3>

      <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <CalendarHeart className="w-6 h-6" />, label: "Date", value: wedding.event.dateText },
          { icon: <Clock className="w-6 h-6" />, label: "Time", value: wedding.event.timeText },
          { icon: <MapPin className="w-6 h-6" />, label: "Venue", value: wedding.event.venueTitle },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-5 hover:border-[#D4AF37]/50 transition-colors"
          >
            <div className="text-[#D4AF37] mb-2 flex justify-center">{item.icon}</div>
            <p className="font-[family-name:var(--font-cinzel)] text-[10px] text-[#D4AF37]/70 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="font-[family-name:var(--font-cormorant)] text-[#FDFBF7] text-lg font-semibold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <p className="font-[family-name:var(--font-cormorant)] text-gray-400 italic text-lg mb-8">
        {wedding.event.venueAddress}
      </p>

      <motion.a
        href={wedding.event.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] rounded-full font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-widest border border-[#D4AF37]/30 shadow-xl relative overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <MapPin className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Navigate to Venue</span>
      </motion.a>
    </motion.div>
  </div>
);

const SlideSixContent = ({ defaultFam, wedding }: { defaultFam: string; wedding: DesignTwoProps["wedding"] }) => {
  const searchParams = useSearchParams();
  const payload = decodeGuestPayload(searchParams.get("id"));
  const familyName = payload?.fam || defaultFam;

  return (
    <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center">
      {/* Monogram */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border-2 border-[#D4AF37] flex items-center justify-center shadow-lg">
          <span className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl text-[#8B1E41] font-bold">
            {wedding.bride.name.charAt(0)}
          </span>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-6 h-6 text-[#8B1E41] fill-[#8B1E41]" />
        </motion.div>
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border-2 border-[#D4AF37] flex items-center justify-center shadow-lg">
          <span className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl text-[#8B1E41] font-bold">
            {wedding.groom.name.charAt(0)}
          </span>
        </div>
      </motion.div>

      {payload?.m && (
        <motion.div 
          className="mb-10 w-full bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#D4AF37]/40" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#D4AF37]/40" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#D4AF37]/40" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#D4AF37]/40" />

          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#8B1E41] to-[#4A1023] border-2 border-[#D4AF37] shadow-xl flex items-center justify-center"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
          </motion.div>

          <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 mt-4">
            A Personal Note
          </p>
          {payload.n && (
            <h2 className="font-[family-name:var(--font-great-vibes)] text-4xl text-[#8B1E41] mb-4">
              Dear {payload.n},
            </h2>
          )}
          <p className="font-[family-name:var(--font-cormorant)] italic text-xl text-gray-700 leading-relaxed">
            <span className="text-[#D4AF37] text-2xl mr-1">"</span>
            {payload.m}
            <span className="text-[#D4AF37] text-2xl ml-1">"</span>
          </p>
        </motion.div>
      )}

      <motion.p 
        className="font-[family-name:var(--font-cormorant)] italic text-2xl md:text-3xl text-[#8B1E41] leading-relaxed max-w-xl mx-auto mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        We gracefully await your presence to bless the couple as they embark on this beautiful journey.
      </motion.p>

      <motion.div 
        className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
      />

      <motion.p 
        className="font-[family-name:var(--font-cinzel)] text-gray-500 uppercase tracking-[0.3em] text-xs font-bold mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        With Warm Regards,
      </motion.p>

      <motion.p 
        className="font-[family-name:var(--font-great-vibes)] text-[#8B1E41] text-5xl md:text-6xl capitalize"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        The {familyName} Family
      </motion.p>

      <motion.div 
        className="w-full text-center mt-12 pointer-events-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-8 bg-[#D4AF37]/40" />
          <Leaf className="w-3 h-3 text-[#D4AF37]/60" />
          <div className="h-px w-8 bg-[#D4AF37]/40" />
        </div>
        <a
          href="https://saurav190.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-cinzel)] text-[#D4AF37]/60 hover:text-[#8B1E41] text-[10px] uppercase tracking-[0.3em] transition-colors"
        >
          Designed & Developed by Saurav Singh
        </a>
      </motion.div>
    </div>
  );
};

/* ─── Main Component ─── */

export default function DesignTwo({ wedding }: DesignTwoProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [startEntrance, setStartEntrance] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("envelopeOpened")) {
        setStartEntrance(true);
      } else {
        const triggerEntrance = () => setStartEntrance(true);
        window.addEventListener("envelopeOpened", triggerEntrance);
        return () => window.removeEventListener("envelopeOpened", triggerEntrance);
      }
    }
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  // 600vh Timeline — 6 Slides
  const s1 = { opacity: useTransform(smoothProgress, [0, 0.12, 0.16], [1, 1, 0]), scale: useTransform(smoothProgress, [0, 0.16], [1, 1.1]), pe: useTransform(smoothProgress, (v) => (v < 0.16 ? "auto" : "none")) };
  const s2 = { opacity: useTransform(smoothProgress, [0.12, 0.16, 0.28, 0.32], [0, 1, 1, 0]), scale: useTransform(smoothProgress, [0.12, 0.32], [0.95, 1.05]), pe: useTransform(smoothProgress, (v) => (v >= 0.12 && v <= 0.32 ? "auto" : "none")) };
  const s3 = { opacity: useTransform(smoothProgress, [0.28, 0.32, 0.44, 0.48], [0, 1, 1, 0]), scale: useTransform(smoothProgress, [0.28, 0.48], [0.95, 1.05]), pe: useTransform(smoothProgress, (v) => (v >= 0.28 && v <= 0.48 ? "auto" : "none")) };
  const s4 = { opacity: useTransform(smoothProgress, [0.44, 0.48, 0.60, 0.64], [0, 1, 1, 0]), scale: useTransform(smoothProgress, [0.44, 0.64], [0.95, 1.05]), pe: useTransform(smoothProgress, (v) => (v >= 0.44 && v <= 0.64 ? "auto" : "none")) };
  const s5 = { opacity: useTransform(smoothProgress, [0.60, 0.64, 0.76, 0.80], [0, 1, 1, 0]), scale: useTransform(smoothProgress, [0.60, 0.80], [1.08, 1]), pe: useTransform(smoothProgress, (v) => (v >= 0.60 && v <= 0.80 ? "auto" : "none")) };
  const s6 = { opacity: useTransform(smoothProgress, [0.76, 0.80, 1], [0, 1, 1]), scale: useTransform(smoothProgress, [0.76, 1], [0.95, 1]), pe: useTransform(smoothProgress, (v) => (v >= 0.76 ? "auto" : "none")) };

  return (
    <main ref={containerRef} className="h-[600vh] bg-[#FDFBF7] text-gray-800 relative">
      <FloatingMarigolds />
      
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-[#FBF8F1] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
          <div className="absolute inset-4 md:inset-6 border border-[#D4AF37]/30 rounded-xl" />
          {/* Corner accents */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg" />
          <div className="absolute top-4 right-4 md:top-6 md:right-6 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg" />
        </div>

        {/* Slide 1: Opening */}
        <motion.div style={{ opacity: s1.opacity, scale: s1.scale, pointerEvents: s1.pe as any }} className="absolute inset-0">
          <SlideOne startEntrance={startEntrance} />
        </motion.div>

        {/* Slide 2: Couple Portrait */}
        <motion.div style={{ opacity: s2.opacity, scale: s2.scale, pointerEvents: s2.pe as any }} className="absolute inset-0">
          <SlideTwo wedding={wedding} />
        </motion.div>

        {/* Slide 3: Bride */}
        <motion.div style={{ opacity: s3.opacity, scale: s3.scale, pointerEvents: s3.pe as any }} className="absolute inset-0">
          <SlideThree wedding={wedding} />
        </motion.div>

        {/* Slide 4: Groom */}
        <motion.div style={{ opacity: s4.opacity, scale: s4.scale, pointerEvents: s4.pe as any }} className="absolute inset-0">
          <SlideFour wedding={wedding} />
        </motion.div>

        {/* Slide 5: Dark Venue */}
        <motion.div style={{ opacity: s5.opacity, pointerEvents: s5.pe as any }} className="absolute inset-0">
          <motion.div style={{ scale: s5.scale }} className="absolute inset-0">
            <SlideFive wedding={wedding} />
          </motion.div>
        </motion.div>

        {/* Slide 6: Blessings */}
        <motion.div style={{ opacity: s6.opacity, scale: s6.scale, pointerEvents: s6.pe as any }} className="absolute inset-0 flex items-center justify-center">
          <Suspense fallback={null}>
            <SlideSixContent defaultFam={wedding.defaultFamilySignOff} wedding={wedding} />
          </Suspense>
        </motion.div>
      </div>
    </main>
  );
}
"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate 
} from "framer-motion";
import Image from "next/image";
import { 
  Heart, 
  MapPin, 
  Clock, 
  CalendarHeart, 
  Sparkles, 
  Crown, 
  Flower2,
  ScrollText
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { decodeGuestPayload } from "@/lib/guest-utils";

/* ─── Types ─── */

interface DesignThreeProps {
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

const GoldDust = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 5.8) + (i % 3) * 2,
    y: (i * 5.2) + (i % 4) * 3,
    size: 1.5 + (i % 3),
    duration: 3.5 + (i % 4),
    delay: (i % 5) * 0.8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0], y: [0, -20, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const FloatingDiyas = () => {
  const diyas = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: 10 + i * 15,
    delay: i * 2,
    duration: 12 + (i % 3) * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {diyas.map((diya) => (
        <motion.div
          key={diya.id}
          className="absolute opacity-10"
          style={{ left: `${diya.x}%`, bottom: "-10%" }}
          animate={{
            y: [0, -1200],
            x: [0, Math.sin(diya.id) * 30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: diya.duration, repeat: Infinity, delay: diya.delay, ease: "linear" }}
        >
          <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
            <ellipse cx="12" cy="22" rx="10" ry="6" fill="#D4AF37" opacity="0.3" />
            <path d="M4 22 C4 14, 8 10, 12 8 C16 10, 20 14, 20 22" fill="#8B1E41" opacity="0.8" />
            <motion.circle 
              cx="12" 
              cy="6" 
              r="3" 
              fill="#D4AF37"
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

/* ─── 3D Royal Frame ─── */

const RoyalFrame = ({ 
  children, 
  className = "", 
  delay = 0,
  glowColor = "rgba(212,175,55,0.3)"
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  glowColor?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)")}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ transform, transition: "transform 0.2s ease-out" }}
      className={`relative ${className}`}
    >
      {/* Outer ornate border */}
      <div className="absolute -inset-3 md:-inset-4 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M5,5 L30,5 L35,0 L40,5 L60,5 L65,0 L70,5 L95,5 L95,30 L100,35 L95,40 L95,60 L100,65 L95,70 L95,95 L70,95 L65,100 L60,95 L40,95 L35,100 L30,95 L5,95 L5,70 L0,65 L5,60 L5,40 L0,35 L5,30 Z"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, delay: delay + 0.2 }}
          />
          <motion.path
            d="M10,10 L90,10 L90,90 L10,90 Z"
            fill="none"
            stroke="#8B1E41"
            strokeWidth="0.5"
            opacity="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: delay + 0.4 }}
          />
        </svg>
        
        {/* Corner jewels */}
        {[
          { x: "0%", y: "0%", rot: 0 },
          { x: "100%", y: "0%", rot: 90 },
          { x: "100%", y: "100%", rot: 180 },
          { x: "0%", y: "100%", rot: 270 },
        ].map((corner, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 md:w-6 md:h-6 -translate-x-1/2 -translate-y-1/2"
            style={{ left: corner.x, top: corner.y, transform: `translate(-50%, -50%) rotate(${corner.rot}deg)` }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L22 12L12 22L2 12Z" fill="#D4AF37" />
              <path d="M12 6L18 12L12 18L6 12Z" fill="#8B1E41" />
            </svg>
          </div>
        ))}
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute -inset-1 rounded-lg blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{ background: glowColor }}
      />
      
      <div className="relative overflow-hidden rounded-lg bg-[#FDFBF7]">
        {children}
      </div>
    </motion.div>
  );
};

/* ─── Animation Utilities ─── */

const WordFade = ({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: delay } },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 15, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const FadeIn = ({ children, delay = 0, className, direction = "up" }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) => {
  const dirs = { up: { y: 35, x: 0 }, down: { y: -35, x: 0 }, left: { y: 0, x: -35 }, right: { y: 0, x: 35 } };
  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Sections ─── */

const PersonalNote = () => {
  const searchParams = useSearchParams();
  const payload = decodeGuestPayload(searchParams.get("id"));
  if (!payload?.m) return null;

  return (
    <section className="min-h-[50vh] flex items-center justify-center relative z-30 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E1] to-[#EDE6D1] rounded-3xl shadow-2xl -z-10" />
        
        <div className="p-8 md:p-14 text-center relative">
          <motion.div
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#8B1E41] to-[#4A1023] border-4 border-[#D4AF37] shadow-xl flex items-center justify-center z-20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <ScrollText className="w-6 h-6 text-[#D4AF37]" />
          </motion.div>

          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6 mt-2" />

          <p className="font-[family-name:var(--font-cinzel)] text-[#8B1E41] uppercase tracking-[0.35em] text-[10px] md:text-xs font-bold mb-4">
            A Royal Invitation
          </p>
          
          {payload.n && (
            <h2 className="font-[family-name:var(--font-great-vibes)] text-4xl md:text-5xl text-[#8B1E41] mb-6">
              Dear {payload.n},
            </h2>
          )}
          
          <p className="font-[family-name:var(--font-cormorant)] italic text-xl md:text-2xl text-[#4a3f35] leading-relaxed">
            &ldquo;{payload.m}&rdquo;
          </p>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#8B1E41] to-transparent mx-auto mt-8" />
        </div>
      </motion.div>
    </section>
  );
};

const FooterBlessings = ({ defaultFam }: { defaultFam: string }) => {
  const searchParams = useSearchParams();
  const payload = decodeGuestPayload(searchParams.get("id"));
  const familyName = payload?.fam || defaultFam;

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center relative z-30 p-8 text-center pb-20 overflow-hidden">
      <WordFade
        delay={0.1}
        text="We humbly seek your blessings as we unite in the sacred bond of marriage."
        className="font-[family-name:var(--font-cormorant)] italic text-2xl md:text-4xl text-[#8B1E41] leading-relaxed max-w-3xl mx-auto px-4 relative z-10"
      />
      
      <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-8 mb-6" />
      
      <p className="font-[family-name:var(--font-cinzel)] text-gray-400 uppercase tracking-[0.3em] text-xs font-bold relative z-10">
        With Reverence &amp; Joy,
      </p>
      
      <span className="font-[family-name:var(--font-great-vibes)] text-[#8B1E41] text-5xl md:text-6xl capitalize block mt-3 relative z-10">
        The {familyName} Family
      </span>

      <div className="mt-14 relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-px w-8 bg-[#D4AF37]/40" />
          <Crown className="w-4 h-4 text-[#D4AF37]/60" />
          <div className="h-px w-8 bg-[#D4AF37]/40" />
        </div>
        <a
          href="https://saurav190.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-cinzel)] text-[#D4AF37]/60 hover:text-[#8B1E41] text-[10px] uppercase tracking-[0.3em] transition-colors"
        >
          Crafted by Saurav Singh
        </a>
      </div>
    </section>
  );
};

/* ─── Main Component ─── */

export default function DesignThree({ wedding }: DesignThreeProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [startEntrance, setStartEntrance] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("envelopeOpened")) {
        setStartEntrance(true);
      } else {
        const trigger = () => setStartEntrance(true);
        window.addEventListener("envelopeOpened", trigger);
        return () => window.removeEventListener("envelopeOpened", trigger);
      }
    }
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Extended visibility range so Bride & Groom remain completely clear and only disappear naturally when scrolled past
  const heroY = useTransform(smoothProgress, [0, 0.25], ["0%", "18%"]);
  const heroOpacity = useTransform(smoothProgress, [0.08, 0.26], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0.08, 0.26], [1, 0.92]);

  // Spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(212,175,55,0.08), transparent 40%)`;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const coupleProfiles = [
    { ...wedding.bride, role: "The Bride", icon: Flower2, dir: "left" as const, delay: 0.1 },
    { ...wedding.groom, role: "The Groom", icon: Crown, dir: "right" as const, delay: 0.2 }
  ];

  return (
    <main 
      ref={containerRef} 
      className="bg-[#0a0a0a] text-[#FDFBF7] relative overflow-x-hidden min-h-screen selection:bg-[#8B1E41] selection:text-[#FDFBF7]"
      onMouseMove={handleMouseMove}
    >
      <GoldDust />
      <FloatingDiyas />
      
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background: spotlight }} />
      <div className="fixed inset-0 bg-gradient-to-b from-[#1a0410] via-[#0a0a0a] to-[#1a0410] -z-20" />

      {/* ─── HERO: The Royal Court ─── */}
      <motion.section 
        className="min-h-[100dvh] relative z-30 flex flex-col items-center justify-center px-4 pt-16 pb-12"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={startEntrance ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="relative w-30 h-50 md:w-40 md:h-40">
    <Image
      src="/ganesha.svg"
      alt="Lord Ganesha Blessing"
      fill
      priority
      className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
    />
  </div>
          <WordFade
            delay={0.2}
            text="Shree Ganeshay Namah"
            className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.45em] uppercase text-xs md:text-sm font-bold"
          />
        </motion.div>

        {/* Triptych Grid */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-items-center">
          
          {/* Bride (Left) */}
          <RoyalFrame delay={0.4} className="w-full max-w-[300px] lg:max-w-[280px] order-2 lg:order-1">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#1a0a10]">
              <Image
                src={wedding.bride.image}
                alt={wedding.bride.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 300px, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] mb-1">The Bride</p>
                <h3 className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl text-[#FDFBF7]">{wedding.bride.name}</h3>
              </div>
            </div>
          </RoyalFrame>

          {/* Couple (Center) */}
          <RoyalFrame delay={0.2} className="w-full max-w-[340px] lg:max-w-[380px] order-1 lg:order-2" glowColor="rgba(139,30,65,0.4)">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#1a0a10]">
              {wedding.couple.image ? (
                <Image
                  src={wedding.couple.image}
                  alt="The Couple"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 340px, 380px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#8B1E41]/20 to-[#1a0410]">
                  <Heart className="w-16 h-16 text-[#D4AF37]/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/25 to-transparent opacity-90" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Crown className="w-9 h-9 text-[#D4AF37] mx-auto mb-3 opacity-85" />
                <h1 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-[#FDFBF7] uppercase tracking-wider leading-tight">
                  Together<br/>Forever
                </h1>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <p className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl text-[#D4AF37]">
                  {wedding.bride.name} <span className="text-[#8B1E41] mx-1">&amp;</span> {wedding.groom.name}
                </p>
                <p className="font-[family-name:var(--font-cinzel)] text-[9px] text-[#D4AF37]/75 uppercase tracking-[0.35em] mt-1.5">
                  Request the honor of your presence
                </p>
              </div>
            </div>
          </RoyalFrame>

          {/* Groom (Right) */}
          <RoyalFrame delay={0.4} className="w-full max-w-[300px] lg:max-w-[280px] order-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#1a0a10]">
              <Image
                src={wedding.groom.image}
                alt={wedding.groom.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 300px, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] mb-1">The Groom</p>
                <h3 className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl text-[#FDFBF7]">{wedding.groom.name}</h3>
              </div>
            </div>
          </RoyalFrame>
        </div>

        {/* Scroll indicator */}
        <div className="mt-10 flex flex-col items-center gap-1.5 opacity-75">
          <span className="font-[family-name:var(--font-cinzel)] text-[9px] text-[#D4AF37] uppercase tracking-[0.3em]">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── COUPLE QUOTE SECTION ─── */}
      <section className="min-h-[55vh] flex items-center justify-center relative z-30 px-6 py-16">
        <div className="max-w-4xl w-full">
          <FadeIn>
            <div className="relative bg-gradient-to-br from-[#8B1E41]/10 to-transparent border border-[#D4AF37]/20 rounded-3xl p-8 md:p-14 text-center backdrop-blur-sm">
              <WordFade
                text={wedding.couple.quote || "Two souls, one heart, a lifetime of love."}
                className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-5xl text-[#FDFBF7] leading-relaxed relative z-10"
              />
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── BRIDE & GROOM DETAILS ─── */}
      <section className="relative z-30 px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {coupleProfiles.map((person, i) => {
            const IconComponent = person.icon;
            return (
              <FadeIn key={i} direction={person.dir} delay={person.delay}>
                <div className="bg-gradient-to-br from-[#1a0a10] to-[#0f050a] border border-[#D4AF37]/20 rounded-3xl p-7 md:p-9 relative overflow-hidden hover:border-[#D4AF37]/40 transition-colors duration-500">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#8B1E41]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] text-[10px] uppercase tracking-[0.3em]">Introducing</p>
                      <h3 className="font-[family-name:var(--font-great-vibes)] text-3xl sm:text-4xl text-[#FDFBF7]">{person.name}</h3>
                    </div>
                  </div>
                  
                  <p className="font-[family-name:var(--font-cormorant)] text-gray-400 italic text-base sm:text-lg mb-5">
                    {person.parents}
                  </p>

                  {person.traits && (
                    <div className="space-y-2.5">
                      {person.traits.map((trait, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-[#FDFBF7]/5 border border-[#D4AF37]/10 rounded-xl px-4 py-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          <span className="font-[family-name:var(--font-cormorant)] text-[#FDFBF7]/90 italic text-base">{trait}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <Suspense fallback={null}>
        <PersonalNote />
      </Suspense>

      {/* ─── EVENT DETAILS ─── */}
      <section className="min-h-[70vh] flex items-center justify-center relative z-30 px-6 py-16">
        <motion.div 
          className="max-w-4xl w-full bg-gradient-to-br from-[#1a0a10] to-[#0f050a] border border-[#D4AF37]/30 rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-10">
            <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] text-[10px] uppercase tracking-[0.35em] mb-2">Save the Date</p>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold text-[#FDFBF7]">
              The <span className="text-[#D4AF37]">Celebration</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <CalendarHeart className="w-7 h-7" />, label: "Date", value: wedding.event.dateText, delay: 0.1 },
              { icon: <Clock className="w-7 h-7" />, label: "Time", value: wedding.event.timeText, delay: 0.2 },
              { icon: <MapPin className="w-7 h-7" />, label: "Venue", value: `${wedding.event.venueTitle}, ${wedding.event.venueAddress}`, delay: 0.3 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay, duration: 0.5 }}
                className="bg-[#FDFBF7]/5 border border-[#D4AF37]/20 rounded-2xl p-6 text-center hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="text-[#D4AF37] mb-3 flex justify-center">{item.icon}</div>
                <p className="font-[family-name:var(--font-cinzel)] text-[10px] text-[#D4AF37]/70 uppercase tracking-[0.25em] mb-1.5">{item.label}</p>
                <p className="font-[family-name:var(--font-cormorant)] text-[#FDFBF7] text-lg font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-9">
            <motion.a
              href={wedding.event.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] rounded-full font-[family-name:var(--font-cinzel)] font-bold text-xs uppercase tracking-widest shadow-xl border border-[#D4AF37]/30 hover:brightness-110 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <MapPin className="w-4 h-4" />
              <span>Navigate to Venue</span>
            </motion.a>
          </div>
        </motion.div>
      </section>

      <Suspense fallback={null}>
        <FooterBlessings defaultFam={wedding.defaultFamilySignOff} />
      </Suspense>
    </main>
  );
}
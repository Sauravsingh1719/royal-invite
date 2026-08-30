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
  CalendarHeart, 
  Sparkles, 
  Flower2,
  Leaf
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { decodeGuestPayload } from "@/lib/guest-utils";

/* ─── Types ─── */

interface DesignFourProps {
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

/* ─── Floating Lotus Petals ─── */

const FloatingLotus = () => {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (i * 8.3) + Math.sin(i) * 3,
    delay: i * 0.9,
    duration: 16 + (i % 5) * 2,
    size: 16 + (i % 4) * 4,
    color: i % 2 === 0 ? "#D4AF37" : "#E8D5C4",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute opacity-25"
          style={{ left: `${petal.x}%`, top: "-6%" }}
          animate={{
            y: ["0vh", "115vh"],
            x: [0, (petal.id % 2 === 0 ? 30 : -30), 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill={petal.color}>
            <path d="M12 2C12 2 8 8 8 14C8 18 10 22 12 22C14 22 16 18 16 14C16 8 12 2 12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

/* ─── Cameo Frame ─── */

const CameoFrame = ({ 
  src, 
  alt, 
  delay = 0,
  borderColor = "#D4AF37"
}: { 
  src: string; 
  alt: string; 
  delay?: number;
  borderColor?: string;
}) => (
  <motion.div
    className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {/* Outer dashed ring */}
    <motion.div
      className="absolute inset-[-10px] rounded-full border-2 border-dashed opacity-40"
      style={{ borderColor }}
      animate={{ rotate: 360 }}
      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
    />
    
    {/* Inner ring */}
    <div 
      className="absolute inset-[-4px] rounded-full border border-opacity-30" 
      style={{ borderColor }} 
    />

    {/* Glow backdrop */}
    <div 
      className="absolute inset-0 rounded-full blur-xl opacity-20"
      style={{ background: `radial-gradient(circle, ${borderColor} 0%, transparent 70%)` }}
    />

    {/* Image wrapper */}
    <div 
      className="relative w-full h-full rounded-full overflow-hidden border-[3px] shadow-xl bg-[#F7F3ED]"
      style={{ borderColor }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 250px, 300px"
      />
    </div>

    {/* Decorative bottom gem */}
    <div 
      className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rotate-45 bg-[#F7F3ED] border-2 flex items-center justify-center shadow-sm"
      style={{ borderColor }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: borderColor }} />
    </div>
  </motion.div>
);

/* ─── Center Sacred Thread Connector ─── */

const SacredThread = () => (
  <div className="hidden md:flex flex-col items-center justify-center self-center px-4">
    <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37]" />
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="my-3 p-2 rounded-full bg-[#8B1F3C]/10 border border-[#D4AF37]/40"
    >
      <Heart className="w-5 h-5 text-[#8B1F3C] fill-[#8B1F3C]" />
    </motion.div>
    <div className="w-px h-20 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent" />
  </div>
);

/* ─── Decorative Filigree Divider ─── */

const FiligreeDivider = () => (
  <div className="flex items-center justify-center gap-3 my-12 opacity-80">
    <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-[#D4AF37]" />
    <Flower2 className="w-4 h-4 text-[#D4AF37]" />
    <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-[#D4AF37]" />
  </div>
);

/* ─── Animated Text Fade ─── */

const WordFade = ({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

/* ─── Personal Note Component ─── */

const PersonalNote = () => {
  const searchParams = useSearchParams();
  const payload = decodeGuestPayload(searchParams.get("id"));
  if (!payload?.m) return null;

  return (
    <section className="relative z-30 px-6 py-12 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full bg-white/75 backdrop-blur-md rounded-3xl border border-[#D4AF37]/40 shadow-xl p-8 md:p-12 text-center relative"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8B1F3C]/10 border border-[#D4AF37]/40 mb-4">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        </div>

        <p className="font-[family-name:var(--font-cinzel)] text-[#8B1F3C] uppercase tracking-[0.25em] text-[11px] font-bold mb-3">
          A Personal Note
        </p>
        
        {payload.n && (
          <h2 className="font-[family-name:var(--font-great-vibes)] text-4xl md:text-5xl text-[#8B1F3C] mb-4">
            Dear {payload.n},
          </h2>
        )}
        
        <p className="font-[family-name:var(--font-cormorant)] italic text-xl md:text-2xl text-[#5c4a3d] leading-relaxed">
          &ldquo;{payload.m}&rdquo;
        </p>
      </motion.div>
    </section>
  );
};

/* ─── Footer Section ─── */

const FooterBlessings = ({ defaultFam }: { defaultFam: string }) => {
  const searchParams = useSearchParams();
  const payload = decodeGuestPayload(searchParams.get("id"));
  const familyName = payload?.fam || defaultFam;

  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center relative z-30 px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-[#8B1F3C]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
        <Leaf className="w-6 h-6 text-[#2D5A4A]" />
      </div>

      <WordFade
        delay={0.1}
        text="We seek your blessings as we begin this beautiful journey together."
        className="font-[family-name:var(--font-cormorant)] italic text-2xl md:text-3xl text-[#8B1F3C] max-w-xl mx-auto mb-6"
      />
      
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-4" />
      
      <p className="font-[family-name:var(--font-cinzel)] text-[#8B1F3C]/70 uppercase tracking-[0.25em] text-xs font-bold mb-2">
        With Love & Gratitude,
      </p>
      
      <span className="font-[family-name:var(--font-great-vibes)] text-[#8B1F3C] text-4xl md:text-5xl block mb-12">
        The {familyName} Family
      </span>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="h-px w-6 bg-[#D4AF37]/40" />
          <Flower2 className="w-3 h-3 text-[#D4AF37]/60" />
          <div className="h-px w-6 bg-[#D4AF37]/40" />
        </div>
        <a
          href="https://saurav190.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-cinzel)] text-[#D4AF37]/70 hover:text-[#8B1F3C] text-[10px] uppercase tracking-[0.25em] transition-colors"
        >
          Crafted by Saurav Singh
        </a>
      </div>
    </section>
  );
};

/* ─── Main Component ─── */

export default function DesignFour({ wedding }: DesignFourProps) {
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
  const heroOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);

  // Spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(212,175,55,0.06), transparent 70%)`;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <main 
      ref={containerRef} 
      className="bg-[#FBF9F5] text-[#2a0410] relative overflow-x-hidden min-h-screen selection:bg-[#8B1F3C] selection:text-[#FBF9F5]"
      onMouseMove={handleMouseMove}
    >
      <FloatingLotus />
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background: spotlight }} />

      {/* ─── HERO SECTION ─── */}
      <motion.section 
        className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 py-16 text-center z-10"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={startEntrance ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-2 mb-4"
        >
          <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={startEntrance ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8 }}
  className="flex flex-col items-center gap-3 mb-6"
>
  <div className="relative w-22 h-22 md:w-20 md:h-20">
    <Image
      src="/ganesha.svg"
      alt="Lord Ganesha Blessing"
      fill
      priority
      className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
    />
  </div>
  
  <span className="font-[family-name:var(--font-cinzel)] text-[#8B1E41] tracking-[0.45em] uppercase text-xs md:text-sm font-bold">
    || Shree Ganeshayah Namah ||
  </span>
</motion.div>
        </motion.div>

        <motion.h1 
          className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-6xl md:text-7xl font-bold text-[#8B1F3C] leading-tight mb-2"
          initial={{ opacity: 0, y: 25 }}
          animate={startEntrance ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {wedding.bride.name} 
          <span className="text-[#D4AF37] font-[family-name:var(--font-great-vibes)] font-normal text-5xl sm:text-7xl md:text-8xl mx-3">
            &amp;
          </span> 
          {wedding.groom.name}
        </motion.h1>

        {/* Framed Couple Portrait (Avoids Full-Page Pixelation) */}
        {wedding.couple.image && (
          <motion.div 
            className="relative mx-auto my-6 w-52 h-64 sm:w-60 sm:h-72 md:w-64 md:h-80 rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={startEntrance ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Image
              src={wedding.couple.image}
              alt="The Couple"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 240px, 280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={startEntrance ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-[family-name:var(--font-cormorant)] italic text-lg sm:text-xl text-[#5c4a3d] max-w-lg mx-auto mb-6"
        >
          Request the honor of your presence as they begin their forever
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={startEntrance ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/70 border border-[#D4AF37]/30 shadow-sm"
        >
          <CalendarHeart className="w-4 h-4 text-[#8B1F3C]" />
          <span className="font-[family-name:var(--font-cinzel)] text-[#8B1F3C] text-xs uppercase tracking-[0.2em] font-bold">
            {wedding.event.dateText}
          </span>
        </motion.div>
      </motion.section>

      <FiligreeDivider />

      {/* ─── PERSONAL NOTE ─── */}
      <Suspense fallback={null}>
        <PersonalNote />
      </Suspense>

      {/* ─── THE COUPLE SECTION (PERFECTLY ALIGNED) ─── */}
      <section className="relative z-30 px-6 py-14 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] uppercase tracking-[0.3em] text-[11px] font-bold mb-2">
            Introducing
          </p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1F3C]">
            The <span className="text-[#2D5A4A]">Bride</span> &amp; <span className="text-[#2D5A4A]">Groom</span>
          </h2>
        </div>

        {/* 3-Part Flexbox Container: Bride | Thread | Groom */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-8">
          
          {/* Bride Column */}
          <div className="flex-1 flex flex-col items-center text-center w-full max-w-xs">
            <CameoFrame 
              src={wedding.bride.image} 
              alt={wedding.bride.name} 
              delay={0.2}
              borderColor="#D4AF37"
            />
            
            <div className="mt-6 space-y-1">
              <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold">
                The Bride
              </p>
              <h3 className="font-[family-name:var(--font-great-vibes)] text-4xl sm:text-5xl text-[#8B1F3C]">
                {wedding.bride.name}
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-[#5c4a3d] italic text-base">
                {wedding.bride.parents}
              </p>
            </div>

            {wedding.bride.traits && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {wedding.bride.traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="bg-white/80 border border-[#D4AF37]/30 rounded-full px-3.5 py-1 font-[family-name:var(--font-cormorant)] italic text-[#8B1F3C] text-xs shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Center Connector */}
          <SacredThread />

          {/* Groom Column */}
          <div className="flex-1 flex flex-col items-center text-center w-full max-w-xs">
            <CameoFrame 
              src={wedding.groom.image} 
              alt={wedding.groom.name} 
              delay={0.3}
              borderColor="#8B1F3C"
            />
            
            <div className="mt-6 space-y-1">
              <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold">
                The Groom
              </p>
              <h3 className="font-[family-name:var(--font-great-vibes)] text-4xl sm:text-5xl text-[#8B1F3C]">
                {wedding.groom.name}
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-[#5c4a3d] italic text-base">
                {wedding.groom.parents}
              </p>
            </div>

            {wedding.groom.traits && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {wedding.groom.traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="bg-white/80 border border-[#8B1F3C]/30 rounded-full px-3.5 py-1 font-[family-name:var(--font-cormorant)] italic text-[#8B1F3C] text-xs shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ─── COUPLE QUOTE ─── */}
      <section className="relative z-30 py-12 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-md rounded-3xl p-8 md:p-14 text-center border border-[#D4AF37]/30 shadow-lg">
          <WordFade
            text={wedding.couple.quote || "In you, I have found the one whom my soul loves."}
            className="font-[family-name:var(--font-great-vibes)] text-3xl sm:text-4xl md:text-5xl text-[#8B1F3C] leading-relaxed"
          />
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
        </div>
      </section>

      <FiligreeDivider />

      {/* ─── EVENT CELEBRATION DETAILS ─── */}
      <section className="relative z-30 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] uppercase tracking-[0.3em] text-[11px] font-bold mb-2">
              Save the Date
            </p>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl font-bold text-[#8B1F3C]">
              The Celebration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <CalendarHeart className="w-6 h-6" />, 
                label: "When", 
                value: wedding.event.dateText,
                sub: wedding.event.timeText,
                accent: "#8B1F3C"
              },
              { 
                icon: <MapPin className="w-6 h-6" />, 
                label: "Where", 
                value: wedding.event.venueTitle,
                sub: wedding.event.venueAddress,
                accent: "#2D5A4A"
              },
              { 
                icon: <Heart className="w-6 h-6" />, 
                label: "Blessings", 
                value: "Your Presence",
                sub: "Is our greatest gift",
                accent: "#D4AF37"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#D4AF37]/25 shadow-md flex flex-col items-center justify-between"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${item.accent}15`, color: item.accent }}
                >
                  {item.icon}
                </div>
                
                <p className="font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-1">
                  {item.label}
                </p>
                <p className="font-[family-name:var(--font-cormorant)] text-xl font-bold text-[#2a0410] mb-1">
                  {item.value}
                </p>
                <p className="font-[family-name:var(--font-cormorant)] text-sm text-gray-600 italic">
                  {item.sub}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <motion.a
              href={wedding.event.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8B1F3C] text-[#FBF9F5] rounded-full font-[family-name:var(--font-cinzel)] font-bold text-xs uppercase tracking-widest shadow-lg border border-[#D4AF37]/30 hover:bg-[#721830] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <MapPin className="w-4 h-4" />
              <span>Get Directions</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <Suspense fallback={null}>
        <FooterBlessings defaultFam={wedding.defaultFamilySignOff} />
      </Suspense>
    </main>
  );
}
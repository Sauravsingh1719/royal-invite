"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import Image from "next/image";
import {
  Heart,
  ArrowDown,
  MapPin,
  Clock,
  CalendarHeart,
  Sparkles,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { decodeGuestPayload } from "@/lib/guest-utils";

export interface IWeddingFunctionItem {
  _id?: string;
  title: string;
  dateText: string;
  timeText: string;
  venueTitle: string;
  venueAddress: string;
  googleMapsUrl?: string;
}

interface DesignOneProps {
  wedding: {
    displayOrder?: "bride_first" | "groom_first";
    bride: { name: string; parents: string; image: string; traits?: string[] };
    groom: { name: string; parents: string; image: string; traits?: string[] };
    couple: { quote?: string; image?: string; title?: string };
    event: {
      dateText: string;
      timeText: string;
      venueTitle: string;
      venueAddress: string;
      googleMapsUrl: string;
    };
    functions?: IWeddingFunctionItem[];
    defaultFamilySignOff: string;
  };
}

/* ─── Indian Ornamental Divider ─── */
const OrnateDivider = () => (
  <div className="flex items-center justify-center gap-4 my-10 opacity-90">
    <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]" />
    <div className="w-6 h-6 rotate-45 border-2 border-[#D4AF37] bg-[#8B1E41] shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
    <div className="w-6 h-6 rotate-45 border-2 border-[#D4AF37] bg-[#8B1E41] shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
    <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]" />
  </div>
);

/* ─── Corner Ornaments ─── */
const CornerOrnaments = () => (
  <>
    {/* Top Left */}
    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-2xl opacity-70" />
    <div className="absolute top-2 left-2 w-12 h-12 border-t border-l border-[#D4AF37]/50 rounded-tl-xl" />
    {/* Top Right */}
    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-2xl opacity-70" />
    <div className="absolute top-2 right-2 w-12 h-12 border-t border-r border-[#D4AF37]/50 rounded-tr-xl" />
    {/* Bottom Left */}
    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-2xl opacity-70" />
    <div className="absolute bottom-2 left-2 w-12 h-12 border-b border-l border-[#D4AF37]/50 rounded-bl-xl" />
    {/* Bottom Right */}
    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] rounded-br-2xl opacity-70" />
    <div className="absolute bottom-2 right-2 w-12 h-12 border-b border-r border-[#D4AF37]/50 rounded-br-xl" />
  </>
);

/* ─── Floating Lotus Petals ─── */
const FloatingLotus = () => {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: i * 5.6 + Math.sin(i) * 4,
    delay: i * 0.7,
    duration: 18 + (i % 6) * 3,
    size: 14 + (i % 5) * 5,
    color: i % 3 === 0 ? "#D4AF37" : i % 3 === 1 ? "#E8D5C4" : "#C8A24A",
    shape: i % 2 === 0 ? "petal" : "dot",
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
            x: [0, petal.id % 3 === 0 ? 40 : -40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          {petal.shape === "petal" ? (
            <svg
              width={petal.size}
              height={petal.size}
              viewBox="0 0 24 24"
              fill={petal.color}
            >
              <path d="M12 2C12 2 8 8 8 14C8 18 10 22 12 22C14 22 16 18 16 14C16 8 12 2 12 2Z" />
            </svg>
          ) : (
            <div
              style={{
                width: petal.size / 2,
                height: petal.size / 2,
                backgroundColor: petal.color,
                borderRadius: "50%",
                boxShadow: `0 0 6px ${petal.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

/* ─── WordFade Animation ─── */
const WordFade = ({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.04, delayChildren: delay },
        },
      }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

/* ─── FadeIn Animation ─── */
const FadeIn = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={{
      hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, delay, ease: "easeOut" },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Personal Guest Note ─── */
const PersonalNote = () => {
  const searchParams = useSearchParams();
  const payload = decodeGuestPayload(searchParams.get("id"));

  if (!payload?.m) return null;

  return (
    <section className="min-h-[50vh] flex items-center justify-center relative z-30 px-6 py-12 md:py-20 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full bg-white/85 backdrop-blur-md p-10 md:p-14 rounded-3xl border-2 border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(139,30,65,0.1)] text-center"
      >
        <CornerOrnaments />
        <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] uppercase tracking-widest text-[10px] md:text-xs mb-6 font-bold">
          A Personal Note
        </p>
        {payload.n && (
          <h2 className="font-[family-name:var(--font-great-vibes)] text-4xl md:text-5xl text-[#8B1E41] mb-6">
           Dear {payload.n} {payload.fn ? `& ${payload.fn}` : (payload as any).s ? (payload as any).s : ""},
          </h2>
          )}
        <p className="font-[family-name:var(--font-cormorant)] italic text-xl md:text-3xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
          &ldquo;{payload.m}&rdquo;
        </p>
      </motion.div>
    </section>
  );
};

/* ─── Footer Blessings ─── */
const FooterBlessings = ({ defaultFam }: { defaultFam: string }) => {
  const searchParams = useSearchParams();
  const payload = decodeGuestPayload(searchParams.get("id"));
  const familyName = payload?.fam || defaultFam;

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center relative z-30 p-8 text-center pb-24">
      <WordFade
        delay={0.2}
        text="We gracefully await your presence to bless the couple as they embark on this beautiful journey."
        className="font-[family-name:var(--font-cormorant)] italic text-2xl md:text-5xl text-[#8B1E41] leading-relaxed max-w-3xl mx-auto drop-shadow-sm px-4"
      />
      <FadeIn delay={0.8}>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-10 md:mt-12 mb-8" />
      </FadeIn>
      <WordFade
        delay={1.0}
        text="With Warm Regards,"
        className="font-[family-name:var(--font-cinzel)] text-gray-500 uppercase tracking-[0.3em] text-xs md:text-sm font-bold"
      />
      <FadeIn delay={1.2}>
        <span className="font-[family-name:var(--font-great-vibes)] text-[#8B1E41] text-5xl md:text-6xl capitalize tracking-normal leading-tight block mt-4">
          The {familyName} Family
        </span>
      </FadeIn>

      
    </section>
  );
};

/* ─── Main Component ─── */
export default function DesignOne({ wedding }: DesignOneProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [startEntrance, setStartEntrance] = useState(false);

  const isGroomFirst = wedding.displayOrder === "groom_first";

  // Mouse spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(212,175,55,0.08), transparent 70%)`;

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth > 768);
    checkSize();
    window.addEventListener("resize", checkSize);

    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("envelopeOpened")) {
        setStartEntrance(true);
      } else {
        const triggerEntrance = () => setStartEntrance(true);
        window.addEventListener("envelopeOpened", triggerEntrance);
        return () => {
          window.removeEventListener("envelopeOpened", triggerEntrance);
          window.removeEventListener("resize", checkSize);
        };
      }
    }
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scrollPoints = [0, 0.1, 0.18, 0.25, 0.35, 0.42, 0.5, 0.6, 0.68, 0.75];
  const arrowTop = useTransform(smoothProgress, scrollPoints, [
    "80%",
    "80%",
    "10%",
    "50%",
    "50%",
    "10%",
    "50%",
    "50%",
    "85%",
    "65%",
  ]);
  const arrowScale = useTransform(smoothProgress, scrollPoints, [
    1, 1, 0.4, 1, 1, 0.4, 1, 1, 0.4, 1,
  ]);
  const leftDesktop = useTransform(smoothProgress, scrollPoints, [
    "50%",
    "50%",
    "50%",
    "25%",
    "25%",
    "25%",
    "75%",
    "75%",
    "75%",
    "50%",
  ]);
  const leftMobile = useTransform(smoothProgress, scrollPoints, [
    "50%",
    "50%",
    "50%",
    "50%",
    "50%",
    "50%",
    "50%",
    "50%",
    "50%",
    "50%",
  ]);
  const arrowLeft = isDesktop ? leftDesktop : leftMobile;

  const firstCardGlow = useTransform(smoothProgress, scrollPoints, [
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 60px 15px rgba(212,175,55,0.4)",
    "0px 0px 60px 15px rgba(212,175,55,0.4)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
  ]);

  const secondCardGlow = useTransform(smoothProgress, scrollPoints, [
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 60px 15px rgba(212,175,55,0.4)",
    "0px 0px 60px 15px rgba(212,175,55,0.4)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
    "0px 0px 0px 0px rgba(212,175,55,0)",
  ]);

  const arrowOpacity = useTransform(smoothProgress, [0, 0.85, 0.9], [1, 1, 0]);
  const bounceTransition = { type: "spring", stiffness: 150, damping: 12, mass: 1.2 };

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Profile Card Renderers
  const renderBrideCard = (glowMotion: any, isFirst: boolean) => (
    <section
      key="bride-section"
      className={`min-h-screen flex items-center justify-center ${
        isFirst ? "md:justify-start" : "md:justify-end"
      } px-4 md:px-24 relative z-30 w-full max-w-7xl mx-auto`}
    >
      <motion.div
        initial={{
          x: isDesktop ? (isFirst ? 300 : -300) : 50,
          opacity: 0,
          rotate: isDesktop ? (isFirst ? 15 : -15) : 5,
        }}
        whileInView={{ x: 0, opacity: 1, rotate: isFirst ? -3 : 3 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={bounceTransition}
        style={{ boxShadow: glowMotion }}
        className="relative w-[85%] md:w-full max-w-[340px] md:max-w-md bg-white/95 backdrop-blur-md border-2 border-[#D4AF37]/50 p-5 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(139,30,65,0.15)]"
      >
        <CornerOrnaments />
        <div className="absolute -top-5 -right-3 md:-top-6 md:-right-6 bg-gradient-to-b from-[#8B1E41] to-[#5A1028] text-[#FBF7F0] px-4 py-3 rounded-full shadow-lg rotate-12 z-20 border-2 border-[#D4AF37] font-[family-name:var(--font-cinzel)] text-xs uppercase font-bold">
          Bride!
        </div>

        <div className="w-full h-72 md:h-[22rem] bg-gradient-to-b from-[#FDF4F6] to-[#F7E6EB] rounded-2xl mb-4 overflow-hidden flex items-end justify-center relative">
          <div className="w-[200px] h-[260px] md:w-[280px] md:h-[340px] rounded-t-full overflow-hidden relative border-4 border-white shadow-2xl">
            <Image
              src={wedding.bride.image}
              alt={wedding.bride.name}
              fill
              priority
              sizes="(max-width: 768px) 200px, 280px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 rounded-t-full border-4 border-[#D4AF37]/40 pointer-events-none" />
          </div>
        </div>

        <FadeIn delay={0.2}>
          <h2 className="font-[family-name:var(--font-great-vibes)] text-6xl text-[#8B1E41] text-center mb-1 drop-shadow">
            {wedding.bride.name}
          </h2>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="font-[family-name:var(--font-cormorant)] text-center text-gray-600 italic text-sm md:text-base mb-4 font-semibold">
            {wedding.bride.parents}
          </p>
        </FadeIn>

        {wedding.bride.traits && (
          <div className="space-y-2 text-center font-[family-name:var(--font-cormorant)] italic text-lg font-semibold text-[#8B1E41]/90">
            {wedding.bride.traits.map((trait, idx) => (
              <FadeIn
                key={idx}
                delay={0.4 + idx * 0.1}
                className="bg-[#FBF7F0] border border-[#D4AF37]/40 py-1 rounded-lg shadow-sm"
              >
                {trait}
              </FadeIn>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );

  const renderGroomCard = (glowMotion: any, isFirst: boolean) => (
    <section
      key="groom-section"
      className={`min-h-screen flex items-center justify-center ${
        isFirst ? "md:justify-start" : "md:justify-end"
      } px-4 md:px-24 relative z-30 w-full max-w-7xl mx-auto`}
    >
      <motion.div
        initial={{
          x: isDesktop ? (isFirst ? 300 : -300) : -50,
          opacity: 0,
          rotate: isDesktop ? (isFirst ? 15 : -15) : -5,
        }}
        whileInView={{ x: 0, opacity: 1, rotate: isFirst ? -3 : 3 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={bounceTransition}
        style={{ boxShadow: glowMotion }}
        className="relative w-[85%] md:w-full max-w-[340px] md:max-w-md bg-white/95 backdrop-blur-md border-2 border-[#D4AF37]/50 p-5 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(139,30,65,0.15)]"
      >
        <CornerOrnaments />
        <div className="absolute -top-5 -left-3 md:-top-6 md:-left-6 bg-gradient-to-b from-[#8B1E41] to-[#5A1028] text-[#FBF7F0] px-4 py-3 rounded-full shadow-lg -rotate-12 z-20 border-2 border-[#D4AF37] font-[family-name:var(--font-cinzel)] text-xs uppercase font-bold">
          Groom!
        </div>

        <div className="w-full h-72 md:h-[22rem] bg-gradient-to-b from-[#F4F7F4] to-[#E6F0E8] rounded-2xl mb-4 overflow-hidden flex items-end justify-center relative">
          <div className="w-[200px] h-[260px] md:w-[280px] md:h-[340px] rounded-t-full overflow-hidden relative border-4 border-white shadow-2xl">
            <Image
              src={wedding.groom.image}
              alt={wedding.groom.name}
              fill
              priority
              sizes="(max-width: 768px) 200px, 280px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 rounded-t-full border-4 border-[#D4AF37]/40 pointer-events-none" />
          </div>
        </div>

        <FadeIn delay={0.2}>
          <h2 className="font-[family-name:var(--font-great-vibes)] text-6xl text-[#8B1E41] text-center mb-1 drop-shadow">
            {wedding.groom.name}
          </h2>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="font-[family-name:var(--font-cormorant)] text-center text-gray-600 italic text-sm md:text-base mb-4 font-semibold">
            {wedding.groom.parents}
          </p>
        </FadeIn>

        {wedding.groom.traits && (
          <div className="space-y-2 text-center font-[family-name:var(--font-cormorant)] italic text-lg font-semibold text-[#8B1E41]/90">
            {wedding.groom.traits.map((trait, idx) => (
              <FadeIn
                key={idx}
                delay={0.4 + idx * 0.1}
                className="bg-[#FBF7F0] border border-[#D4AF37]/40 py-1 rounded-lg shadow-sm"
              >
                {trait}
              </FadeIn>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );

  return (
    <main
      ref={containerRef}
      className="bg-[#FBF7F0] text-[#2a0410] relative overflow-x-hidden min-h-screen selection:bg-[#8B1E41] selection:text-[#FBF7F0]"
      onMouseMove={handleMouseMove}
    >
      {/* Background layers */}
      <FloatingLotus />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* Fixed border with gold corner flourishes */}
      <div className="fixed inset-4 md:inset-6 border-2 border-[#D4AF37]/50 rounded-lg pointer-events-none z-10 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
        <CornerOrnaments />
      </div>
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background: spotlight }} />

      {/* Floating Animated Pointer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={startEntrance ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          top: arrowTop,
          left: arrowLeft,
          scale: arrowScale,
          x: "-50%",
          y: "-50%",
        }}
        className="fixed z-50 pointer-events-none will-change-transform"
      >
        <motion.div
          style={{ opacity: arrowOpacity }}
          animate={{ scaleY: [1, 1.1, 0.9, 1], scaleX: [1, 0.95, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-[#8B1E41] to-[#4A1023] rounded-full shadow-[0_20px_40px_rgba(139,30,65,0.4)] border-2 border-[#D4AF37]"
        >
          <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Hero Welcome */}
      <section className="min-h-[100dvh] flex flex-col items-center justify-center p-8 relative z-30 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
          animate={startEntrance ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative mb-6">
            <div className="absolute -inset-4 border-2 border-[#D4AF37]/40 rounded-t-full rounded-b-none" />
            <div className="absolute -inset-2 border border-[#D4AF37]/30 rounded-t-full rounded-b-none" />
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
              <WordFade
                delay={0.6}
                text="Shree Ganeshay Namah"
                className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] tracking-[0.3em] uppercase text-xs md:text-sm relative z-10"
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <WordFade
            delay={1.0}
            text="Get ready to"
            className="font-[family-name:var(--font-cinzel)] font-bold text-lg md:text-2xl uppercase tracking-[0.4em] text-[#B8860B]"
          />
          <FadeIn delay={1.4}>
            <h1 className="font-[family-name:var(--font-cinzel)] text-5xl md:text-8xl font-bold text-[#8B1E41] leading-tight drop-shadow-lg">
              MEET THE <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#8B1E41]">
                COUPLE
              </span>
            </h1>
          </FadeIn>
        </div>
      </section>

      <OrnateDivider />

      <Suspense fallback={null}>
        <PersonalNote />
      </Suspense>

      {/* Couple Profiles rendered dynamically based on host display priority */}
      {isGroomFirst ? (
        <>
          {renderGroomCard(firstCardGlow, true)}
          {renderBrideCard(secondCardGlow, false)}
        </>
      ) : (
        <>
          {renderBrideCard(firstCardGlow, true)}
          {renderGroomCard(secondCardGlow, false)}
        </>
      )}

      {/* Monogram Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center relative z-30 p-4">
        <div
          className="absolute w-96 h-96 md:w-[600px] md:h-[600px] rounded-full border-2 border-[#D4AF37]/20 animate-spin-slow pointer-events-none"
          style={{ animationDuration: "60s" }}
        />
        <div className="absolute w-72 h-72 md:w-[450px] md:h-[450px] rounded-full border border-[#D4AF37]/30 pointer-events-none" />
        <div className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full border-2 border-[#D4AF37]/20 pointer-events-none" />

        <div className="flex items-center justify-center gap-4 mb-10 relative z-10">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-[#D4AF37] relative">
            <div className="absolute inset-1 rounded-full border border-[#D4AF37]/50" />
            <span className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl text-[#8B1E41]">
              {isGroomFirst
                ? wedding.groom.name.charAt(0)
                : wedding.bride.name.charAt(0)}
            </span>
          </div>
          <Heart className="w-10 h-10 md:w-14 md:h-14 text-[#8B1E41] fill-[#8B1E41] animate-pulse" />
          <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-[#D4AF37] relative">
            <div className="absolute inset-1 rounded-full border border-[#D4AF37]/50" />
            <span className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl text-[#8B1E41]">
              {isGroomFirst
                ? wedding.bride.name.charAt(0)
                : wedding.groom.name.charAt(0)}
            </span>
          </div>
        </div>

        {wedding.couple.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[26rem] rounded-t-[140px] rounded-b-2xl overflow-hidden border-4 border-[#D4AF37]/60 shadow-2xl mb-12"
          >
            <Image
              src={wedding.couple.image}
              alt="The Couple"
              fill
              sizes="(max-width: 768px) 250px, 320px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute inset-2 rounded-t-[130px] rounded-b-xl border border-white/60 pointer-events-none" />
          </motion.div>
        )}

        <div className="text-center bg-white/90 backdrop-blur-md p-8 md:p-14 rounded-3xl shadow-2xl border-2 border-[#D4AF37]/40 max-w-2xl relative z-10">
          <CornerOrnaments />
          <WordFade
            delay={0.3}
            text={
              wedding.couple.quote ||
              "Different hearts. Different worlds. One beautiful destiny."
            }
            className="font-[family-name:var(--font-great-vibes)] text-4xl md:text-5xl text-[#8B1E41] leading-relaxed"
          />
        </div>
      </section>

      <OrnateDivider />

      {/* Main Wedding Celebration Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center relative z-30 p-4">
        <div className="text-center bg-white/90 backdrop-blur-md p-8 md:p-14 rounded-3xl shadow-2xl border-2 border-[#D4AF37]/40 max-w-2xl w-full relative">
          <CornerOrnaments />
          <h3 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#8B1E41] mb-8 border-b-2 border-[#D4AF37]/40 pb-4 uppercase tracking-wider">
            The Wedding Ceremony
          </h3>
          <div className="space-y-6 text-gray-800 font-[family-name:var(--font-cormorant)]">
            <div className="flex items-center justify-center gap-3">
              <CalendarHeart className="w-8 h-8 text-[#D4AF37]" />
              <p className="text-2xl font-semibold">{wedding.event.dateText}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-8 h-8 text-[#D4AF37]" />
              <p className="text-xl">{wedding.event.timeText}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-8 h-8 text-[#D4AF37]" />
              <p className="text-xl max-w-sm">
                {wedding.event.venueTitle}, {wedding.event.venueAddress}
              </p>
            </div>
          </div>
          <a
            href={wedding.event.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 px-8 py-3 bg-gradient-to-r from-[#8B1E41] to-[#6A1730] text-[#FBF7F0] rounded-full font-[family-name:var(--font-cinzel)] font-bold text-xs uppercase tracking-widest hover:from-[#6A1730] hover:to-[#4A0F20] transition-all shadow-lg border border-[#D4AF37]/50"
          >
            <MapPin className="w-5 h-5" /> Open in Google Maps
          </a>
        </div>
      </section>

      {/* Multi-Function Rituals & Celebrations Schedule */}
      {wedding.functions && wedding.functions.length > 0 && (
        <>
          <OrnateDivider />

          <section className="min-h-[70vh] flex flex-col items-center justify-center relative z-30 p-4 md:p-8 max-w-6xl mx-auto w-full">
            <div className="text-center mb-12 space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#8B1E41]/10 border border-[#8B1E41]/30 rounded-full text-[#8B1E41] text-xs font-bold font-[family-name:var(--font-cinzel)] uppercase">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Ceremonies & Itinerary
              </div>
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold text-[#8B1E41]">
                Wedding Rituals
              </h2>
              <p className="font-[family-name:var(--font-cormorant)] italic text-lg md:text-xl text-gray-600">
                Join us in commemorating every auspicious milestone and blessing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {wedding.functions.map((fn, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl flex flex-col justify-between relative group hover:border-[#8B1E41] transition-all"
                >
                  <CornerOrnaments />

                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-3 mb-4">
                      <h4 className="font-[family-name:var(--font-cinzel)] font-bold text-lg text-[#8B1E41]">
                        {fn.title}
                      </h4>
                      <span className="w-7 h-7 rounded-full bg-[#8B1E41] text-[#D4AF37] text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm font-mono">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-3 text-gray-700 font-[family-name:var(--font-cormorant)] text-base">
                      <div className="flex items-start gap-2.5">
                        <CalendarHeart className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-gray-900">{fn.dateText}</span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span>{fn.timeText}</span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <div className="leading-snug">
                          <p className="font-bold text-gray-900">{fn.venueTitle}</p>
                          <p className="text-sm text-gray-600">{fn.venueAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {fn.googleMapsUrl && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <a
                        href={fn.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#8B1E41]/10 hover:bg-[#8B1E41] text-[#8B1E41] hover:text-[#FBF7F0] rounded-xl text-xs font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wider transition-all border border-[#8B1E41]/20 shadow-2xs"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      <Suspense fallback={null}>
        <FooterBlessings defaultFam={wedding.defaultFamilySignOff} />
      </Suspense>
    </main>
  );
}
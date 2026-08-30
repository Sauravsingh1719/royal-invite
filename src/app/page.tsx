"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Film, 
  Palette, 
  Link2, 
  Crown,
  Flower2,
  Gem
} from "lucide-react";
import { useRef } from "react";

// Floating decorative motif component
const FloatingMotif = ({ 
  delay = 0, 
  x, 
  y, 
  scale = 1, 
  duration = 20 
}: { 
  delay?: number; 
  x: string; 
  y: string; 
  scale?: number; 
  duration?: number;
}) => (
  <motion.div
    className="absolute pointer-events-none opacity-[0.08]"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -30, 0],
      rotate: [0, 180, 360],
      scale: [scale, scale * 1.1, scale],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path
        d="M60 0C60 33.1371 33.1371 60 0 60C33.1371 60 60 86.8629 60 120C60 86.8629 86.8629 60 120 60C86.8629 60 60 33.1371 60 0Z"
        fill="#D4AF37"
      />
      <circle cx="60" cy="60" r="20" fill="#8B1E41" />
    </svg>
  </motion.div>
);

// Mandala SVG Component
const MandalaDecoration = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={`${className} opacity-20`}
    fill="none"
  >
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "center" }}
    >
      {[...Array(8)].map((_, i) => (
        <g key={i} transform={`rotate(${i * 45} 100 100)`}>
          <path
            d="M100 20 Q120 60 100 100 Q80 60 100 20"
            fill="#D4AF37"
            opacity="0.6"
          />
          <circle cx="100" cy="30" r="5" fill="#8B1E41" />
        </g>
      ))}
      <circle cx="100" cy="100" r="25" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <circle cx="100" cy="100" r="15" fill="#8B1E41" opacity="0.8" />
    </motion.g>
  </svg>
);

// Animated counter/stat component
const AnimatedStat = ({ value, label }: { value: string; label: string }) => (
  <motion.div 
    className="text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] font-bold text-[#D4AF37]">
      {value}
    </div>
    <div className="text-xs uppercase tracking-widest text-[#8B1E41]/70 mt-1 font-semibold">
      {label}
    </div>
  </motion.div>
);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scaleSpring = useSpring(scale, springConfig);

  // Stagger container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#FDFBF7] text-[#2a0410] flex flex-col justify-between overflow-hidden relative selection:bg-[#8B1E41] selection:text-[#FDFBF7]"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingMotif x="5%" y="10%" delay={0} scale={0.8} duration={25} />
        <FloatingMotif x="85%" y="15%" delay={5} scale={1.2} duration={30} />
        <FloatingMotif x="10%" y="70%" delay={2} scale={0.6} duration={22} />
        <FloatingMotif x="80%" y="75%" delay={8} scale={1} duration={28} />
        <FloatingMotif x="50%" y="50%" delay={4} scale={1.5} duration={35} />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B1E41]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      {/* Decorative Top Border */}
      <motion.div 
        className="h-1.5 bg-gradient-to-r from-[#8B1E41] via-[#D4AF37] to-[#8B1E41] relative"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </motion.div>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 text-center space-y-16 relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          className="space-y-10 relative"
          style={{ y, opacity, scale: scaleSpring }}
        >
          {/* Center Mandala */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10 pointer-events-none">
            <MandalaDecoration className="w-full h-full" />
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex"
          >
            <div className="relative group cursor-default">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8B1E41] to-[#D4AF37] rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative inline-flex items-center gap-2 px-5 py-2 bg-[#FDFBF7] text-[#8B1E41] rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-[#D4AF37]/40 shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </motion.div>
                <span className="bg-gradient-to-r from-[#8B1E41] to-[#5C1027] bg-clip-text text-transparent">
                  Royal Digital Invitations
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h1 
              variants={itemVariants}
              className="font-[family-name:var(--font-cinzel)] text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] max-w-5xl mx-auto"
            >
              <span className="bg-gradient-to-br from-[#8B1E41] via-[#8B1E41] to-[#5C1027] bg-clip-text text-transparent">
                Craft Bespoke
              </span>
              <br />
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8960F] to-[#D4AF37] bg-clip-text text-transparent">
                  Wedding Stories
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1 }}
                >
                  <motion.path
                    d="M2 6C50 2 150 2 198 6"
                    stroke="#D4AF37"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                  />
                </motion.svg>
              </motion.span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="font-[family-name:var(--font-cormorant)] italic text-2xl md:text-3xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Generate personalized invitation links for every guest. 
              Choose from exquisite templates. No database. No complexity. 
              Just pure elegance.
            </motion.p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/builder" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8B1E41] via-[#D4AF37] to-[#8B1E41] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] rounded-full font-[family-name:var(--font-cinzel)] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Begin Your Journey</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.div>
            </Link>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-xs text-gray-400 uppercase tracking-widest font-medium flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Secure & Instant
            </motion.p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            className="flex justify-center gap-8 md:gap-16 pt-8 border-t border-[#D4AF37]/20 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <AnimatedStat value="50+" label="Royal Templates" />
            <div className="w-px bg-[#D4AF37]/30" />
            <AnimatedStat value="∞" label="Guest Links" />
            <div className="w-px bg-[#D4AF37]/30" />
            <AnimatedStat value="0" label="Database Hassle" />
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="flex items-center justify-center gap-4 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <Flower2 className="w-6 h-6 text-[#D4AF37]/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left relative">
          {/* Decorative connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -z-10" />

          {[
            {
              icon: <Palette className="w-8 h-8" />,
              title: "Curated Royal Templates",
              description: "Browse through a treasury of handcrafted templates inspired by Mughal, Rajput, and South Indian wedding aesthetics. Each design tells a story.",
              color: "from-[#8B1E41] to-[#5C1027]",
              borderColor: "border-[#8B1E41]/20",
              iconBg: "bg-[#8B1E41]/10",
            },
            {
              icon: <Link2 className="w-8 h-8" />,
              title: "Personalized Guest Links",
              description: "Generate unique invitation URLs for every guest via smart Base64 encoding. Each recipient sees their name, custom message, and RSVP — no backend required.",
              color: "from-[#D4AF37] to-[#B8960F]",
              borderColor: "border-[#D4AF37]/30",
              iconBg: "bg-[#D4AF37]/10",
            },
            {
              icon: <Crown className="w-8 h-8" />,
              title: "Zero-Config Deployment",
              description: "Build, customize, and publish in minutes. Static generation means lightning-fast loads, infinite scalability, and zero database maintenance costs.",
              color: "from-[#8B1E41] to-[#5C1027]",
              borderColor: "border-[#8B1E41]/20",
              iconBg: "bg-[#8B1E41]/10",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative bg-white p-8 rounded-3xl border ${feature.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500`} />
              
              <div className="relative z-10 space-y-4">
                <motion.div 
                  className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-[#8B1E41] group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-xl text-[#8B1E41] group-hover:text-[#5C1027] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <motion.div 
                  className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest pt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                >
                  <Gem className="w-3.5 h-3.5" />
                  <span>Explore Feature</span>
                </motion.div>
              </div>

              {/* Corner decoration */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-2xl group-hover:from-[#D4AF37]/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.div 
          className="relative py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#8B1E41]/[0.02] to-transparent rounded-3xl -z-10" />
          
          <motion.h2 
            className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold text-[#8B1E41] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Three Steps to <span className="text-[#D4AF37]">Elegance</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37]/60 to-[#D4AF37]/30" />

            {[
              { step: "01", title: "Choose Your Template", desc: "Select from royal, modern, or traditional designs" },
              { step: "02", title: "Add Guest Details", desc: "Upload names and personal messages in bulk" },
              { step: "03", title: "Share Magic Links", desc: "Distribute unique, encrypted invitation URLs" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="relative flex flex-col items-center text-center space-y-4"
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] border-2 border-[#D4AF37]/40 flex items-center justify-center shadow-xl relative z-10"
                  whileHover={{ scale: 1.1, borderColor: "rgba(212, 175, 55, 0.8)" }}
                >
                  <span className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#8B1E41]">
                    {item.step}
                  </span>
                </motion.div>
                <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-lg text-[#2a0410]">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B1E41] to-[#5C1027] p-10 md:p-16 text-center shadow-2xl"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" 
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          
          <div className="relative z-10 space-y-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto" />
            </motion.div>
            
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold text-[#FDFBF7]">
              Begin Your Digital <br className="hidden md:block" />
              <span className="text-[#D4AF37]">Royal Celebration</span>
            </h2>
            
            <p className="text-[#FDFBF7]/80 max-w-lg mx-auto text-lg font-[family-name:var(--font-cormorant)] italic">
              Join hundreds of couples who chose elegance without complexity.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link
                href="/builder"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#FDFBF7] text-[#8B1E41] rounded-full font-[family-name:var(--font-cinzel)] font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-shadow"
              >
                Create Your Invite
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>

    </div>
  );
}
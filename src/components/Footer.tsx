import Image from "next/image";
import Link from "next/link";
import { Crown, Heart, Sparkles, Flower2, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-30 bg-[#16030c] text-[#FDFBF7] border-t border-[#D4AF37]/30 pt-16 pb-12 overflow-hidden">
      {/* Background Texture & Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#8B1E41]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* ─── LEFT: Prominent Large Logo & Brand Description ─── */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            
            {/* Large Luxury Logo with Royal Gold Ring */}
            <div className="relative group shrink-0">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#FDFBF7] to-[#8B1E41] shadow-[0_0_25px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-shadow duration-500">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#16030c] bg-[#16030c]">
                  <Image
                    src="/logo.png"
                    alt="RoyalInvites Logo"
                    fill
                    sizes="(max-width: 768px) 112px, 128px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              {/* Subtle Crown Badge */}
              <div className="absolute -bottom-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:-right-1 bg-[#8B1E41] border border-[#D4AF37] rounded-full p-1.5 shadow-md">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
            </div>

            {/* Brand Story */}
            <div className="space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-[family-name:var(--font-cinzel)] font-bold text-2xl tracking-wider text-[#FDFBF7]">
                  RoyalInvites
                </span>
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              </div>

              <p className="font-[family-name:var(--font-cormorant)] italic text-lg text-gray-300 max-w-sm leading-relaxed">
                Transforming traditional wedding announcements into bespoke, interactive digital experiences for your loved ones.
              </p>

              <p className="font-[family-name:var(--font-cinzel)] text-xs text-[#D4AF37]/80 tracking-[0.2em] uppercase font-semibold">
                || Shubh Vivah ||
              </p>
            </div>
          </div>

          {/* ─── RIGHT: Quick Links & Portfolio ─── */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 text-center sm:text-left">
            
            {/* Navigation */}
            <div>
              <p className="font-[family-name:var(--font-cinzel)] text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
                Platform
              </p>
              <ul className="space-y-2.5 text-sm font-[family-name:var(--font-cinzel)] text-gray-400">
                <li>
                  <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#D4AF37] transition-colors">
                    Admin Portal
                  </Link>
                </li>
                <li>
                  <Link href="#designs" className="hover:text-[#D4AF37] transition-colors">
                    Themes &amp; Layouts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <p className="font-[family-name:var(--font-cinzel)] text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
                Experience
              </p>
              <ul className="space-y-2.5 text-sm font-[family-name:var(--font-cinzel)] text-gray-400">
                <li>3D Cameo Cards</li>
                <li>Personalized URLs</li>
                <li>Instant Directions</li>
                <li>RSVP &amp; Blessings</li>
              </ul>
            </div>

            {/* Creator Attribution */}
            <div className="col-span-2 sm:col-span-1">
              <p className="font-[family-name:var(--font-cinzel)] text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
                Developer
              </p>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Crafted with love &amp; precision by
              </p>
              <a
                href="https://saurav190.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8B1E41]/30 border border-[#D4AF37]/40 text-xs text-[#D4AF37] hover:bg-[#8B1E41] hover:text-[#FDFBF7] transition-all group font-[family-name:var(--font-cinzel)] font-bold tracking-wider"
              >
                <span>Saurav Singh</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

          </div>
        </div>

        {/* ─── Bottom Divider & Copyright ─── */}
        <div className="mt-14 pt-8 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-[family-name:var(--font-cinzel)] tracking-widest">
            <Flower2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>&copy; {new Date().getFullYear()} RoyalInvites. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-[family-name:var(--font-cormorant)] italic">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#8B1E41] fill-[#8B1E41]" />
            <span>for timeless celebrations</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
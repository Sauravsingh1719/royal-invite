"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Shield,
  Layers,
  Home,
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSaaSRoute =
  pathname === "/" ||
  pathname.startsWith("/templates") ||
  pathname.startsWith("/admin") ||
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/builder") ||
  pathname.startsWith("/signin") ||
  pathname.startsWith("/signup");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  if (!isSaaSRoute) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isAdmin = (session?.user as any)?.role === "admin";

 const navItems = [
  { label: "Overview", href: "/", icon: Home },
  { label: "Templates", href: "/templates", icon: Layers },
  ...(session
    ? [
        ...(isAdmin ? [{ label: "Admin Panel", href: "/admin", icon: Shield, highlight: true }] : []),
        { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
        { label: "New Invite", href: "/builder", icon: PlusCircle },
      ]
    : [
        { label: "Create Invite", href: "/builder", icon: PlusCircle },
      ]),
];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FDFBF7]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(139,30,65,0.06)] border-b border-[#D4AF37]/30 py-3"
          : "bg-[#FDFBF7]/80 backdrop-blur-sm border-b border-[#D4AF37]/20 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-15 h-15 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Royal Wedding Invites Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-cinzel)] font-bold text-xl text-[#8B1E41] tracking-widest leading-none">
              RoyalInvites
            </span>
            <span className="text-[9px] font-[family-name:var(--font-cinzel)] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-1">
              Cinematic SaaS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/80 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "text-[#FDFBF7]"
                    : item.highlight
                    ? "text-[#8B1E41] font-bold bg-amber-50/80 hover:bg-amber-100"
                    : "text-gray-700 hover:text-[#8B1E41] hover:bg-[#8B1E41]/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D4AF37]" : item.highlight ? "text-[#8B1E41]" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Profile / Auth State */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full border-2 border-[#8B1E41] border-t-transparent animate-spin" />
          ) : session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white border border-[#D4AF37]/40 shadow-sm hover:border-[#8B1E41] hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B1E41] to-[#5C1027] text-[#D4AF37] font-bold text-xs flex items-center justify-center border border-[#D4AF37]/40">
                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-gray-900 leading-tight">
                    {session.user.name || "Creator"}
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-[110px] truncate font-mono">
                    {session.user.email}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180 text-[#8B1E41]" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#D4AF37]/30 p-2 z-50 divide-y divide-gray-100"
                  >
                    <div className="px-3 py-2.5">
                      <p className="text-xs font-bold text-gray-900">{session.user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5 font-mono">{session.user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-amber-50 text-[#8B1E41] rounded text-[10px] font-bold border border-[#D4AF37]/40 uppercase tracking-wider">
                          <Shield className="w-3 h-3" /> Admin Profile
                        </span>
                      )}
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#8B1E41] bg-amber-50/70 hover:bg-amber-100 rounded-xl transition-colors border border-[#D4AF37]/30"
                        >
                          <Shield className="w-4 h-4 text-[#8B1E41]" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-[#8B1E41] hover:bg-[#8B1E41]/5 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                        <span>Command Center</span>
                      </Link>
                      <Link
                        href="/builder"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-[#8B1E41] hover:bg-[#8B1E41]/5 rounded-xl transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                        <span>Create New Wedding</span>
                      </Link>
                    </div>

                    <div className="pt-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-xs font-[family-name:var(--font-cinzel)] font-bold uppercase tracking-wider text-gray-700 hover:text-[#8B1E41] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] rounded-full text-xs font-[family-name:var(--font-cinzel)] font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {session?.user && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B1E41] to-[#5C1027] text-[#D4AF37] text-xs font-bold flex items-center justify-center border border-[#D4AF37]/40 shadow-sm">
              {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-white border border-[#D4AF37]/30 text-[#8B1E41] shadow-sm hover:bg-[#8B1E41]/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FDFBF7] border-b border-[#D4AF37]/30 shadow-xl overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {session?.user && (
                <div className="p-3.5 bg-white rounded-2xl border border-[#D4AF37]/30 shadow-sm">
                  <p className="text-xs font-bold text-gray-900">{session.user.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-mono">{session.user.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-amber-50 text-[#8B1E41] rounded text-[9px] font-bold border border-[#D4AF37]/40 uppercase">
                      Admin Profile
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-wider font-bold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-[#FDFBF7] shadow-sm"
                          : item.highlight
                          ? "bg-amber-50 text-[#8B1E41] border border-[#D4AF37]/30 font-bold"
                          : "text-gray-700 hover:bg-white hover:text-[#8B1E41]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-[#D4AF37]"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                {session?.user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="w-full py-3 text-center text-xs font-[family-name:var(--font-cinzel)] font-bold uppercase tracking-wider text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full py-3 text-center bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white rounded-xl text-xs font-[family-name:var(--font-cinzel)] font-bold uppercase tracking-wider shadow-md"
                    >
                      Create Free Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const wasRegistered = searchParams.get("registered") === "true";

  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Auto-forward logged-in users with a clean window redirect to prevent client loops
  useEffect(() => {
    if (status === "authenticated") {
      const isAdmin = (session?.user as any)?.role === "admin";
      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else if (isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    }
  }, [status, session, callbackUrl]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const activeSession = await getSession();
      const isAdmin = (activeSession?.user as any)?.role === "admin";

      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else if (isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Authentication failed. Please check your connection and try again.");
      setLoading(false);
    }
  };

  // If already logged in, show spinner while forwarding
  if (status === "authenticated" || status === "loading") {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-12 border border-[#D4AF37]/30 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#8B1E41] animate-spin mx-auto" />
        <p className="text-xs font-bold uppercase tracking-wider font-[family-name:var(--font-cinzel)] text-[#8B1E41]">
          {status === "authenticated" ? "Entering Royal Portal..." : "Verifying session..."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-[#D4AF37]/30">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#8B1E41] to-[#4A1023] rounded-2xl mb-3 shadow-md border border-[#D4AF37]/40">
          <Lock className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-cinzel)]">
          Creator Sign In
        </h1>
        <p className="text-gray-600 mt-1 text-xs">
          Sign in to manage your wedding invitations
        </p>
      </div>

      {wasRegistered && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs text-emerald-800 font-bold">
            Account verified! Enter your credentials to sign in.
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-red-700 font-bold">{error}</div>
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSignInSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-bold uppercase text-gray-900 mb-1.5 font-[family-name:var(--font-cinzel)]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
              required
              disabled={loading}
              placeholder="yourname@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-900 mb-1.5 font-[family-name:var(--font-cinzel)]">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
              required
              disabled={loading}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md disabled:opacity-50 text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
        >
          {loading ? "Signing in..." : "Sign In"}
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </motion.form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-2">
        <p className="text-xs text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#8B1E41] font-bold hover:underline">
            Sign Up
          </Link>
        </p>
        <div>
          <Link href="/" className="text-[11px] text-gray-400 hover:text-gray-600">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 py-12">
      <Suspense
        fallback={
          <div className="w-8 h-8 border-4 border-[#8B1E41] border-t-transparent rounded-full animate-spin" />
        }
      >
        <SignInContent />
      </Suspense>
    </div>
  );
}
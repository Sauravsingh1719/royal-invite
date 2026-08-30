"use client";

import React, { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, AlertCircle, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const wasRegistered = searchParams.get("registered") === "true";

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      setStep(2);
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        otp: otp.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Check role dynamically to route admins to /admin and creators to /dashboard
      const session = await getSession();
      const isAdmin = (session?.user as any)?.role === "admin";

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-[#D4AF37]/30">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#8B1E41] to-[#4A1023] rounded-2xl mb-3 shadow-md border border-[#D4AF37]/40">
          {step === 1 ? (
            <Lock className="h-6 w-6 text-[#D4AF37]" />
          ) : (
            <KeyRound className="h-6 w-6 text-[#D4AF37]" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-cinzel)]">
          {step === 1 ? "Creator Sign In" : "Two-Factor Auth"}
        </h1>
        <p className="text-gray-600 mt-1 text-xs">
          {step === 1 ? "Sign in to manage your wedding invitations" : `Enter the 6-digit code sent to ${email}`}
        </p>
      </div>

      {wasRegistered && step === 1 && (
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

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleCredentialsSubmit}
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
              className="w-full bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md disabled:opacity-50 text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-wider mt-2"
            >
              {loading ? "Verifying..." : "Continue to Verification"}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleOtpSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase text-gray-900 mb-1.5 font-[family-name:var(--font-cinzel)]">
                One-Time Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none tracking-widest text-lg text-center font-mono font-bold text-black bg-white"
                  required
                  disabled={loading}
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-md disabled:opacity-50 text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-wider"
            >
              {loading ? "Logging in..." : "Verify & Enter Dashboard"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 pt-2"
            >
              <ArrowLeft size={14} /> Back to Credentials
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-2">
        <p className="text-xs text-gray-600">
          Don't have an account?{" "}
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
      <Suspense fallback={<div className="w-8 h-8 border-4 border-[#8B1E41] border-t-transparent rounded-full animate-spin" />}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
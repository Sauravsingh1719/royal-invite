"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1: Submit Credentials & Send OTP
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to initiate registration");
        setLoading(false);
        return;
      }

      setStep(2);
      setLoading(false);
    } catch {
      setError("A network error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Automatically Sign In & Route to Dashboard
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP code");
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Auto login using credentials
      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Fallback to signin if session establishment has an issue
        window.location.href = "/signin?registered=true";
        return;
      }

      // Direct entry to Dashboard
      window.location.href = "/dashboard";
    } catch {
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-[#D4AF37]/30"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#8B1E41] to-[#4A1023] rounded-2xl mb-3 shadow-md border border-[#D4AF37]/40">
            {step === 1 ? (
              <Sparkles className="h-6 w-6 text-[#D4AF37]" />
            ) : (
              <KeyRound className="h-6 w-6 text-[#D4AF37]" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-cinzel)]">
            {step === 1 ? "Join RoyalInvites" : "Verify Your Email"}
          </h1>

          <p className="text-gray-600 mt-1 text-xs font-medium">
            {step === 1
              ? "Create your account to start building cinematic wedding experiences"
              : `Enter the 6-digit verification code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-700 font-bold">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs text-emerald-800 font-bold">
              Account verified! Entering your royal dashboard...
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="signup-step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-gray-900 mb-1.5 font-[family-name:var(--font-cinzel)]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Saurav Singh"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-900 mb-1.5 font-[family-name:var(--font-cinzel)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
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

              <div>
                <label className="block text-xs font-bold uppercase text-gray-900 mb-1.5 font-[family-name:var(--font-cinzel)]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none text-xs bg-white text-black font-semibold placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all font-[family-name:var(--font-cinzel)] uppercase tracking-wider text-xs disabled:opacity-50 mt-2"
              >
                {loading ? "Sending Verification Code..." : "Continue to Verification"}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup-step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              {/* Spam Folder Notice */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <Mail className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold">
                    Didn&apos;t receive the verification email?
                  </span>{" "}
                  Please check your{" "}
                  <span className="font-bold">Spam/Junk folder</span> as the email may
                  have been filtered there.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-900 mb-1.5 font-[family-name:var(--font-cinzel)]">
                  Enter 6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E41] outline-none tracking-widest text-lg text-center font-mono font-bold text-black bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 bg-gradient-to-r from-[#8B1E41] to-[#5C1027] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all font-[family-name:var(--font-cinzel)] uppercase tracking-wider text-xs disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? "Activating & Logging In..."
                  : "Verify & Enter Dashboard"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1.5 pt-2 font-medium"
              >
                <ArrowLeft size={14} /> Back to Details
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600 font-medium">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#8B1E41] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
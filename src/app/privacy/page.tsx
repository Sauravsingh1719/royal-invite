import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Image as ImageIcon,
  Database,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | RoyalInvites",
  description:
    "Learn how RoyalInvites protects your personal data, media, and wedding invitations.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E41] hover:underline uppercase tracking-wider font-[family-name:var(--font-cinzel)]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center space-y-3 pb-6 border-b border-[#D4AF37]/30">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#8B1E41] to-[#4A1023] rounded-2xl shadow-md border border-[#D4AF37]/40 mb-2">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl font-bold text-[#8B1E41]">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            Last Updated: August 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/30 shadow-sm space-y-8 text-sm leading-relaxed text-gray-700">
          
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8B1E41]" /> 1. Introduction
            </h2>
            <p>
              Welcome to <strong>RoyalInvites</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;platform&rdquo;). We respect your privacy and are committed to protecting the personal information and photos you share while creating digital wedding invitations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#8B1E41]" /> 2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Account Credentials:</strong> Name, email address, and encrypted passwords for authentication.</li>
              <li><strong>Invitation Details:</strong> Couple names, parent names, event schedules, ceremony titles, and venue addresses.</li>
              <li><strong>Media Assets:</strong> Photographs uploaded for the Bride, Groom, and Couple portraits.</li>
              <li><strong>Guest Metadata:</strong> Names, family suffixes, and personalized greetings you choose to generate in your dashboard.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#8B1E41]" /> 3. Media Processing & Cloud Storage
            </h2>
            <p>
              Uploaded photos are securely stored and processed through the standard secure <strong>Cloudinary</strong> cloud media management platform. These photos are used solely for the purpose of displaying and delivering your digital invitation pages with reliable performance and high-quality media delivery.
            </p>
            <p>
              RoyalInvites does not intentionally download, save separate copies of, distribute, sell, or misuse your uploaded photographs. Your media is handled only as necessary to provide the invitation services you request.
            </p>
            <p className="p-4 bg-amber-50 rounded-2xl border border-[#D4AF37]/40 text-xs text-amber-900">
              <strong>Your Deletion Rights:</strong> Whenever you replace a photo or delete an invitation from your dashboard, the corresponding image files are automatically and permanently purged from our cloud storage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8B1E41]" /> 4. Security & Data Protection
            </h2>
            <p>
              We implement industry-standard cryptographic practices:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Passwords are securely salted and hashed using <strong>bcrypt</strong> before storage.</li>
              <li>Sign-ups and logins require transactional One-Time Passwords (OTP) delivered to your verified email.</li>
              <li>We never sell, rent, or monetize your personal details or media to third parties.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-gray-900">
              5. Contact Us
            </h2>
            <p className="text-xs sm:text-sm">
              If you have any questions or data removal requests regarding this Privacy Policy, reach out to the developer at{" "}
              <a
                href="mailto:sauravs1719@gmail.com"
                className="text-[#8B1E41] font-bold underline"
              >
                sauravs1719@gmail.com
              </a>.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center pt-4 text-xs text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} RoyalInvites. All rights reserved.
        </div>

      </div>
    </div>
  );
}

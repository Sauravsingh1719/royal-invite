import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProivider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport settings for optimal mobile rendering and theme matching
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8B1E41",
};

// Comprehensive SEO & Open Graph Metadata
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"
  ),
  title: {
    default: "Royal Digital Wedding Invitations | Personalized E-Invites",
    template: "%s | Royal Wedding Invitations",
  },
  description:
    "Create luxury, interactive digital wedding invitations with personalized guest greetings, 3D animated cards, seamless event details, and RSVP tracking.",
  applicationName: "Royal Wedding Invitations",
  authors: [{ name: "Saurav Singh", url: "https://saurav190.vercel.app" }],
  generator: "Next.js",
  keywords: [
    "digital wedding invitation",
    "online wedding card",
    "interactive wedding invite",
    "luxury wedding invitation",
    "personalized e-invites",
    "Indian wedding digital card",
    "save the date e-invite",
    "wedding RSVP tracker",
  ],
  creator: "Saurav Singh",
  publisher: "Royal Wedding Invitations",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Royal Digital Wedding Invitations | Interactive E-Invites",
    description:
      "Craft bespoke, animated wedding invitations with dynamic guest notes, interactive 3D frames, and seamless event directions.",
    url: "/",
    siteName: "Royal Wedding Invitations",
    images: [
      {
        url: "/og-image.jpg", // Place an appealing 1200x630 preview image in your public folder
        width: 1200,
        height: 630,
        alt: "Luxury Digital Wedding Invitation Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Digital Wedding Invitations | Interactive E-Invites",
    description:
      "Craft bespoke, animated wedding invitations with dynamic guest notes, interactive 3D frames, and seamless event directions.",
    images: ["/og-image.jpg"],
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#2a0410]">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
# 👑 RoyalInvites — Cinematic Digital Wedding Invitations SaaS

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-purple?style=for-the-badge&logo=nextauth)](https://next-auth.js.org/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

**RoyalInvites** is a full-stack SaaS platform crafted for couples and event creators to design, customize, and share cinematic, royal digital wedding invitations. Featuring royal envelope unboxing animations, dynamic guest personalization, curated traditional wedding soundtracks, and modular extensible templates.

---

## ✨ Features

### 💌 1. Cinematic Guest Unboxing Experience
* **Interactive Envelope Opening:** Guests receive a personalized, wax-sealed royal envelope with smooth Framer Motion unfold transitions.
* **Synchronized Audio Auto-Play:** Ambient wedding music begins immediately upon unboxing the invitation.
* **Dynamic Guest Personalization:** Generates custom invite links with guest names dynamically rendered across the invitation (`/slug?guest=FamilyName`).

### 🎨 2. Dynamic Template Registry Architecture
* **Decoupled Design Engine:** Templates are registered via an isolated Registry Pattern (`registry.ts`), enabling new wedding themes (`DesignOne` to `DesignFour`) to be added without altering core platform logic.
* **Live Template Showcase:** Interactive `/templates` gallery enabling users to preview themes with sample data before building.

### 🎵 3. Royalty-Free Audio Engine
* **Curated Wedding Tracks:** Built-in traditional and classical presets (`Audio 1` through `Audio 5`).
* **In-Builder Live Audio Testing:** Play/Pause previews directly inside the invite builder before publishing.

### 🖼️ 4. Client-Side Image Auto-Compression
* **Zero Payload Crashes:** Utilizes client-side Web Workers (`browser-image-compression`) to resize 30MB+ camera/phone photos to 1080p/2K (~800KB) in milliseconds before upload.
* **Serverless Optimized:** Guarantees all uploads stay well within Vercel’s 4.5 MB serverless execution limits while retaining 100% retina clarity on Cloudinary.

### 🔐 5. Two-Step Email OTP Authentication & Moderation
* **Passwordless / 2FA Security:** Email OTP verification powered by Nodemailer for all registrations and sign-ins.
* **Creator Dashboard:** Real-time wedding invite management, guest RSVP metrics, and URL sharing.
* **Admin Control Center:** Dedicated administrative dashboard to manage creators, audit invites, and monitor platform health.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, Server Actions) |
| **Language** | TypeScript |
| **Styling & Animation** | Tailwind CSS, Framer Motion, Lucide React Icons |
| **Database** | MongoDB Atlas with Mongoose ORM |
| **Authentication** | NextAuth.js (JWT Strategy, Credentials Provider + OTP) |
| **Email Service** | Nodemailer (Custom HTML Royal Email Templates) |
| **Media Pipeline** | Cloudinary API + `browser-image-compression` |
| **Deployment** | Vercel (Edge Proxy / Middleware) |

---

## 📂 Project Structure

```plaintext
royalinvites/
├── public/
│   ├── audio/              # Preloaded wedding soundtracks (audio1.mp3 to audio5.mp3)
│   ├── logo.jpg            # Royal platform logo and tab favicon
│   ├── bride.jpg           # Default fallback assets
│   ├── groom.jpg
│   └── couple.jpg
├── src/
│   ├── actions/            # Next.js Server Actions (Cloudinary uploads)
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Sign In & Sign Up flows
│   │   ├── [slug]/         # Dynamic public wedding invitation routes
│   │   ├── admin/          # Admin moderation portal
│   │   ├── api/            # API endpoints (Auth, OTP, Weddings, Guests)
│   │   ├── builder/        # Interactive wedding creator studio
│   │   ├── dashboard/      # User management center
│   │   ├── templates/      # Template preview showcase
│   │   ├── layout.tsx      # Root layout & SEO metadata
│   │   └── page.tsx        # Landing page
│   ├── components/         # Reusable UI components (AudioSelector, ImageUploader, etc.)
│   ├── lib/                # Database connection, email templates, Nodemailer client
│   ├── models/             # Mongoose schemas (User, Wedding, Guest)
│   ├── templates/          # Extensible template engine & registry
│   │   ├── designs/        # Custom template designs (DesignOne to DesignFour)
│   │   └── registry.ts     # Central Template Registry
│   └── proxy.ts            # Edge gateway & route protection (Middleware)
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
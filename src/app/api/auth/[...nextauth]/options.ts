import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password || !credentials?.otp) {
          throw new Error("Missing email, password, or verification code");
        }

        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });
        if (!user) throw new Error("Account not found");

        if (user.isVerified === false) {
          throw new Error("Please complete email verification before signing in");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error("Invalid password");

        if (!user.otpToken || !user.otpExpires) {
          throw new Error("Verification code not requested");
        }

        if (new Date() > user.otpExpires) {
          throw new Error("Verification code has expired");
        }

        const isOtpValid = await bcrypt.compare(credentials.otp, user.otpToken);
        if (!isOtpValid) {
          throw new Error("Invalid verification code");
        }

        user.otpToken = undefined;
        user.otpExpires = undefined;
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
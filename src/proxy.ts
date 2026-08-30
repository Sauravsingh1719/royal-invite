import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isUserProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/builder") ||
    pathname.startsWith("/api/weddings");
  const isAuthRoute = pathname.startsWith("/signin") || pathname.startsWith("/signup");

  // 1. Strict protection for Admin Portal & Admin APIs
  if (isAdminRoute) {
    if (!token) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Standard user-protected routes
  if (isUserProtectedRoute && !token) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Logged-in users visiting /signin or /signup are auto-routed by role
  if (isAuthRoute && token) {
    const destination = token.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/builder/:path*",
    "/signin",
    "/signup",
    "/api/weddings/:path*",
  ],
};
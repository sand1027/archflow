import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/error",
  "/api/auth",
  "/api/workflows/share", // Only allow share validation API
];

const protectedRoutes = [
  "/workflow/shared", // Shared workflows require auth but should be accessible
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }
    
    // For protected routes like shared workflows, redirect with callback URL
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!req.nextauth.token) {
        const callbackUrl = encodeURIComponent(req.url);
        return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url));
      }
    }
    
    // Redirect to signin if not authenticated
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Allow public routes without authentication
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        // Protected routes require authentication
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          return !!token;
        }
        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

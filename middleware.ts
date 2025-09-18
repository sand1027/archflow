import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/error",
  "/api/auth",
  "/api/workflows",
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
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
        return publicRoutes.some(route => pathname.startsWith(route)) || !!token;
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

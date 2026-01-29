import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protected routes that require authentication
 */
const protectedRoutes = ["/dashboard", "/chat", "/habits", "/pods", "/profile", "/onboarding"];

/**
 * Public routes that don't require authentication
 * Note: This array is kept for documentation/future use
 */
const _publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/verify-email",
  "/reset-password",
  "/forgot-password",
  "/auth/callback",
];

/**
 * Check if a path matches any of the given routes
 */
function matchesRoute(path: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route === "/") {
      return path === "/";
    }
    return path === route || path.startsWith(`${route}/`);
  });
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // If accessing a protected route without authentication
  if (matchesRoute(pathname, protectedRoutes) && !user) {
    const redirectUrl = new URL("/login", request.url);
    // Store the intended destination for post-login redirect
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (
    user &&
    (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

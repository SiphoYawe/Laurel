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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, allow access to public routes only
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    const { pathname } = request.nextUrl;
    // Allow all non-protected routes when Supabase is not configured
    if (matchesRoute(pathname, protectedRoutes)) {
      // Redirect to login with a message
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("error", "supabase_not_configured");
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  });

  // Get the current session
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // If auth fails, treat as unauthenticated
    user = null;
  }

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

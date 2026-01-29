import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Handle different callback types
      if (type === "recovery") {
        // Password recovery - redirect to reset password page
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      // Default: redirect to onboarding or specified next page
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error - redirect to error page or signup
  return NextResponse.redirect(`${origin}/signup?error=auth_callback_error`);
}

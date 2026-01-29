# Pending User Input

This file tracks items that require human intervention, external service setup, or configuration decisions.

## Story 1-2: Configure Supabase Database and Authentication

### ✅ DONE: Supabase Project Setup

**Status:** COMPLETE - Credentials configured in .env

**Completed:**

- [x] Supabase project created at https://wzacqqvpzhllepxhqkyb.supabase.co
- [x] NEXT_PUBLIC_SUPABASE_URL configured
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY configured
- [x] EXPO_PUBLIC_SUPABASE_URL/KEY configured
- [x] Supabase MCP server added to Claude Code

**Still Needed:**

- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Get from Project Settings > API > service_role (keep secret!)
- [ ] `DATABASE_URL` - Get database password from Project Settings > Database

**After Getting Database Password:**

1. Run the migrations in `packages/db/src/migrations/` via Supabase SQL Editor
2. Verify RLS policies are applied correctly
3. Test authentication flow

### Required: Run Migrations

**Status:** PENDING - Need database password

Run these SQL files in Supabase SQL Editor (in order):

1. `packages/db/src/migrations/0000_create_profiles.sql`
2. `packages/db/src/migrations/0001_create_user_preferences.sql`
3. `packages/db/src/migrations/0002_rls_policies.sql`
4. `packages/db/src/migrations/0003_profile_trigger.sql`

### Optional: OAuth Provider Setup

**For Social Login:**

- Google OAuth: Configure in Supabase Dashboard > Authentication > Providers
- Apple OAuth: Requires Apple Developer account
- GitHub OAuth: Configure with GitHub OAuth App credentials

---

## How to Use This File

When you've completed a setup item:

1. Add a checkmark or "DONE" status
2. Note any relevant configuration details
3. Remove from "BLOCKING" if applicable

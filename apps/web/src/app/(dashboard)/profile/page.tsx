"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut } from "@/lib/supabase/auth";
import { useAuth } from "@/lib/supabase/auth-context";

/**
 * Profile Page
 * User profile and settings
 * Full implementation expanded in later stories
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <User className="text-laurel-forest h-5 w-5" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="border-border bg-card rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <div className="bg-laurel-sage/20 flex h-16 w-16 items-center justify-center rounded-full">
            <User className="text-laurel-sage h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-foreground font-semibold">{user?.email || "User"}</h2>
            <p className="text-muted-foreground text-sm">
              Joined{" "}
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "recently"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Placeholder */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-4 text-center">
          <div className="text-laurel-forest text-2xl font-bold">0</div>
          <p className="text-muted-foreground text-sm">Total Habits</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-4 text-center">
          <div className="text-laurel-amber text-2xl font-bold">0</div>
          <p className="text-muted-foreground text-sm">Day Streak</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-4 text-center">
          <div className="text-laurel-sage text-2xl font-bold">0</div>
          <p className="text-muted-foreground text-sm">XP Earned</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="border-border bg-card rounded-xl border">
        <div className="border-border border-b p-4">
          <h3 className="text-foreground font-semibold">Settings</h3>
        </div>
        <div className="divide-border divide-y">
          <button
            disabled
            className="text-foreground flex w-full items-center gap-3 p-4 text-left text-sm opacity-50"
            type="button"
          >
            <Settings className="text-muted-foreground h-5 w-5" />
            <span>Preferences (Coming Soon)</span>
          </button>
          <button
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 p-4 text-left text-sm"
            disabled={isLoggingOut}
            type="button"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

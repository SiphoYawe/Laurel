"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/auth";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "link";
  className?: string;
}

export function LogoutButton({ variant = "outline", className }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={className}
      disabled={isLoading}
      isLoading={isLoading}
      type="button"
      variant={variant}
      onClick={handleLogout}
    >
      Log Out
    </Button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface TabBarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number | boolean;
  onScrollToTop?: () => void;
}

/**
 * TabBarItem Component
 * Individual navigation item for bottom tab bar with badge support
 * Minimum touch target: 44x44px
 */
export function TabBarItem({ href, icon: Icon, label, badge, onScrollToTop }: TabBarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const handleClick = (e: React.MouseEvent) => {
    // If clicking the active tab, scroll to top
    if (isActive && onScrollToTop) {
      e.preventDefault();
      onScrollToTop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter and Space for keyboard accessibility
    if (e.key === "Enter" || e.key === " ") {
      if (isActive && onScrollToTop) {
        e.preventDefault();
        onScrollToTop();
      }
    }
  };

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-visible:ring-laurel-forest relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive ? "text-laurel-forest" : "text-muted-foreground hover:text-laurel-forest/70"
      )}
      href={href}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Icon aria-hidden="true" className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
      <span className="text-[10px] font-medium leading-none">{label}</span>

      {/* Badge indicator */}
      {badge && (
        <span
          className={cn(
            "bg-laurel-amber absolute right-1/4 top-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white",
            typeof badge === "number" ? "min-w-[18px] px-1 py-0.5" : "h-2.5 w-2.5"
          )}
        >
          {typeof badge === "number" && badge > 0 && (badge > 99 ? "99+" : badge)}
        </span>
      )}
    </Link>
  );
}

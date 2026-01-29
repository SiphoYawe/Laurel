"use client";

import { BookOpen, CheckCircle, Home, MessageCircle, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LucideIcon } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number | boolean;
}

function NavItem({ href, icon: Icon, label, badge }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-visible:ring-laurel-forest relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive
          ? "bg-laurel-forest/10 text-laurel-forest"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      href={href}
    >
      <Icon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
      <span>{label}</span>

      {/* Badge indicator */}
      {badge && (
        <span
          className={cn(
            "bg-laurel-amber ml-auto flex items-center justify-center rounded-full text-[10px] font-bold text-white",
            typeof badge === "number" ? "min-w-[18px] px-1.5 py-0.5" : "h-2.5 w-2.5"
          )}
        >
          {typeof badge === "number" && badge > 0 && (badge > 99 ? "99+" : badge)}
        </span>
      )}
    </Link>
  );
}

interface SidebarProps {
  badges?: {
    chat?: boolean;
    habits?: number;
    learn?: number;
    pods?: boolean;
    profile?: boolean;
  };
}

/**
 * Sidebar Component
 * Left navigation sidebar for desktop (>= 1024px)
 * Shows logo and 5 navigation items with labels
 */
export function Sidebar({ badges = {} }: SidebarProps) {
  return (
    <aside
      aria-label="Main navigation"
      className="border-border bg-background fixed inset-y-0 left-0 z-50 hidden w-64 border-r lg:block"
      role="navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-border flex h-16 items-center border-b px-4">
          <Link className="flex items-center" href="/dashboard">
            <Logo size="sm" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <NavItem href="/dashboard" icon={Home} label="Home" />
          <NavItem badge={badges.chat} href="/chat" icon={MessageCircle} label="Chat" />
          <NavItem badge={badges.habits} href="/habits" icon={CheckCircle} label="Habits" />
          <NavItem badge={badges.learn} href="/learn" icon={BookOpen} label="Learn" />
          <NavItem badge={badges.pods} href="/pods" icon={Users} label="Pods" />
          <NavItem badge={badges.profile} href="/profile" icon={User} label="Profile" />
        </nav>

        {/* Footer */}
        <div className="border-border border-t p-4">
          <p className="text-muted-foreground text-xs">Build habits that stick</p>
        </div>
      </div>
    </aside>
  );
}

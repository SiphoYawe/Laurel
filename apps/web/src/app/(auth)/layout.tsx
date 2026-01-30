import Image from "next/image";
import Link from "next/link";

import type { ReactNode } from "react";

/**
 * Auth Layout
 * Organic luxe themed layout for authentication pages
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-laurel-midnight relative min-h-screen overflow-hidden">
      {/* Grain texture overlay */}
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.03]" />

      {/* Ambient glow effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="bg-laurel-glow/5 absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full blur-[100px]" />
        <div className="bg-laurel-sage/5 absolute bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link className="group mb-8 flex flex-col items-center" href="/">
            <Image
              priority
              alt="Laurel"
              className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
              height={64}
              src="/laurel-logo-white.svg"
              width={230}
            />
            <span className="text-laurel-cream/40 mt-3 text-sm">
              Cultivate habits that flourish
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

import type { ReactNode } from "react";

// Laurel wreath SVG for the logo
function LaurelWreath({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(10, 20)">
        <path
          d="M40 80C35 70 30 50 35 30C25 35 15 50 20 70C25 85 40 80 40 80Z"
          fill="currentColor"
          fillOpacity="0.8"
        />
        <path
          d="M35 65C30 55 28 40 32 25C24 30 18 42 22 58C25 70 35 65 35 65Z"
          fill="currentColor"
          fillOpacity="0.6"
        />
        <path
          d="M30 50C27 42 26 30 29 18C23 22 18 32 21 44C23 54 30 50 30 50Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
      </g>
      <g transform="translate(70, 20) scale(-1, 1)">
        <path
          d="M40 80C35 70 30 50 35 30C25 35 15 50 20 70C25 85 40 80 40 80Z"
          fill="currentColor"
          fillOpacity="0.8"
        />
        <path
          d="M35 65C30 55 28 40 32 25C24 30 18 42 22 58C25 70 35 65 35 65Z"
          fill="currentColor"
          fillOpacity="0.6"
        />
        <path
          d="M30 50C27 42 26 30 29 18C23 22 18 32 21 44C23 54 30 50 30 50Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
      </g>
    </svg>
  );
}

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
            <LaurelWreath className="text-laurel-glow h-16 w-16 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-display text-laurel-cream mt-2 text-3xl">Laurel</span>
            <span className="text-laurel-cream/40 mt-1 text-sm">
              Cultivate habits that flourish
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}

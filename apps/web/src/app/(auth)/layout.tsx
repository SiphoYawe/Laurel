import type { ReactNode } from "react";

/**
 * Auth Layout
 * Centered layout for authentication pages (signup, login, verify-email)
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F5F9F6] to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#2D5A3D]">
            <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2D5A3D]">Laurel</h1>
          <p className="text-sm text-gray-500">Build habits that stick</p>
        </div>

        {children}
      </div>
    </div>
  );
}

"use client";

import { calculatePasswordStrength, getPasswordStrengthLabel } from "@laurel/shared/validations";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const strengthColors = {
  weak: "bg-red-500",
  fair: "bg-amber-500",
  good: "bg-lime-500",
  strong: "bg-green-500",
};

const strengthLabels = {
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const label = useMemo(() => getPasswordStrengthLabel(strength), [strength]);

  // Don't show if password is empty
  if (!password) return null;

  const requirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(password) && /[A-Z]/.test(password), text: "Upper & lowercase letters" },
    { met: /\d/.test(password), text: "At least one number" },
    { met: /[^a-zA-Z0-9]/.test(password), text: "At least one special character" },
  ];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-gray-200">
          <div
            className={cn("h-full rounded-full transition-all duration-300", strengthColors[label])}
            style={{ width: `${(strength / 4) * 100}%` }}
          />
        </div>
        <span
          className={cn("text-xs font-medium", {
            "text-red-500": label === "weak",
            "text-amber-500": label === "fair",
            "text-lime-600": label === "good",
            "text-green-600": label === "strong",
          })}
        >
          {strengthLabels[label]}
        </span>
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1">
        {requirements.map((req) => (
          <li
            key={req.text}
            className={cn(
              "flex items-center gap-2 text-xs",
              req.met ? "text-green-600" : "text-gray-400"
            )}
          >
            {req.met ? (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="5" />
              </svg>
            )}
            {req.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

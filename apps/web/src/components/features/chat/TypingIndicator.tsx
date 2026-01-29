"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * TypingIndicator Component
 * Shows animated dots while AI is generating a response
 */
export function TypingIndicator() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="bg-laurel-sage/30 text-laurel-forest flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        <LaurelIcon className="h-5 w-5" />
      </div>

      {/* Typing bubble */}
      <div className="bg-card border-border flex items-center gap-1 rounded-2xl border px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={
              prefersReducedMotion
                ? { opacity: [0.4, 1, 0.4] }
                : { scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }
            }
            className="bg-laurel-sage h-2 w-2 rounded-full"
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        <span className="text-muted-foreground ml-2 text-sm">Laurel is thinking...</span>
      </div>
    </div>
  );
}

/**
 * Laurel leaf icon
 */
function LaurelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 3c-1.5 0-4 1.5-4 4.5C8 10 10 12 12 12s4-2 4-4.5C16 4.5 13.5 3 12 3z" />
      <path d="M12 12v9" />
      <path d="M8 17c1.5-1.5 4-1.5 4-1.5s2.5 0 4 1.5" />
    </svg>
  );
}

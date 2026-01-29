"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SuggestedPrompts } from "./SuggestedPrompts";

interface WelcomeStateProps {
  userName?: string;
  onPromptSelect: (prompt: string) => void;
}

/**
 * WelcomeState Component
 * Displays welcome message and suggested prompts for new users
 */
export function WelcomeState({ userName, onPromptSelect }: WelcomeStateProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      animate="visible"
      className="flex h-full flex-col items-center justify-center px-4 py-8"
      initial="hidden"
      transition={{ duration: 0.4 }}
      variants={prefersReducedMotion ? reducedMotionVariants : variants}
    >
      {/* Laurel Avatar */}
      <motion.div
        animate={{ scale: 1 }}
        className="bg-laurel-sage/20 mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        initial={prefersReducedMotion ? {} : { scale: 0.8 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <LaurelIcon className="text-laurel-forest h-12 w-12" />
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 max-w-md text-center"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-foreground mb-2 text-xl font-semibold">
          Hi{userName ? ` ${userName}` : ""}! I&apos;m Laurel
        </h2>
        <p className="text-muted-foreground">
          I&apos;m your AI habit coach. I&apos;m here to help you build study habits that actually
          stick using the <span className="text-laurel-forest font-medium">Atomic Habits</span>{" "}
          framework.
        </p>
      </motion.div>

      {/* Suggested Prompts */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-muted-foreground mb-3 text-center text-sm">
          Try one of these to get started:
        </p>
        <SuggestedPrompts onSelect={onPromptSelect} />
      </motion.div>
    </motion.div>
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

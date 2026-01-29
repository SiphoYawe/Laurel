"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Default suggested prompts for new users
 */
const SUGGESTED_PROMPTS = [
  {
    label: "Help me create a study habit",
    description: "Get started with building a new study routine",
  },
  {
    label: "I keep forgetting to study",
    description: "Learn techniques to remember your habits",
  },
  {
    label: "What's the two-minute rule?",
    description: "Understand this powerful habit technique",
  },
  {
    label: "How do I stay consistent?",
    description: "Tips for maintaining your habits long-term",
  },
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  sendImmediately?: boolean;
}

/**
 * SuggestedPrompts Component
 * Displays clickable prompt chips for new users
 */
export function SuggestedPrompts({ onSelect, sendImmediately = false }: SuggestedPromptsProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      animate="visible"
      className="flex flex-wrap gap-2"
      initial="hidden"
      variants={prefersReducedMotion ? reducedMotionVariants : containerVariants}
    >
      {SUGGESTED_PROMPTS.map((prompt, index) => (
        <motion.button
          key={index}
          aria-label={`${sendImmediately ? "Send" : "Insert"}: ${prompt.label}`}
          className="border-laurel-sage/30 bg-card hover:bg-laurel-sage/10 hover:border-laurel-sage active:bg-laurel-sage/20 rounded-full border px-4 py-2 text-sm transition-colors"
          title={prompt.description}
          variants={prefersReducedMotion ? reducedMotionVariants : itemVariants}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          onClick={() => onSelect(prompt.label)}
        >
          <span className="text-foreground">{prompt.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

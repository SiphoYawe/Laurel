"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Loader2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * CreateDeckModal - Modal for creating a new flashcard deck
 * Story 6-2: Create Flashcard Decks
 */

const DECK_COLORS = [
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#9C27B0", // Purple
  "#FF9800", // Orange
  "#F44336", // Red
  "#00BCD4", // Cyan
  "#E91E63", // Pink
  "#795548", // Brown
];

const DECK_CATEGORIES = [
  "general",
  "language",
  "science",
  "math",
  "history",
  "programming",
  "vocabulary",
  "other",
];

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (data: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
  }) => Promise<void>;
  isCreating: boolean;
}

export function CreateDeckModal({
  isOpen,
  onClose,
  onCreateDeck,
  isCreating,
}: CreateDeckModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [color, setColor] = useState(DECK_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a deck name");
      return;
    }

    try {
      await onCreateDeck({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        color,
      });
      // Reset form and close
      setName("");
      setDescription("");
      setCategory("general");
      setColor(DECK_COLORS[0]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deck");
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setName("");
      setDescription("");
      setCategory("general");
      setColor(DECK_COLORS[0]);
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            animate={{ scale: 1, y: 0 }}
            className="bg-card border-border w-full max-w-md rounded-2xl border p-6 shadow-xl"
            exit={{ scale: 0.95, y: 20 }}
            initial={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Layers className="h-5 w-5" style={{ color }} />
                </div>
                <h2 className="text-foreground text-xl font-semibold">Create Deck</h2>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
                disabled={isCreating}
                type="button"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Deck Name */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="deck-name"
                >
                  Deck Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={cn(
                    "border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2",
                    error && "border-red-500"
                  )}
                  disabled={isCreating}
                  id="deck-name"
                  maxLength={100}
                  placeholder="Spanish Vocabulary, Biology Terms..."
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="deck-description"
                >
                  Description <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  className={cn(
                    "border-input bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2"
                  )}
                  disabled={isCreating}
                  id="deck-description"
                  maxLength={500}
                  placeholder="What will you learn with this deck?"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="deck-category"
                >
                  Category
                </label>
                <select
                  className={cn(
                    "border-input bg-background text-foreground w-full rounded-lg border px-4 py-2.5 text-sm capitalize transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2"
                  )}
                  disabled={isCreating}
                  id="deck-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {DECK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div className="mb-6">
                <label className="text-foreground mb-2 block text-sm font-medium">Color</label>
                <div className="flex flex-wrap gap-2">
                  {DECK_COLORS.map((c) => (
                    <button
                      key={c}
                      className={cn(
                        "h-8 w-8 rounded-full transition-all",
                        color === c
                          ? "ring-2 ring-current ring-offset-2"
                          : "opacity-70 hover:opacity-100"
                      )}
                      style={{ backgroundColor: c, "--ring-color": c } as React.CSSProperties}
                      type="button"
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="text-muted-foreground hover:bg-muted flex-1 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium transition-colors"
                  disabled={isCreating}
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className={cn(
                    "bg-laurel-forest flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors",
                    "hover:bg-laurel-forest/90",
                    "disabled:cursor-not-allowed disabled:opacity-60"
                  )}
                  disabled={isCreating || !name.trim()}
                  type="submit"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Deck"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

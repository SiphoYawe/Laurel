"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Loader2, Plus, Tag } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

/**
 * CardEditor - Modal for creating/editing flashcards
 * Story 6-3: Create and Edit Flashcards
 */

interface CardData {
  id?: string;
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
}

interface CardEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { front: string; back: string; hint?: string; tags?: string[] }) => Promise<void>;
  initialData?: CardData;
  deckName?: string;
  isSaving: boolean;
}

export function CardEditor({
  isOpen,
  onClose,
  onSave,
  initialData,
  deckName,
  isSaving,
}: CardEditorProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [hint, setHint] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData?.id;

  // Initialize form with data
  useEffect(() => {
    if (initialData) {
      setFront(initialData.front);
      setBack(initialData.back);
      setHint(initialData.hint || "");
      setTags(initialData.tags || []);
    } else {
      setFront("");
      setBack("");
      setHint("");
      setTags([]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!front.trim()) {
      setError("Please enter the front of the card");
      return;
    }

    if (!back.trim()) {
      setError("Please enter the back of the card");
      return;
    }

    try {
      await onSave({
        front: front.trim(),
        back: back.trim(),
        hint: hint.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      if (!isEditing) {
        // Reset form for adding another card
        setFront("");
        setBack("");
        setHint("");
        setTags([]);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save card");
    }
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleClose = () => {
    if (!isSaving) {
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
            className="bg-card border-border max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-6 shadow-xl"
            exit={{ scale: 0.95, y: 20 }}
            initial={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Layers className="text-laurel-forest h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-foreground text-xl font-semibold">
                    {isEditing ? "Edit Card" : "Add Card"}
                  </h2>
                  {deckName && <p className="text-muted-foreground text-sm">{deckName}</p>}
                </div>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
                disabled={isSaving}
                type="button"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Front */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="card-front"
                >
                  Front (Question) <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={cn(
                    "border-input bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2",
                    error && !front.trim() && "border-red-500"
                  )}
                  disabled={isSaving}
                  id="card-front"
                  maxLength={5000}
                  placeholder="What is the capital of France?"
                  rows={3}
                  value={front}
                  onChange={(e) => {
                    setFront(e.target.value);
                    setError(null);
                  }}
                />
              </div>

              {/* Back */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="card-back"
                >
                  Back (Answer) <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={cn(
                    "border-input bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2",
                    error && !back.trim() && "border-red-500"
                  )}
                  disabled={isSaving}
                  id="card-back"
                  maxLength={5000}
                  placeholder="Paris"
                  rows={3}
                  value={back}
                  onChange={(e) => {
                    setBack(e.target.value);
                    setError(null);
                  }}
                />
              </div>

              {/* Hint */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="card-hint"
                >
                  Hint <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  className={cn(
                    "border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2"
                  )}
                  disabled={isSaving}
                  id="card-hint"
                  maxLength={500}
                  placeholder="Starts with P..."
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="text-foreground mb-1.5 block text-sm font-medium">
                  Tags <span className="text-muted-foreground">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        className="hover:text-foreground ml-1"
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {tags.length < 10 && (
                    <div className="flex items-center gap-1">
                      <input
                        className="border-input bg-background w-24 rounded-lg border px-2 py-1 text-sm"
                        disabled={isSaving}
                        maxLength={50}
                        placeholder="Add tag"
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <button
                        className="bg-muted hover:bg-muted/80 rounded-lg p-1"
                        type="button"
                        onClick={handleAddTag}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
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
                  disabled={isSaving}
                  type="button"
                  onClick={handleClose}
                >
                  {isEditing ? "Cancel" : "Done"}
                </button>
                <button
                  className={cn(
                    "bg-laurel-forest flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors",
                    "hover:bg-laurel-forest/90",
                    "disabled:cursor-not-allowed disabled:opacity-60"
                  )}
                  disabled={isSaving || !front.trim() || !back.trim()}
                  type="submit"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    "Add Card"
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

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Loader2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * CreatePodModal - Modal for creating a new accountability pod
 * Story 5-2: Create Accountability Pod
 *
 * Features:
 * - Pod name input
 * - Optional description
 * - Max members selection
 * - Loading state
 * - Success feedback
 */

interface CreatePodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePod: (name: string, description?: string, maxMembers?: number) => Promise<void>;
  isCreating: boolean;
}

export function CreatePodModal({ isOpen, onClose, onCreatePod, isCreating }: CreatePodModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a pod name");
      return;
    }

    if (name.trim().length < 3) {
      setError("Pod name must be at least 3 characters");
      return;
    }

    try {
      await onCreatePod(name.trim(), description.trim() || undefined, maxMembers);
      // Reset form and close
      setName("");
      setDescription("");
      setMaxMembers(10);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pod");
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setName("");
      setDescription("");
      setMaxMembers(10);
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
                <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Users className="text-laurel-forest h-5 w-5" />
                </div>
                <h2 className="text-foreground text-xl font-semibold">Create Pod</h2>
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
              {/* Pod Name */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="pod-name"
                >
                  Pod Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={cn(
                    "border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2",
                    error && "border-red-500"
                  )}
                  disabled={isCreating}
                  id="pod-name"
                  maxLength={50}
                  placeholder="Study Squad, Habit Heroes..."
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                />
                <p className="text-muted-foreground mt-1 text-xs">{name.length}/50 characters</p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="pod-description"
                >
                  Description <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  className={cn(
                    "border-input bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2"
                  )}
                  disabled={isCreating}
                  id="pod-description"
                  maxLength={200}
                  placeholder="What's this pod about?"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  {description.length}/200 characters
                </p>
              </div>

              {/* Max Members */}
              <div className="mb-6">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="max-members"
                >
                  Max Members
                </label>
                <select
                  className={cn(
                    "border-input bg-background text-foreground w-full rounded-lg border px-4 py-2.5 text-sm transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2"
                  )}
                  disabled={isCreating}
                  id="max-members"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Number(e.target.value))}
                >
                  <option value={5}>5 members</option>
                  <option value={10}>10 members</option>
                  <option value={15}>15 members</option>
                  <option value={20}>20 members</option>
                </select>
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
                    "Create Pod"
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

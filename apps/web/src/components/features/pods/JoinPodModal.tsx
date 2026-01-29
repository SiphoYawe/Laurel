"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Loader2, CheckCircle2, AlertCircle, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

import { usePodPreview } from "@/hooks/usePods";
import { cn } from "@/lib/utils";

/**
 * JoinPodModal - Modal for joining a pod via invite code
 * Story 5-3: Join Pod via Invite Code
 *
 * Features:
 * - 6-character code input
 * - Real-time pod preview
 * - Validation feedback
 * - Loading states
 */

interface JoinPodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinPod: (inviteCode: string) => Promise<void>;
  isJoining: boolean;
}

export function JoinPodModal({ isOpen, onClose, onJoinPod, isJoining }: JoinPodModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Preview the pod when code is complete
  const {
    preview,
    isLoading: isLoadingPreview,
    canJoin,
  } = usePodPreview(code.length === 6 ? code : null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCode("");
      setError(null);
    }
  }, [isOpen]);

  const handleCodeChange = (value: string) => {
    // Only allow alphanumeric characters, convert to uppercase
    const cleaned = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    setCode(cleaned);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError("Please enter a 6-character invite code");
      return;
    }

    if (!canJoin) {
      if (preview?.isAlreadyMember) {
        setError("You&apos;re already a member of this pod");
      } else if (preview?.isFull) {
        setError("This pod is full");
      } else if (!preview?.isActive) {
        setError("This pod is no longer active");
      } else {
        setError("Cannot join this pod");
      }
      return;
    }

    try {
      await onJoinPod(code);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join pod");
    }
  };

  const handleClose = () => {
    if (!isJoining) {
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
                  <UserPlus className="text-laurel-forest h-5 w-5" />
                </div>
                <h2 className="text-foreground text-xl font-semibold">Join Pod</h2>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
                disabled={isJoining}
                type="button"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Invite Code Input */}
              <div className="mb-4">
                <label
                  className="text-foreground mb-1.5 block text-sm font-medium"
                  htmlFor="invite-code"
                >
                  Invite Code
                </label>
                <input
                  autoComplete="off"
                  className={cn(
                    "border-input bg-background text-foreground w-full rounded-lg border px-4 py-3 text-center font-mono text-2xl uppercase tracking-widest transition-colors",
                    "focus:border-laurel-forest focus:ring-laurel-forest/20 focus:outline-none focus:ring-2",
                    error && "border-red-500"
                  )}
                  disabled={isJoining}
                  id="invite-code"
                  maxLength={6}
                  placeholder="ABC123"
                  type="text"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                />
                <p className="text-muted-foreground mt-1 text-center text-xs">
                  Enter the 6-character code from your friend
                </p>
              </div>

              {/* Pod Preview */}
              {code.length === 6 && (
                <div className="mb-4">
                  {isLoadingPreview ? (
                    <div className="border-border bg-muted/30 flex items-center justify-center rounded-lg border p-4">
                      <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                      <span className="text-muted-foreground ml-2 text-sm">Looking up pod...</span>
                    </div>
                  ) : preview ? (
                    <div
                      className={cn(
                        "rounded-lg border p-4",
                        canJoin
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-laurel-sage/30 flex h-10 w-10 items-center justify-center rounded-lg">
                          <Users className="text-laurel-forest h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-foreground font-semibold">{preview.name}</h3>
                            {canJoin && (
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          {preview.description && (
                            <p className="text-muted-foreground mt-0.5 text-sm">
                              {preview.description}
                            </p>
                          )}
                          <p className="text-muted-foreground mt-1 text-xs">
                            {preview.memberCount}/{preview.maxMembers} members
                          </p>
                        </div>
                      </div>

                      {/* Status Messages */}
                      {preview.isAlreadyMember && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                          <AlertCircle className="h-4 w-4" />
                          You&apos;re already a member
                        </div>
                      )}
                      {preview.isFull && !preview.isAlreadyMember && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                          <AlertCircle className="h-4 w-4" />
                          This pod is full
                        </div>
                      )}
                      {!preview.isActive && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="h-4 w-4" />
                          This pod is no longer active
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-border bg-muted/30 flex items-center justify-center rounded-lg border border-dashed p-4">
                      <AlertCircle className="text-muted-foreground h-5 w-5" />
                      <span className="text-muted-foreground ml-2 text-sm">Pod not found</span>
                    </div>
                  )}
                </div>
              )}

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
                  disabled={isJoining}
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
                  disabled={isJoining || !canJoin}
                  type="submit"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Pod"
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

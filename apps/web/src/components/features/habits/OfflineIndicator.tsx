"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Cloud, RefreshCw } from "lucide-react";

import { useOfflineIndicator, useOfflineSync } from "@/hooks/useOfflineSync";
import { cn } from "@/lib/utils";

/**
 * OfflineIndicator - Shows offline status and pending sync count
 * Story 3-1: One-Tap Habit Completion - Offline Support
 */

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const { showIndicator, isOnline, pendingCount, message } = useOfflineIndicator();
  const { isSyncing, syncQueue } = useOfflineSync();

  if (!showIndicator) return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
          !isOnline
            ? "bg-amber-100 text-amber-800"
            : isSyncing
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-600",
          className
        )}
        exit={{ opacity: 0, y: -10 }}
        initial={{ opacity: 0, y: -10 }}
      >
        {!isOnline ? (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-200 px-1.5 text-[10px]">{pendingCount}</span>
            )}
          </>
        ) : isSyncing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </motion.div>
            <span>Syncing...</span>
          </>
        ) : pendingCount > 0 ? (
          <>
            <Cloud className="h-3.5 w-3.5" />
            <span>{message}</span>
            <button
              className="ml-1 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] hover:bg-gray-300"
              onClick={() => syncQueue()}
            >
              Sync now
            </button>
          </>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * OfflineBanner - Full-width banner for offline state
 */
export function OfflineBanner() {
  const { isOnline, pendingCount } = useOfflineIndicator();

  if (isOnline && pendingCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ height: "auto", opacity: 1 }}
        className={cn(
          "w-full px-4 py-2 text-center text-sm font-medium",
          !isOnline ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
        )}
        exit={{ height: 0, opacity: 0 }}
        initial={{ height: 0, opacity: 0 }}
      >
        {!isOnline ? (
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>
              You&apos;re offline.{" "}
              {pendingCount > 0 && `${pendingCount} completions will sync when you&apos;re back.`}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>{pendingCount} completions pending sync</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { motion } from "framer-motion";
import { Users, Crown, Copy, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * PodCard - Displays a single accountability pod
 * Story 5-2: Create Accountability Pod
 *
 * Features:
 * - Pod name and description
 * - Member count and capacity
 * - Invite code with copy button
 * - Owner indicator
 * - Click to view details
 */

interface PodMember {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
}

interface Pod {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdBy: string;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
  memberCount?: number;
  members?: PodMember[];
}

interface PodCardProps {
  pod: Pod;
  isOwner: boolean;
  onClick?: () => void;
  className?: string;
}

export function PodCard({ pod, isOwner, onClick, className }: PodCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(pod.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed
    }
  };

  const memberCount = pod.memberCount || pod.members?.length || 1;

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={cn(
          "cursor-pointer border transition-all duration-200",
          "hover:border-laurel-forest/30 hover:shadow-md",
          !pod.isActive && "opacity-60",
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            {/* Pod Info */}
            <div className="flex items-start gap-3">
              <div className="bg-laurel-sage/20 flex h-12 w-12 items-center justify-center rounded-xl">
                <Users className="text-laurel-forest h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground font-semibold">{pod.name}</h3>
                  {isOwner && (
                    <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <Crown className="h-3 w-3" />
                      Owner
                    </div>
                  )}
                </div>
                {pod.description && (
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
                    {pod.description}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          </div>

          {/* Stats Row */}
          <div className="mt-4 flex items-center justify-between">
            {/* Member Count */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {(pod.members || []).slice(0, 3).map((member, idx) => (
                  <div
                    key={member.userId}
                    className="border-background bg-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium"
                    style={{ zIndex: 3 - idx }}
                  >
                    {member.avatarUrl ? (
                      <img
                        alt={member.displayName || "Member"}
                        className="h-full w-full rounded-full object-cover"
                        src={member.avatarUrl}
                      />
                    ) : (
                      (member.displayName?.[0] || "?").toUpperCase()
                    )}
                  </div>
                ))}
                {memberCount > 3 && (
                  <div className="border-background bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
                    +{memberCount - 3}
                  </div>
                )}
              </div>
              <span className="text-muted-foreground text-sm">
                {memberCount}/{pod.maxMembers} members
              </span>
            </div>

            {/* Invite Code */}
            <button
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                "bg-muted hover:bg-muted/80",
                copied && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              )}
              type="button"
              onClick={handleCopyCode}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  {pod.inviteCode}
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * PodCardSkeleton - Loading state for PodCard
 */
export function PodCardSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-muted h-12 w-12 animate-pulse rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="bg-muted h-5 w-32 animate-pulse rounded" />
            <div className="bg-muted h-4 w-48 animate-pulse rounded" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="bg-muted h-8 w-8 animate-pulse rounded-full" />
              ))}
            </div>
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          </div>
          <div className="bg-muted h-8 w-24 animate-pulse rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * EmptyPodState - Display when user has no pods
 */
interface EmptyPodStateProps {
  onCreatePod: () => void;
  onJoinPod: () => void;
}

export function EmptyPodState({ onCreatePod, onJoinPod }: EmptyPodStateProps) {
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
      <div className="bg-laurel-sage/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Users className="text-laurel-sage h-8 w-8" />
      </div>
      <h3 className="text-foreground font-semibold">No pods yet</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
        Create or join an accountability pod to stay motivated with friends and track progress
        together.
      </p>
      <div className="mt-4 flex gap-3">
        <button
          className="bg-laurel-forest hover:bg-laurel-forest/90 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          type="button"
          onClick={onCreatePod}
        >
          Create a Pod
        </button>
        <button
          className="border-laurel-forest text-laurel-forest hover:bg-laurel-forest/10 inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          type="button"
          onClick={onJoinPod}
        >
          Join with Code
        </button>
      </div>
    </div>
  );
}

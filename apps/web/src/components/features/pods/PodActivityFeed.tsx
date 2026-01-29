"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle2, Flame, Award, UserPlus, UserMinus, Share2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * PodActivityFeed - Displays real-time pod activity
 * Story 5-5: Pod Activity Feed
 *
 * Features:
 * - Activity type icons
 * - Time-relative display
 * - Member avatars
 * - Animated entry
 */

type ActivityType =
  | "habit_completed"
  | "streak_milestone"
  | "badge_earned"
  | "member_joined"
  | "member_left"
  | "habit_shared";

interface PodActivity {
  id: string;
  podId: string;
  userId: string;
  activityType: ActivityType;
  referenceId: string | null;
  referenceType: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  // Joined fields
  user?: {
    displayName: string | null;
    avatarUrl: string | null;
  };
  habitName?: string;
  badgeName?: string;
}

interface PodActivityFeedProps {
  activities: PodActivity[];
  isLoading?: boolean;
  maxItems?: number;
  className?: string;
}

export function PodActivityFeed({
  activities,
  isLoading,
  maxItems = 20,
  className,
}: PodActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  if (isLoading) {
    return <PodActivityFeedSkeleton />;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-5 w-5 text-blue-500" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayActivities.map((activity, idx) => (
            <ActivityRow key={activity.id} activity={activity} index={idx} />
          ))}

          {activities.length === 0 && (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No activity yet. Complete habits to show up here!
            </div>
          )}

          {activities.length > maxItems && (
            <p className="text-muted-foreground pt-2 text-center text-xs">
              Showing {maxItems} of {activities.length} activities
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityRowProps {
  activity: PodActivity;
  index: number;
}

function ActivityRow({ activity, index }: ActivityRowProps) {
  const config = getActivityConfig(activity);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: index * 0.03 }}
    >
      {/* Icon */}
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", config.bgColor)}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm">
          <span className="font-medium">{activity.user?.displayName || "Someone"}</span>{" "}
          <span className="text-muted-foreground">{config.text}</span>
        </p>
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Avatar */}
      <div className="bg-muted flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-xs font-medium">
        {activity.user?.avatarUrl ? (
          <img
            alt={activity.user.displayName || "Member"}
            className="h-full w-full object-cover"
            src={activity.user.avatarUrl}
          />
        ) : (
          (activity.user?.displayName?.[0] || "?").toUpperCase()
        )}
      </div>
    </motion.div>
  );
}

interface ActivityConfig {
  icon: React.ReactNode;
  text: string;
  bgColor: string;
}

function getActivityConfig(activity: PodActivity): ActivityConfig {
  switch (activity.activityType) {
    case "habit_completed":
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
        text: `completed ${activity.habitName || "a habit"}`,
        bgColor: "bg-green-100 dark:bg-green-900/30",
      };
    case "streak_milestone": {
      const days = (activity.metadata?.days as number) || 0;
      return {
        icon: <Flame className="h-4 w-4 text-orange-500" />,
        text: `reached a ${days}-day streak!`,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      };
    }
    case "badge_earned":
      return {
        icon: <Award className="h-4 w-4 text-purple-500" />,
        text: `earned ${activity.badgeName || "a badge"}`,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      };
    case "member_joined":
      return {
        icon: <UserPlus className="h-4 w-4 text-blue-500" />,
        text: "joined the pod",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      };
    case "member_left":
      return {
        icon: <UserMinus className="h-4 w-4 text-gray-500" />,
        text: "left the pod",
        bgColor: "bg-gray-100 dark:bg-gray-800",
      };
    case "habit_shared":
      return {
        icon: <Share2 className="h-4 w-4 text-blue-500" />,
        text: `shared ${activity.habitName || "a habit"} with the pod`,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      };
    default:
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-gray-500" />,
        text: "did something",
        bgColor: "bg-gray-100 dark:bg-gray-800",
      };
  }
}

function PodActivityFeedSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="bg-muted h-5 w-28 animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                <div className="bg-muted h-3 w-20 animate-pulse rounded" />
              </div>
              <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * CompactActivityFeed - Smaller version for pod cards
 */
interface CompactActivityFeedProps {
  activities: PodActivity[];
  maxItems?: number;
  className?: string;
}

export function CompactActivityFeed({
  activities,
  maxItems = 3,
  className,
}: CompactActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className={cn("space-y-2", className)}>
      {displayActivities.map((activity) => {
        const config = getActivityConfig(activity);
        return (
          <div key={activity.id} className="flex items-center gap-2 text-xs">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full",
                config.bgColor
              )}
            >
              {config.icon}
            </div>
            <span className="text-muted-foreground flex-1 truncate">
              <span className="text-foreground font-medium">
                {activity.user?.displayName || "Someone"}
              </span>{" "}
              {config.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

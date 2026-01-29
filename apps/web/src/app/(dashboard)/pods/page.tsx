"use client";

import { Plus, Users, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  PodCard,
  PodCardSkeleton,
  EmptyPodState,
  CreatePodModal,
  JoinPodModal,
} from "@/components/features/pods";
import { usePods } from "@/hooks/usePods";
import { useAuth } from "@/lib/supabase/auth-context";

/**
 * Pods Page
 * Story 5-2, 5-3: Create and join accountability pods
 */
export default function PodsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { pods, isLoadingPods, createPod, joinPod, isCreating, isJoining } = usePods();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreatePod = async (name: string, description?: string, maxMembers?: number) => {
    const newPod = await createPod(name, description, maxMembers);
    if (newPod?.id) {
      router.push(`/pods/${newPod.id}`);
    }
  };

  const handleJoinPod = async (inviteCode: string) => {
    const pod = await joinPod(inviteCode);
    if (pod?.podId) {
      router.push(`/pods/${pod.podId}`);
    }
  };

  const handlePodClick = (podId: string) => {
    router.push(`/pods/${podId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Users className="text-laurel-forest h-5 w-5" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold">Accountability Pods</h1>
            <p className="text-muted-foreground text-sm">Stay motivated with friends</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="border-laurel-forest text-laurel-forest hover:bg-laurel-forest/10 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            type="button"
            onClick={() => setShowJoinModal(true)}
          >
            <UserPlus className="h-4 w-4" />
            Join Pod
          </button>
          <button
            className="bg-laurel-forest hover:bg-laurel-forest/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            type="button"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            Create Pod
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoadingPods ? (
        <div className="space-y-4">
          {[0, 1, 2].map((idx) => (
            <PodCardSkeleton key={idx} />
          ))}
        </div>
      ) : pods.length === 0 ? (
        <EmptyPodState
          onCreatePod={() => setShowCreateModal(true)}
          onJoinPod={() => setShowJoinModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {pods.map((pod) => (
            <PodCard
              key={pod.id}
              isOwner={pod.isOwner}
              pod={{
                ...pod,
                createdBy: "", // Not available in list, but isOwner is
                isActive: true, // Only active pods are returned
              }}
              onClick={() => handlePodClick(pod.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreatePodModal
        isCreating={isCreating}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePod={handleCreatePod}
      />
      <JoinPodModal
        isJoining={isJoining}
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinPod={handleJoinPod}
      />
    </div>
  );
}

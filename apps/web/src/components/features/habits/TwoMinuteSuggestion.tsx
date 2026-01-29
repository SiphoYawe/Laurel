"use client";

import { motion } from "framer-motion";
import { Zap, Check, Pencil, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * TwoMinuteSuggestion - Display AI-generated two-minute version suggestion
 * Story 2-8: Two-Minute Rule Generator
 */

interface TwoMinuteSuggestionProps {
  suggestion: string;
  habitTitle: string;
  onAccept: (version: string) => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export function TwoMinuteSuggestion({
  suggestion,
  habitTitle,
  onAccept,
  onDismiss,
  isLoading = false,
}: TwoMinuteSuggestionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVersion, setEditedVersion] = useState(suggestion);

  const handleAccept = () => {
    onAccept(isEditing ? editedVersion : suggestion);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedVersion(suggestion);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedVersion(suggestion);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-dashed border-amber-400 bg-amber-50 p-4"
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 10 }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-medium text-amber-800">2-Minute Starter Version</span>
      </div>

      <p className="mb-2 text-xs text-amber-700">
        Start small with a 2-minute version when motivation is low:
      </p>

      {isEditing ? (
        <div className="mb-3">
          <Input
            autoFocus
            className="border-amber-300 bg-white text-sm"
            placeholder="Edit your two-minute version..."
            value={editedVersion}
            onChange={(e) => setEditedVersion(e.target.value)}
          />
        </div>
      ) : (
        <div className="mb-3 rounded-md bg-white p-3">
          <p className="text-sm font-medium text-gray-800">&quot;{suggestion}&quot;</p>
          <p className="mt-1 text-xs text-gray-500">For: {habitTitle}</p>
        </div>
      )}

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              className="flex-1 text-amber-700 hover:bg-amber-100"
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              disabled={!editedVersion.trim() || isLoading}
              size="sm"
              onClick={handleAccept}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              className="flex-1 text-amber-700 hover:bg-amber-100"
              size="sm"
              variant="ghost"
              onClick={onDismiss}
            >
              Skip
            </Button>
            <Button
              className="flex-1 text-amber-700 hover:bg-amber-100"
              size="sm"
              variant="ghost"
              onClick={handleEdit}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              disabled={isLoading}
              size="sm"
              onClick={handleAccept}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Accept
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}

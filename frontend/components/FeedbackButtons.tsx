// Thumbs up/down feedback buttons for individual review comments
"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface Props {
  reviewId: number;
  commentId: number;
}

export default function FeedbackButtons({ reviewId, commentId }: Props) {
  const [sent, setSent] = useState<boolean | null>(null);

  async function submit(helpful: boolean) {
    try {
      await api.submitFeedback(reviewId, commentId, helpful);
      setSent(helpful);
    } catch {
      // silently fail
    }
  }

  if (sent !== null) {
    return (
      <span className="text-xs text-neutral-400">
        {sent ? "Marked helpful" : "Marked not helpful"}
      </span>
    );
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => submit(true)}
        className="text-xs px-2 py-0.5 border border-neutral-200 rounded hover:bg-neutral-50"
      >
        Helpful
      </button>
      <button
        onClick={() => submit(false)}
        className="text-xs px-2 py-0.5 border border-neutral-200 rounded hover:bg-neutral-50"
      >
        Not helpful
      </button>
    </div>
  );
}

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
      <span className={`text-xs inline-flex items-center gap-1 ${sent ? "text-emerald-600" : "text-neutral-400"}`}>
        {sent ? (
          <>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Marked helpful
          </>
        ) : (
          "Marked not helpful"
        )}
      </span>
    );
  }

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => submit(true)}
        className="text-xs px-2.5 py-1 border border-neutral-200 rounded-md hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
      >
        Helpful
      </button>
      <button
        onClick={() => submit(false)}
        className="text-xs px-2.5 py-1 border border-neutral-200 rounded-md hover:bg-neutral-100 hover:text-neutral-600"
      >
        Not helpful
      </button>
    </div>
  );
}

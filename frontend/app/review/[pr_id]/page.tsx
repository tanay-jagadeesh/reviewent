"use client";

import { useState, useEffect, use } from "react";
import { api, Review } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import DiffViewer from "@/components/DiffViewer";

export default function ReviewPage({ params }: { params: Promise<{ pr_id: string }> }) {
  const { pr_id } = use(params);
  const [review, setReview] = useState<Review | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getReview(Number(pr_id))
      .then(setReview)
      .catch(() => setError("Review not found"));
  }, [pr_id]);

  if (error) {
    return (
      <div className="text-center py-16">
        <svg className="w-10 h-10 mx-auto mb-3 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-400 py-16 justify-center">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading review...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <a href="/" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-accent-600 mb-3">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to dashboard
        </a>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-semibold">
            {review.owner}/{review.repo}#{review.pr_number}
          </h1>
          <StatusBadge status={review.status} />
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {review.comments.length} comment{review.comments.length !== 1 ? "s" : ""}
          </span>
          {review.created_at && (
            <span>{new Date(review.created_at).toLocaleString()}</span>
          )}
          <a
            href={review.pr_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-accent-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      <DiffViewer comments={review.comments} reviewId={review.id} />
    </div>
  );
}

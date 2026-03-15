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
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!review) {
    return <p className="text-sm text-neutral-500">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/" className="text-sm text-neutral-400 hover:text-neutral-600">
          &larr; Back
        </a>
        <h1 className="text-lg font-semibold">
          {review.owner}/{review.repo}#{review.pr_number}
        </h1>
        <StatusBadge status={review.status} />
      </div>

      <div className="flex gap-4 text-xs text-neutral-400 mb-6">
        <span>{review.comments.length} comments</span>
        {review.created_at && (
          <span>{new Date(review.created_at).toLocaleString()}</span>
        )}
        <a
          href={review.pr_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-600"
        >
          View on GitHub
        </a>
      </div>

      <DiffViewer comments={review.comments} reviewId={review.id} />
    </div>
  );
}

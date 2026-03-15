"use client";

import { useState, useEffect } from "react";
import { api, ReviewSummary } from "@/lib/api";
import PRCard from "@/components/PRCard";

export default function Dashboard() {
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [prUrl, setPrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getHistory()
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleTrigger(e: React.FormEvent) {
    e.preventDefault();
    if (!prUrl.trim()) return;
    setTriggering(true);
    try {
      await api.triggerReview(prUrl);
      setPrUrl("");
      const updated = await api.getHistory();
      setReviews(updated);
    } catch {
      alert("Failed to trigger review");
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1">Dashboard</h1>
        <p className="text-sm text-neutral-400">Submit a PR for review or browse past results.</p>
      </div>

      {/* Trigger review */}
      <form onSubmit={handleTrigger} className="flex gap-2 mb-10">
        <input
          type="text"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          placeholder="https://github.com/owner/repo/pull/123"
          className="flex-1 bg-surface-0 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-400"
        />
        <button
          type="submit"
          disabled={triggering}
          className="bg-accent-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-700 disabled:opacity-50 shadow-sm"
        >
          {triggering ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Reviewing...
            </span>
          ) : (
            "Review PR"
          )}
        </button>
      </form>

      {/* Review history */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Recent Reviews</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-neutral-400 py-8 justify-center">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <svg className="w-10 h-10 mx-auto mb-3 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No reviews yet. Paste a PR URL above to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((r) => (
              <PRCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
      <h1 className="text-lg font-semibold mb-6">Dashboard</h1>

      {/* Trigger review */}
      <form onSubmit={handleTrigger} className="flex gap-2 mb-8">
        <input
          type="text"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          placeholder="https://github.com/owner/repo/pull/123"
          className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
        />
        <button
          type="submit"
          disabled={triggering}
          className="bg-neutral-900 text-white px-4 py-2 rounded text-sm hover:bg-neutral-800 disabled:opacity-50"
        >
          {triggering ? "Reviewing..." : "Review"}
        </button>
      </form>

      {/* Review history */}
      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-neutral-500">No reviews yet. Trigger one above.</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => (
            <PRCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}

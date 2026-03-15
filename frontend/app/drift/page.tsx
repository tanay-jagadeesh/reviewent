"use client";

import { useState } from "react";
import { api, DriftData } from "@/lib/api";

const SEVERITY_STYLES: Record<string, string> = {
  critical: "text-red-700 bg-red-50",
  warning: "text-yellow-700 bg-yellow-50",
  suggestion: "text-blue-700 bg-blue-50",
  nitpick: "text-neutral-500 bg-neutral-100",
};

export default function DriftPage() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [drift, setDrift] = useState<DriftData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLoad(e: React.FormEvent) {
    e.preventDefault();
    if (!owner.trim() || !repo.trim()) return;
    setLoading(true);
    try {
      const data = await api.getDrift(owner, repo);
      setDrift(data);
    } catch {
      setDrift(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Review Drift</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Track which issue types keep recurring across PRs so teams can fix root causes.
      </p>

      <form onSubmit={handleLoad} className="flex gap-2 mb-8">
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="owner"
          className="border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 w-40"
        />
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="repo"
          className="border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 w-40"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-neutral-900 text-white px-4 py-2 rounded text-sm hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </form>

      {drift && (
        <div className="space-y-8">
          {/* Issue breakdown */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Issue Breakdown</h2>
            {drift.breakdown.length === 0 ? (
              <p className="text-sm text-neutral-400">No issues found.</p>
            ) : (
              <div className="space-y-1">
                {drift.breakdown.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${SEVERITY_STYLES[b.severity] || ""}`}
                    >
                      {b.severity}
                    </span>
                    <span className="text-neutral-600 w-24">{b.category}</span>
                    <div className="flex-1 h-5 bg-neutral-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-neutral-400 rounded"
                        style={{
                          width: `${Math.min(100, (b.count / Math.max(...drift.breakdown.map((x) => x.count))) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-neutral-400 w-8 text-right">{b.count}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Timeline */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Issues Over Time</h2>
            {drift.timeline.length === 0 ? (
              <p className="text-sm text-neutral-400">No reviews yet.</p>
            ) : (
              <div className="flex items-end gap-1 h-32">
                {drift.timeline.map((t) => {
                  const max = Math.max(...drift.timeline.map((x) => x.issue_count));
                  const height = max > 0 ? (t.issue_count / max) * 100 : 0;
                  return (
                    <div key={t.review_id} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-neutral-400">{t.issue_count}</span>
                      <div
                        className="w-full bg-neutral-300 rounded-t"
                        style={{ height: `${height}%`, minHeight: t.issue_count > 0 ? "4px" : "0" }}
                      />
                      <span className="text-[10px] text-neutral-400">#{t.pr_number}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Hot files */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Most Flagged Files</h2>
            {drift.hot_files.length === 0 ? (
              <p className="text-sm text-neutral-400">No files flagged.</p>
            ) : (
              <div className="space-y-1">
                {drift.hot_files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-neutral-600 font-mono text-xs flex-1 truncate">
                      {f.file}
                    </span>
                    <span className="text-neutral-400">{f.count} issues</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

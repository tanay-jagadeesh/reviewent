"use client";

import { useState } from "react";
import { api, DriftData } from "@/lib/api";

const SEVERITY_CONFIG: Record<string, { badge: string; bar: string }> = {
  critical: { badge: "text-red-700 bg-red-50", bar: "bg-red-400" },
  warning: { badge: "text-amber-700 bg-amber-50", bar: "bg-amber-400" },
  suggestion: { badge: "text-accent-700 bg-accent-50", bar: "bg-accent-400" },
  nitpick: { badge: "text-neutral-500 bg-neutral-100", bar: "bg-neutral-400" },
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
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1">Review Drift</h1>
        <p className="text-sm text-neutral-400">
          Track which issue types keep recurring across PRs so teams can fix root causes.
        </p>
      </div>

      <form onSubmit={handleLoad} className="flex gap-2 mb-10">
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="owner"
          className="bg-surface-0 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-400 w-44"
        />
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="repo"
          className="bg-surface-0 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-400 w-44"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-700 disabled:opacity-50 shadow-sm"
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </form>

      {drift && (
        <div className="space-y-10">
          {/* Issue breakdown */}
          <section className="bg-surface-0 border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Issue Breakdown</h2>
            {drift.breakdown.length === 0 ? (
              <p className="text-sm text-neutral-400">No issues found.</p>
            ) : (
              <div className="space-y-2.5">
                {drift.breakdown.map((b, i) => {
                  const config = SEVERITY_CONFIG[b.severity] || SEVERITY_CONFIG.nitpick;
                  const max = Math.max(...drift.breakdown.map((x) => x.count));
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full w-20 text-center ${config.badge}`}>
                        {b.severity}
                      </span>
                      <span className="text-neutral-600 w-28 truncate">{b.category}</span>
                      <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config.bar}`}
                          style={{
                            width: `${Math.min(100, (b.count / max) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-neutral-500 font-medium w-8 text-right">{b.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Timeline */}
          <section className="bg-surface-0 border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Issues Over Time</h2>
            {drift.timeline.length === 0 ? (
              <p className="text-sm text-neutral-400">No reviews yet.</p>
            ) : (
              <div className="flex items-end gap-1.5 h-36">
                {drift.timeline.map((t) => {
                  const max = Math.max(...drift.timeline.map((x) => x.issue_count));
                  const height = max > 0 ? (t.issue_count / max) * 100 : 0;
                  return (
                    <div key={t.review_id} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-neutral-400 font-medium">{t.issue_count}</span>
                      <div
                        className="w-full bg-accent-400 rounded-t-md hover:bg-accent-500"
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
          <section className="bg-surface-0 border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Most Flagged Files</h2>
            {drift.hot_files.length === 0 ? (
              <p className="text-sm text-neutral-400">No files flagged.</p>
            ) : (
              <div className="space-y-2">
                {drift.hot_files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-neutral-100 last:border-0">
                    <span className="text-xs text-neutral-300 w-5">{i + 1}.</span>
                    <svg className="w-3.5 h-3.5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-neutral-600 font-mono text-xs flex-1 truncate">
                      {f.file}
                    </span>
                    <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {f.count} issue{f.count !== 1 ? "s" : ""}
                    </span>
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

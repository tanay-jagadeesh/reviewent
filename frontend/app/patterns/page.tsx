"use client";

import { useState } from "react";
import { api, RepoPattern } from "@/lib/api";

export default function PatternsPage() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [patterns, setPatterns] = useState<RepoPattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function handleLoad(e: React.FormEvent) {
    e.preventDefault();
    if (!owner.trim() || !repo.trim()) return;
    setLoading(true);
    try {
      const data = await api.getPatterns(owner, repo);
      setPatterns(data);
      setLoaded(true);
    } catch {
      setPatterns([]);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    await api.deletePattern(id);
    setPatterns((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1">Codebase Patterns</h1>
        <p className="text-sm text-neutral-400">
          Conventions learned from past reviews. New code violating these patterns gets flagged automatically.
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

      {loaded && patterns.length === 0 && (
        <div className="text-center py-12 text-neutral-400">
          <svg className="w-10 h-10 mx-auto mb-3 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <p className="text-sm">No patterns learned yet. Patterns are discovered automatically as reviews run.</p>
        </div>
      )}

      {patterns.length > 0 && (
        <div className="space-y-2">
          {patterns.map((p) => (
            <div
              key={p.id}
              className="group bg-surface-0 border border-neutral-200 rounded-lg p-4 flex items-start gap-4 hover:border-neutral-300"
            >
              <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1.5 leading-relaxed">{p.pattern}</p>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                  <span className="bg-neutral-100 px-2 py-0.5 rounded">{p.category}</span>
                  {p.source_file && (
                    <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded">{p.source_file}</span>
                  )}
                  <span>seen {p.occurrences}x</span>
                  {p.last_seen_at && (
                    <span>{new Date(p.last_seen_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 px-2 py-1 rounded hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

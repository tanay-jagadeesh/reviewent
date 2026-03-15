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
      <h1 className="text-lg font-semibold mb-1">Codebase Patterns</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Conventions learned from past reviews. New code violating these patterns gets flagged automatically.
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

      {loaded && patterns.length === 0 && (
        <p className="text-sm text-neutral-400">
          No patterns learned yet. Patterns are discovered automatically as reviews run.
        </p>
      )}

      {patterns.length > 0 && (
        <div className="space-y-2">
          {patterns.map((p) => (
            <div
              key={p.id}
              className="border border-neutral-200 rounded p-4 flex items-start gap-4"
            >
              <div className="flex-1">
                <p className="text-sm mb-1">{p.pattern}</p>
                <div className="flex gap-3 text-xs text-neutral-400">
                  <span>{p.category}</span>
                  {p.source_file && (
                    <span className="font-mono">{p.source_file}</span>
                  )}
                  <span>seen {p.occurrences}x</span>
                  {p.last_seen_at && (
                    <span>{new Date(p.last_seen_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-neutral-400 hover:text-red-600"
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

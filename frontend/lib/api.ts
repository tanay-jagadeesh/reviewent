// Typed API client for the FastAPI backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ReviewComment {
  id: number;
  file: string;
  line: number;
  severity: string;
  category: string;
  comment: string;
  suggestion: string;
  reproduction: string | null;
}

export interface RepoPattern {
  id: number;
  pattern: string;
  category: string;
  source_file: string | null;
  occurrences: number;
  last_seen_at: string | null;
}

export interface DriftData {
  owner: string;
  repo: string;
  breakdown: { category: string; severity: string; count: number }[];
  timeline: { review_id: number; pr_number: number; created_at: string | null; issue_count: number }[];
  hot_files: { file: string; count: number }[];
}

export interface Review {
  id: number;
  pr_url: string;
  owner: string;
  repo: string;
  pr_number: number;
  status: string;
  created_at: string | null;
  comments: ReviewComment[];
}

export interface ReviewSummary {
  id: number;
  pr_url: string;
  status: string;
  created_at: string | null;
  completed_at: string | null;
  comment_count: number;
}

export interface Settings {
  model: string;
  custom_rules: string | null;
  severity_filter: string[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  triggerReview(pr_url: string) {
    return request<{ review_id: number; status: string }>("/reviews/trigger", {
      method: "POST",
      body: JSON.stringify({ pr_url }),
    });
  },

  getReview(id: number) {
    return request<Review>(`/reviews/${id}`);
  },

  getHistory() {
    return request<ReviewSummary[]>("/reviews/history");
  },

  submitFeedback(reviewId: number, commentId: number, helpful: boolean, note?: string) {
    return request<{ id: number; helpful: boolean }>(
      `/feedback/reviews/${reviewId}/comments/${commentId}`,
      {
        method: "POST",
        body: JSON.stringify({ helpful, note }),
      }
    );
  },

  getSettings() {
    return request<Settings>("/settings/");
  },

  updateSettings(settings: Partial<Settings>) {
    return request<Settings>("/settings/", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  getPatterns(owner: string, repo: string) {
    return request<RepoPattern[]>(`/patterns/${owner}/${repo}`);
  },

  deletePattern(patternId: number) {
    return request<{ ok: boolean }>(`/patterns/${patternId}`, {
      method: "DELETE",
    });
  },

  getDrift(owner: string, repo: string) {
    return request<DriftData>(`/drift/${owner}/${repo}`);
  },
};

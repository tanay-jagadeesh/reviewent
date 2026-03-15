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
};

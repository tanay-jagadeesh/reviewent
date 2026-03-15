// PR summary card — title, status, comment count, time ago
import { ReviewSummary } from "@/lib/api";
import StatusBadge from "./StatusBadge";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function prLabel(url: string): string {
  const parts = url.split("/");
  const owner = parts[3] || "";
  const repo = parts[4] || "";
  const num = parts[6] || "";
  return `${owner}/${repo}#${num}`;
}

export default function PRCard({ review }: { review: ReviewSummary }) {
  return (
    <a
      href={`/review/${review.id}`}
      className="group flex items-center justify-between bg-surface-0 border border-neutral-200 rounded-lg px-5 py-3.5 hover:border-accent-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <StatusBadge status={review.status} />
        <span className="text-sm font-medium group-hover:text-accent-700">
          {prLabel(review.pr_url)}
        </span>
        <span className="text-xs text-neutral-400">
          {review.comment_count} comment{review.comment_count !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-400">
          {timeAgo(review.completed_at ?? review.created_at)}
        </span>
        <svg
          className="w-3.5 h-3.5 text-neutral-300 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

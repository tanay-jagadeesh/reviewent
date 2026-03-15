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
  const repo = parts[4] || "";
  const num = parts[6] || "";
  return `${repo}#${num}`;
}

export default function PRCard({ review }: { review: ReviewSummary }) {
  return (
    <a
      href={`/review/${review.id}`}
      className="flex items-center justify-between border border-neutral-200 rounded px-4 py-3 hover:bg-neutral-50"
    >
      <div className="flex items-center gap-3">
        <StatusBadge status={review.status} />
        <span className="text-sm font-medium">{prLabel(review.pr_url)}</span>
        <span className="text-xs text-neutral-400">{review.comment_count} comments</span>
      </div>
      <span className="text-xs text-neutral-400">{timeAgo(review.created_at)}</span>
    </a>
  );
}

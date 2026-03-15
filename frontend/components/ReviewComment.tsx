// Single inline review comment with severity badge and suggestion
import { ReviewComment as ReviewCommentType } from "@/lib/api";
import FeedbackButtons from "./FeedbackButtons";

const SEVERITY_CONFIG: Record<string, { badge: string; border: string }> = {
  critical: { badge: "text-red-700 bg-red-50", border: "border-l-red-400" },
  warning: { badge: "text-amber-700 bg-amber-50", border: "border-l-amber-400" },
  suggestion: { badge: "text-accent-700 bg-accent-50", border: "border-l-accent-400" },
  nitpick: { badge: "text-neutral-500 bg-neutral-100", border: "border-l-neutral-300" },
};

interface Props {
  comment: ReviewCommentType;
  reviewId: number;
}

export default function ReviewComment({ comment, reviewId }: Props) {
  const config = SEVERITY_CONFIG[comment.severity] || SEVERITY_CONFIG.nitpick;

  return (
    <div className={`bg-surface-0 border border-neutral-200 rounded-lg p-4 border-l-3 ${config.border}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
          {comment.severity}
        </span>
        <span className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded">
          {comment.category}
        </span>
        <span className="text-xs text-neutral-400 font-mono ml-auto">
          {comment.file}:{comment.line}
        </span>
      </div>

      <p className="text-sm mb-3 leading-relaxed">{comment.comment}</p>

      {comment.reproduction && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400 mb-1">Why this breaks</p>
          <p className="text-sm text-red-900">{comment.reproduction}</p>
        </div>
      )}

      {comment.suggestion && (
        <div className="bg-accent-50 border border-accent-100 rounded-lg p-3 mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-500 mb-1">Suggestion</p>
          <p className="text-sm font-mono text-accent-900">{comment.suggestion}</p>
        </div>
      )}

      <FeedbackButtons reviewId={reviewId} commentId={comment.id} />
    </div>
  );
}

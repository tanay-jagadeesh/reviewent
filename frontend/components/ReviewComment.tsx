// Single inline review comment with severity badge and suggestion
import { ReviewComment as ReviewCommentType } from "@/lib/api";
import FeedbackButtons from "./FeedbackButtons";

const SEVERITY_STYLES: Record<string, string> = {
  critical: "text-red-700 bg-red-50",
  warning: "text-yellow-700 bg-yellow-50",
  suggestion: "text-blue-700 bg-blue-50",
  nitpick: "text-neutral-500 bg-neutral-100",
};

interface Props {
  comment: ReviewCommentType;
  reviewId: number;
}

export default function ReviewComment({ comment, reviewId }: Props) {
  const severityStyle = SEVERITY_STYLES[comment.severity] || SEVERITY_STYLES.nitpick;

  return (
    <div className="border border-neutral-200 rounded p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${severityStyle}`}>
          {comment.severity}
        </span>
        <span className="text-xs text-neutral-400">{comment.category}</span>
        <span className="text-xs text-neutral-400 ml-auto">
          {comment.file}:{comment.line}
        </span>
      </div>
      <p className="text-sm mb-2">{comment.comment}</p>
      {comment.suggestion && (
        <div className="bg-neutral-50 border border-neutral-200 rounded p-3 mb-2">
          <p className="text-xs text-neutral-500 mb-1">Suggestion</p>
          <p className="text-sm font-mono">{comment.suggestion}</p>
        </div>
      )}
      <FeedbackButtons reviewId={reviewId} commentId={comment.id} />
    </div>
  );
}

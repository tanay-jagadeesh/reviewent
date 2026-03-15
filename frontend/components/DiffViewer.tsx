// Diff viewer — shows file path and comments grouped by file
import { ReviewComment as ReviewCommentType } from "@/lib/api";
import ReviewComment from "./ReviewComment";

interface Props {
  comments: ReviewCommentType[];
  reviewId: number;
}

export default function DiffViewer({ comments, reviewId }: Props) {
  // Group comments by file
  const byFile: Record<string, ReviewCommentType[]> = {};
  for (const c of comments) {
    if (!byFile[c.file]) byFile[c.file] = [];
    byFile[c.file].push(c);
  }

  const files = Object.keys(byFile).sort();

  if (files.length === 0) {
    return <p className="text-sm text-neutral-500">No comments found.</p>;
  }

  return (
    <div className="space-y-6">
      {files.map((file) => (
        <div key={file}>
          <h3 className="text-sm font-mono text-neutral-600 mb-2 border-b border-neutral-200 pb-1">
            {file}
          </h3>
          <div className="space-y-2">
            {byFile[file]
              .sort((a, b) => a.line - b.line)
              .map((c) => (
                <ReviewComment key={c.id} comment={c} reviewId={reviewId} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

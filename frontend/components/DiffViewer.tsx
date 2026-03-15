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
    return (
      <div className="text-center py-12 text-neutral-400">
        <svg className="w-10 h-10 mx-auto mb-3 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No comments found. Looks clean!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {files.map((file) => (
        <div key={file}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-200">
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-sm font-mono text-neutral-600">{file}</h3>
            <span className="text-[11px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
              {byFile[file].length}
            </span>
          </div>
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

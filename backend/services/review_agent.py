# Core agentic loop — orchestrates the multi-step review pipeline
# 1. Fetch diff  2. Filter/chunk  3. Gather context  4. Review  5. Aggregate  6. Post

from backend.services.diff_parser import FileDiff
from backend.services.openai_service import review_file, ReviewComment

def run_review(raw_diff: str) -> list[ReviewComment]:

    file_diffs = FileDiff.parse_diff(raw_diff)

    all_comments = []
    for file_diff in file_diffs:
        comments = review_file(file_diff)
        all_comments.extend(comments)

    return all_comments

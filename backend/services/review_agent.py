# Core agentic loop — orchestrates the multi-step review pipeline
# 1. Fetch diff  2. Filter/chunk  3. Gather context  4. Review  5. Aggregate  6. Post

from backend.services.diff_parser import FileDiff
from backend.services.openai_service import review_file, ReviewComment
from backend.services.github_service import parse_pr_url, fetch_diff, post_review

def run_review(pr_url: str) -> list[ReviewComment]:

    
    owner, repo, pr_num = parse_pr_url(pr_url)
    raw_diff = fetch_diff(owner, repo, pr_num)

    file_diffs = FileDiff.parse_diff(raw_diff)

    all_comments = []
    for file_diff in file_diffs:
        comments = review_file(file_diff)
        all_comments.extend(comments)

    if all_comments:
        post_review(owner, repo, pr_num, all_comments)

    return all_comments

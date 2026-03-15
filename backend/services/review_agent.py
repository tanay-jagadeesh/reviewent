# Core agentic loop — orchestrates the multi-step review pipeline
# 1. Fetch diff  2. Filter/chunk  3. Load patterns  4. Review  5. Learn patterns  6. Post

from backend.services.diff_parser import FileDiff
from backend.services.openai_service import review_file, ReviewComment
from backend.services.github_service import parse_pr_url, fetch_diff, post_review
from backend.services.pattern_service import load_patterns, learn_patterns


def run_review(pr_url: str) -> list[ReviewComment]:

    owner, repo, pr_num = parse_pr_url(pr_url)
    raw_diff = fetch_diff(owner, repo, pr_num)

    file_diffs = FileDiff.parse_diff(raw_diff)

    # Load learned conventions for this repo
    repo_patterns = load_patterns(owner, repo)

    all_comments = []
    for file_diff in file_diffs:
        comments = review_file(file_diff, repo_patterns=repo_patterns)
        all_comments.extend(comments)

    # Learn new patterns from convention violations found in this review
    learn_patterns(owner, repo, all_comments)

    if all_comments:
        post_review(owner, repo, pr_num, all_comments)

    return all_comments

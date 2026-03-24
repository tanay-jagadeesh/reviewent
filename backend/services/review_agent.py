# Core review pipeline — orchestrates diff → LLM review → post
from backend.services.diff_parser import FileDiff
from backend.services.llm import review_file, ReviewComment
from backend.services.github_service import parse_pr_url, fetch_diff, post_review
from backend.services.pattern_service import load_patterns, learn_patterns


def run_review(pr_url: str, model: str | None = None, post_to_github: bool = False) -> list[ReviewComment]:
    owner, repo, pr_num = parse_pr_url(pr_url)
    raw_diff = fetch_diff(owner, repo, pr_num)
    file_diffs = FileDiff.parse_diff(raw_diff)

    repo_patterns = load_patterns(owner, repo)

    all_comments = []
    for file_diff in file_diffs:
        comments = review_file(file_diff, model=model, repo_patterns=repo_patterns)
        all_comments.extend(comments)

    learn_patterns(owner, repo, all_comments)

    if post_to_github and all_comments:
        post_review(owner, repo, pr_num, all_comments)

    return all_comments

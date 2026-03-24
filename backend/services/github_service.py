# GitHub API — fetch PR diffs, post inline review comments
import requests
from backend.config import load_config

API_URL = "https://api.github.com"


def _headers(accept: str = "application/vnd.github.v3+json") -> dict:
    config = load_config()
    token = config.get("github_token", "")
    h = {"Accept": accept}
    if token:
        h["Authorization"] = f"token {token}"
    return h


def parse_pr_url(pr_url: str) -> tuple[str, str, str]:
    parts = pr_url.rstrip("/").split("/")
    owner = parts[3]
    repo = parts[4]
    pr_num = parts[6]
    return owner, repo, pr_num


def fetch_diff(owner: str, repo: str, pr_num: str) -> str:
    api_url = f"{API_URL}/repos/{owner}/{repo}/pulls/{pr_num}"
    response = requests.get(url=api_url, headers=_headers("application/vnd.github.v3.diff"))
    response.raise_for_status()
    return response.text


def post_review(owner: str, repo: str, pr_num: str, comments: list) -> dict:
    api_url = f"{API_URL}/repos/{owner}/{repo}/pulls/{pr_num}/reviews"

    body = {
        "event": "COMMENT",
        "comments": [
            {
                "path": c.file,
                "line": c.line,
                "body": f"**[{c.severity}]** {c.category}: {c.comment}\n\n> Suggestion: {c.suggestion}",
            }
            for c in comments
        ],
    }

    response = requests.post(url=api_url, headers=_headers(), json=body)
    response.raise_for_status()
    return response.json()

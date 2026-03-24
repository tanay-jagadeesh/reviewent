# Agent tool — search the codebase for related code (callers, imports, usages)
import requests
from backend.config import load_config


def search_codebase(owner: str, repo: str, query: str) -> list[dict]:
    config = load_config()
    token = config.get("github_token", "")
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"token {token}"

    url = "https://api.github.com/search/code"
    params = {"q": f"{query} repo:{owner}/{repo}"}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return [{"error": f"Search failed: {response.status_code}"}]

    data = response.json()
    results = []
    for item in data.get("items", [])[:10]:
        results.append({
            "path": item["path"],
            "name": item["name"],
            "url": item["html_url"],
        })

    return results

# Agent tool — search the codebase for related code (callers, imports, usages)
import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

# Tool definition for Claude tool_use
TOOL_DEFINITION = {
    "name": "search_codebase",
    "description": "Search the repository for code matching a query. Use this to find callers of a changed function, usages of a modified type, or related imports.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query — function name, class name, import path, etc.",
            },
        },
        "required": ["query"],
    },
}


def search_codebase(owner: str, repo: str, query: str) -> list[dict]:
    url = "https://api.github.com/search/code"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }
    params = {"q": f"{query} repo:{owner}/{repo}"}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return [{"error": f"Search failed: {response.status_code}"}]

    data = response.json()
    results = []
    for item in data.get("items", [])[:10]:  # limit to 10 results
        results.append({
            "path": item["path"],
            "name": item["name"],
            "url": item["html_url"],
        })

    return results

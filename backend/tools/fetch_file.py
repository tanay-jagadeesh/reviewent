# Agent tool — fetch full file content from the repo at a given ref
import requests
from backend.config import load_config


def fetch_file_content(owner: str, repo: str, path: str, ref: str = "main") -> str:
    config = load_config()
    token = config.get("github_token", "")
    headers = {"Accept": "application/vnd.github.v3.raw"}
    if token:
        headers["Authorization"] = f"token {token}"

    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=headers, params={"ref": ref})

    if response.status_code == 404:
        return f"File not found: {path} at ref {ref}"
    if response.status_code != 200:
        return f"Error fetching file: {response.status_code}"

    return response.text

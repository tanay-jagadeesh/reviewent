# Agent tool — fetch full file content from the repo at a given ref
import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

# Tool definition for Claude tool_use
TOOL_DEFINITION = {
    "name": "fetch_file_content",
    "description": "Fetch the full content of a file from the repository at a specific git ref (branch, tag, or commit SHA). Use this to get surrounding context for a changed file.",
    "input_schema": {
        "type": "object",
        "properties": {
            "path": {
                "type": "string",
                "description": "File path relative to repo root (e.g. 'src/auth/login.py')",
            },
            "ref": {
                "type": "string",
                "description": "Git ref — branch name, tag, or commit SHA (e.g. 'main', 'HEAD')",
            },
        },
        "required": ["path", "ref"],
    },
}


def fetch_file_content(owner: str, repo: str, path: str, ref: str = "main") -> str:
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3.raw",
    }
    response = requests.get(url, headers=headers, params={"ref": ref})

    if response.status_code == 404:
        return f"File not found: {path} at ref {ref}"
    if response.status_code != 200:
        return f"Error fetching file: {response.status_code}"

    return response.text

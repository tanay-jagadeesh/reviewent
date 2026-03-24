# Agent tool — find and fetch the corresponding test file for a source file
import pathlib
import requests
from backend.config import load_config


def _guess_test_paths(source_path: str) -> list[str]:
    """Generate candidate test file paths from a source file path."""
    p = pathlib.PurePosixPath(source_path)
    name = p.stem
    ext = p.suffix
    parent = str(p.parent)

    candidates = [
        f"tests/{parent}/test_{name}{ext}" if parent != "." else f"tests/test_{name}{ext}",
        f"{parent}/test_{name}{ext}" if parent != "." else f"test_{name}{ext}",
        f"{parent}/{name}_test{ext}" if parent != "." else f"{name}_test{ext}",
        f"{parent}/__tests__/{name}.test{ext}" if parent != "." else f"__tests__/{name}.test{ext}",
    ]
    return candidates


def fetch_test_file(owner: str, repo: str, source_path: str, ref: str = "main") -> str:
    config = load_config()
    token = config.get("github_token", "")
    headers = {"Accept": "application/vnd.github.v3.raw"}
    if token:
        headers["Authorization"] = f"token {token}"

    for test_path in _guess_test_paths(source_path):
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{test_path}"
        response = requests.get(url, headers=headers, params={"ref": ref})
        if response.status_code == 200:
            return f"--- {test_path} ---\n{response.text}"

    return f"No test file found for {source_path}"

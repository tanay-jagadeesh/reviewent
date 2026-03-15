# Agent tool — find and fetch the corresponding test file for a source file
import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

# Tool definition for Claude tool_use
TOOL_DEFINITION = {
    "name": "fetch_test_file",
    "description": "Find and fetch the corresponding test file for a given source file. Searches common test directory patterns (tests/, __tests__/, test_*, *_test.*).",
    "input_schema": {
        "type": "object",
        "properties": {
            "source_path": {
                "type": "string",
                "description": "Path to the source file (e.g. 'src/auth/login.py')",
            },
        },
        "required": ["source_path"],
    },
}


def _guess_test_paths(source_path: str) -> list[str]:
    """Generate candidate test file paths from a source file path."""
    import pathlib

    p = pathlib.PurePosixPath(source_path)
    name = p.stem
    ext = p.suffix
    parent = str(p.parent)

    candidates = [
        # tests/ mirror: src/foo/bar.py -> tests/foo/test_bar.py
        f"tests/{parent}/test_{name}{ext}" if parent != "." else f"tests/test_{name}{ext}",
        # test_ prefix in same dir: src/foo/bar.py -> src/foo/test_bar.py
        f"{parent}/test_{name}{ext}" if parent != "." else f"test_{name}{ext}",
        # _test suffix: src/foo/bar.py -> src/foo/bar_test.py
        f"{parent}/{name}_test{ext}" if parent != "." else f"{name}_test{ext}",
        # __tests__ dir (JS/TS): src/foo/bar.ts -> src/foo/__tests__/bar.test.ts
        f"{parent}/__tests__/{name}.test{ext}" if parent != "." else f"__tests__/{name}.test{ext}",
    ]
    return candidates


def fetch_test_file(owner: str, repo: str, source_path: str, ref: str = "main") -> str:
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3.raw",
    }

    for test_path in _guess_test_paths(source_path):
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{test_path}"
        response = requests.get(url, headers=headers, params={"ref": ref})
        if response.status_code == 200:
            return f"--- {test_path} ---\n{response.text}"

    return f"No test file found for {source_path}"

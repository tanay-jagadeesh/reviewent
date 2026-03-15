# Smart context gathering — fetch related files, find tests, resolve imports
from backend.tools.fetch_file import fetch_file_content
from backend.tools.fetch_tests import fetch_test_file
from backend.services.diff_parser import FileDiff

# Files that get deeper review (security-critical)
HIGH_RISK_PATTERNS = [
    "auth", "login", "password", "token", "secret", "crypto",
    "payment", "billing", "admin", "permission", "middleware",
]


def is_high_risk(filename: str) -> bool:
    lower = filename.lower()
    return any(pattern in lower for pattern in HIGH_RISK_PATTERNS)


def gather_context(owner: str, repo: str, file_diff: FileDiff, ref: str = "main") -> dict:
    """Gather surrounding context for a file diff to give the reviewer more information."""
    context = {
        "filename": file_diff.filename,
        "change_type": file_diff.change_type,
        "high_risk": is_high_risk(file_diff.filename),
        "full_file": None,
        "test_file": None,
    }

    # Fetch the full file content for context (skip for deleted files)
    if file_diff.change_type != "deleted":
        context["full_file"] = fetch_file_content(owner, repo, file_diff.filename, ref)

    # Try to find corresponding test file
    if file_diff.change_type != "deleted":
        test_content = fetch_test_file(owner, repo, file_diff.filename, ref)
        if not test_content.startswith("No test file found"):
            context["test_file"] = test_content

    return context


def should_skip_file(filename: str) -> bool:
    """Check if a file should be skipped entirely (auto-generated, migrations, etc.)."""
    skip_patterns = [
        "migrations/", "generated/", "__generated__",
        ".pb.go", ".lock", "dist/", "build/",
        ".min.js", ".min.css", ".map",
    ]
    lower = filename.lower()
    return any(pattern in lower for pattern in skip_patterns)

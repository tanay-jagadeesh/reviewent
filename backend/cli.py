"""cr — AI code reviewer CLI.

Usage:
    cr review <pr_url>          Review a GitHub pull request
    cr diff                     Review local uncommitted changes
    cr diff --staged             Review only staged changes
    cr config                   Show current configuration
    cr config set <key> <value> Update a config value
"""

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.rule import Rule
from rich.padding import Padding
from rich import box

console = Console()

SEVERITY_STYLES = {
    "critical": ("bold red", "CRIT"),
    "warning": ("bold yellow", "WARN"),
    "suggestion": ("bold blue", "SUGG"),
    "nitpick": ("dim", "NIT "),
}

CATEGORY_STYLES = {
    "security": "red",
    "bug": "yellow",
    "performance": "magenta",
    "style": "dim",
    "logic": "cyan",
    "convention": "blue",
}


def _render_comments(comments: list, file_path_prefix: str = "") -> None:
    """Render review comments to the terminal with rich formatting."""
    if not comments:
        console.print()
        console.print("[green]No issues found. Code looks clean.[/green]")
        return

    # Group by file
    by_file: dict[str, list] = {}
    for c in comments:
        f = c.file if hasattr(c, "file") else c["file"]
        by_file.setdefault(f, []).append(c)

    # Count severities for summary
    counts: dict[str, int] = {}
    for c in comments:
        sev = c.severity if hasattr(c, "severity") else c["severity"]
        counts[sev] = counts.get(sev, 0) + 1

    # Summary line
    parts = []
    for sev in ["critical", "warning", "suggestion", "nitpick"]:
        if sev in counts:
            style, label = SEVERITY_STYLES[sev]
            parts.append(f"[{style}]{counts[sev]} {sev}[/{style}]")
    summary = "  ".join(parts)
    console.print()
    console.print(f"  Found {len(comments)} issue{'s' if len(comments) != 1 else ''}:  {summary}")
    console.print()

    for filename in sorted(by_file.keys()):
        file_comments = sorted(by_file[filename], key=lambda c: c.line if hasattr(c, "line") else c["line"])

        console.print(Rule(f"[bold]{filename}[/bold]", style="dim"))
        console.print()

        for c in file_comments:
            # Normalize access (works with both Pydantic models and dicts)
            line = c.line if hasattr(c, "line") else c["line"]
            sev = c.severity if hasattr(c, "severity") else c["severity"]
            cat = c.category if hasattr(c, "category") else c["category"]
            comment = c.comment if hasattr(c, "comment") else c["comment"]
            suggestion = c.suggestion if hasattr(c, "suggestion") else c["suggestion"]
            reproduction = (c.reproduction if hasattr(c, "reproduction") else c.get("reproduction")) if hasattr(c, "reproduction") or isinstance(c, dict) else None

            sev_style, sev_label = SEVERITY_STYLES.get(sev, ("dim", sev.upper()[:4]))
            cat_style = CATEGORY_STYLES.get(cat, "dim")

            # Header: severity + category + location
            header = Text()
            header.append(f"  {sev_label}", style=sev_style)
            header.append(f"  {cat}", style=cat_style)
            header.append(f"  L{line}", style="dim")
            console.print(header)

            # Comment body
            console.print(f"    {comment}")

            # Reproduction (why it breaks)
            if reproduction:
                console.print(f"    [dim italic]Why: {reproduction}[/dim italic]")

            # Suggestion
            if suggestion:
                console.print(f"    [green]Fix: {suggestion}[/green]")

            console.print()


@click.group()
@click.version_option(version="0.1.0", prog_name="cr")
def main():
    """AI code reviewer — catch issues before human review."""
    pass


@main.command()
@click.argument("pr_url")
@click.option("--post/--no-post", default=False, help="Post comments to GitHub (default: just print)")
@click.option("--model", default=None, help="Override model (e.g. gpt-4o, claude-sonnet-4-20250514)")
def review(pr_url: str, post: bool, model: str | None):
    """Review a GitHub pull request."""
    from backend.config import load_config
    from backend.services.github_service import parse_pr_url, fetch_diff
    from backend.services.diff_parser import FileDiff
    from backend.services.llm import review_file
    from backend.services.pattern_service import load_patterns

    config = load_config()
    owner, repo, pr_num = parse_pr_url(pr_url)

    console.print(f"  [bold]Reviewing[/bold] {owner}/{repo}#{pr_num}")
    console.print()

    with console.status("[dim]Fetching diff from GitHub...[/dim]"):
        raw_diff = fetch_diff(owner, repo, pr_num)
        file_diffs = FileDiff.parse_diff(raw_diff)

    if not file_diffs:
        console.print("[yellow]  No reviewable files in this PR.[/yellow]")
        return

    console.print(f"  [dim]{len(file_diffs)} file{'s' if len(file_diffs) != 1 else ''} to review[/dim]")
    console.print()

    use_model = model or config.get("model", "gpt-4o")
    repo_patterns = load_patterns(owner, repo)

    all_comments = []
    for i, fd in enumerate(file_diffs, 1):
        console.print(f"  [dim][{i}/{len(file_diffs)}][/dim] {fd.filename}")
        try:
            comments = review_file(fd, model=use_model, repo_patterns=repo_patterns)
            all_comments.extend(comments)
        except RuntimeError as e:
            console.print(f"\n  [red]{e}[/red]")
            raise SystemExit(1)

    _render_comments(all_comments)

    if post and all_comments:
        from backend.services.github_service import post_review as gh_post
        with console.status("[dim]Posting review to GitHub...[/dim]"):
            gh_post(owner, repo, pr_num, all_comments)
        console.print("[green]  Review posted to GitHub.[/green]")


@main.command()
@click.option("--staged", is_flag=True, help="Only review staged changes")
@click.option("--model", default=None, help="Override model")
def diff(staged: bool, model: str | None):
    """Review local uncommitted changes."""
    import subprocess
    from backend.config import load_config
    from backend.services.diff_parser import FileDiff
    from backend.services.llm import review_file

    config = load_config()

    cmd = ["git", "diff", "--staged"] if staged else ["git", "diff", "HEAD"]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        console.print("[red]  Not a git repository or git not available.[/red]")
        raise SystemExit(1)

    raw_diff = result.stdout
    if not raw_diff.strip():
        label = "staged" if staged else "uncommitted"
        console.print(f"[yellow]  No {label} changes to review.[/yellow]")
        return

    file_diffs = FileDiff.parse_diff(raw_diff)
    if not file_diffs:
        console.print("[yellow]  No reviewable files changed.[/yellow]")
        return

    console.print(f"  [bold]Reviewing local {'staged' if staged else 'uncommitted'} changes[/bold]")
    console.print(f"  [dim]{len(file_diffs)} file{'s' if len(file_diffs) != 1 else ''}[/dim]")
    console.print()

    use_model = model or config.get("model", "gpt-4o")

    all_comments = []
    for i, fd in enumerate(file_diffs, 1):
        console.print(f"  [dim][{i}/{len(file_diffs)}][/dim] {fd.filename}")
        try:
            comments = review_file(fd, model=use_model)
            all_comments.extend(comments)
        except RuntimeError as e:
            console.print(f"\n  [red]{e}[/red]")
            raise SystemExit(1)

    _render_comments(all_comments)


@main.command()
@click.argument("action", required=False, default="show")
@click.argument("key", required=False)
@click.argument("value", required=False)
def config(action: str, key: str | None, value: str | None):
    """Show or update configuration.

    \b
    cr config              Show current config
    cr config set model gpt-4o
    cr config set github_token ghp_xxx
    """
    from backend.config import load_config, save_config, CONFIG_PATH

    cfg = load_config()

    if action == "show" or (action != "set"):
        console.print()
        console.print(f"  [dim]Config:[/dim] {CONFIG_PATH}")
        console.print()
        table = Table(box=box.SIMPLE, show_header=False, padding=(0, 2))
        table.add_column(style="bold")
        table.add_column()
        for k, v in cfg.items():
            display = "••••••••" if "key" in k.lower() or "token" in k.lower() else str(v)
            table.add_row(k, display)
        console.print(Padding(table, (0, 2)))
        return

    if action == "set" and key and value:
        cfg[key] = value
        save_config(cfg)
        display = "••••••••" if "key" in key.lower() or "token" in key.lower() else value
        console.print(f"  [green]Set {key} = {display}[/green]")
    else:
        console.print("[red]  Usage: cr config set <key> <value>[/red]")


if __name__ == "__main__":
    main()

"""Unified LLM service — supports OpenAI and Anthropic models."""

import json
from pathlib import Path
from pydantic import BaseModel
from backend.services.diff_parser import FileDiff
from backend.config import load_config


class ReviewComment(BaseModel):
    file: str
    line: int
    severity: str
    category: str
    comment: str
    suggestion: str
    reproduction: str | None = None


def _load_system_prompt() -> str:
    # Try multiple locations for the prompt file
    candidates = [
        Path("prompts/system.md"),
        Path(__file__).parent.parent.parent / "prompts" / "system.md",
    ]
    for p in candidates:
        if p.exists():
            return p.read_text()
    raise FileNotFoundError("Could not find prompts/system.md")


def _build_user_message(file_diff: FileDiff, repo_patterns: list[dict] | None = None, custom_rules: str | None = None) -> str:
    msg = f"""Review this diff for {file_diff.filename}:

Changed lines: {file_diff.changed_lines}
Change type: {file_diff.change_type}

Diff:
{file_diff.diff_content}"""

    if repo_patterns:
        patterns_text = "\n".join(
            f"- [{p['category']}] {p['pattern']}" for p in repo_patterns
        )
        msg += f"""

This repository has the following established conventions. Flag violations of these patterns:
{patterns_text}"""

    if custom_rules:
        msg += f"""

Additional rules to enforce:
{custom_rules}"""

    return msg


def _parse_response(raw: str) -> list[ReviewComment]:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]
        raw = raw.rsplit("```", 1)[0]
    comments = json.loads(raw)
    return [ReviewComment(**c) for c in comments]


def _is_anthropic_model(model: str) -> bool:
    return "claude" in model.lower()


def _call_openai(model: str, system_prompt: str, user_message: str, api_key: str) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0,
    )
    return response.choices[0].message.content


def _call_anthropic(model: str, system_prompt: str, user_message: str, api_key: str) -> str:
    from anthropic import Anthropic
    client = Anthropic(api_key=api_key)
    response = client.messages.create(
        model=model,
        max_tokens=4096,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
        temperature=0,
    )
    return response.content[0].text


def review_file(
    file_diff: FileDiff,
    model: str | None = None,
    repo_patterns: list[dict] | None = None,
    custom_rules: str | None = None,
) -> list[ReviewComment]:
    """Review a single file diff using the configured LLM."""
    config = load_config()
    model = model or config.get("model", "gpt-4o")
    custom_rules = custom_rules or config.get("custom_rules") or None

    system_prompt = _load_system_prompt()
    user_message = _build_user_message(file_diff, repo_patterns, custom_rules)

    if _is_anthropic_model(model):
        api_key = config.get("anthropic_api_key", "")
        if not api_key:
            raise RuntimeError("No Anthropic API key. Run: cr config set anthropic_api_key <key>")
        raw = _call_anthropic(model, system_prompt, user_message, api_key)
    else:
        api_key = config.get("openai_api_key", "")
        if not api_key:
            raise RuntimeError("No OpenAI API key. Run: cr config set openai_api_key <key>")
        raw = _call_openai(model, system_prompt, user_message, api_key)

    return _parse_response(raw)

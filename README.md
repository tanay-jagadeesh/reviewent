# cr-agent

AI code reviewer — review GitHub PRs and local diffs from your terminal.

```bash
pip install cr-agent
```

## Quick start

```bash
# Set your API key
cr config set openai_api_key sk-...

# Review a GitHub PR
cr review https://github.com/owner/repo/pull/123

# Review your local uncommitted changes
cr diff

# Review only staged changes (great for pre-commit hooks)
cr diff --staged
```

## Commands

### `cr review <pr_url>`

Review a GitHub pull request. Fetches the diff, runs each changed file through an LLM, and prints inline comments with severity, category, and fix suggestions.

```bash
cr review https://github.com/owner/repo/pull/42

# Also post comments directly to GitHub
cr review https://github.com/owner/repo/pull/42 --post

# Override the model for a single run
cr review https://github.com/owner/repo/pull/42 --model claude-sonnet-4-20250514
```

### `cr diff`

Review local uncommitted changes — no GitHub required. Runs `git diff HEAD` and reviews the output.

```bash
cr diff

# Only review staged changes
cr diff --staged

# Use a specific model
cr diff --model gpt-4o-mini
```

### `cr config`

Manage configuration stored at `~/.cr/config.toml`. Environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `CR_MODEL`) override the config file.

```bash
# Show current config (keys are masked)
cr config

# Set values
cr config set openai_api_key sk-...
cr config set anthropic_api_key sk-ant-...
cr config set github_token ghp_...
cr config set model claude-sonnet-4-20250514
cr config set custom_rules "Always flag SQL queries that don't use parameterized inputs"
```

## How it works

1. Fetches the PR diff (or runs `git diff` locally)
2. Parses into per-file chunks, filtering noise (lockfiles, images, generated code)
3. Loads any learned conventions for the repository
4. Sends each file to the LLM for structured review
5. Returns comments with severity, category, fix suggestions, and reproduction scenarios

### Review output

Each comment includes:

```
  CRIT  security  L42
    Password compared with == instead of constant-time comparison
    Why: Attacker can measure response times to determine correct password characters
    Fix: Use hmac.compare_digest() to prevent timing attacks
```

**Severity levels**: `critical`, `warning`, `suggestion`, `nitpick`

**Categories**: `security`, `bug`, `performance`, `style`, `logic`, `convention`

Critical and warning issues include a `reproduction` field — a concrete scenario describing what triggers the bug.

## Supported models

Works with both OpenAI and Anthropic. The provider is detected from the model name.

| Provider | Models | Config key |
|----------|--------|------------|
| OpenAI | `gpt-4o`, `gpt-4o-mini`, etc. | `openai_api_key` |
| Anthropic | `claude-sonnet-4-20250514`, `claude-opus-4-20250514`, etc. | `anthropic_api_key` |

## Web dashboard (optional)

The repo also includes a Next.js dashboard for browsing reviews, tracking drift, and managing patterns. To use it:

```bash
# Install with server dependencies
pip install -e ".[server]"

# Run backend
python -m uvicorn backend.main:app --reload

# Run frontend
cd frontend && npm install && npm run dev
```

### Dashboard features

- **Review history** — Browse past reviews, click into any PR to see inline comments grouped by file
- **Review drift** — Track recurring issue types across PRs with severity breakdowns, timelines, and most-flagged files
- **Codebase patterns** — View conventions the agent has learned from past reviews
- **Settings** — Configure model, custom rules, and severity filters

### API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/reviews/trigger` | Trigger a review. Body: `{"pr_url": "..."}` |
| `GET` | `/reviews/history` | List past reviews with comment counts |
| `GET` | `/reviews/{id}` | Get review with all comments |
| `POST` | `/webhooks/github` | GitHub webhook receiver (auto-reviews on PR open/push) |
| `POST` | `/feedback/reviews/{rid}/comments/{cid}` | Submit feedback: `{"helpful": true}` |
| `GET` | `/patterns/{owner}/{repo}` | List learned conventions |
| `GET` | `/drift/{owner}/{repo}` | Issue breakdown, timeline, hot files |
| `GET/PUT` | `/settings/` | Read/update settings |

## GitHub webhook setup

For automatic reviews on every PR:

1. Go to **Settings > Webhooks > Add webhook** in your GitHub repo
2. Payload URL: `https://your-domain/webhooks/github`
3. Content type: `application/json`
4. Secret: match your `GITHUB_WEBHOOK_SECRET` env var
5. Events: select "Pull requests"

## Tech stack

**CLI**: Python, Click, Rich, OpenAI SDK, Anthropic SDK

**Backend** (optional): FastAPI, SQLAlchemy, SQLite

**Frontend** (optional): Next.js 15, React 19, TypeScript, Tailwind CSS 4

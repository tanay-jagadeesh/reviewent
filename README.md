# Code Review Agent

An AI-powered code review agent that automatically reviews pull requests, learns your codebase's conventions, and tracks recurring issues over time.

## What it does

When a pull request is opened or updated, the agent:

1. Fetches the PR diff from GitHub
2. Parses it into per-file chunks, filtering out noise (lockfiles, generated code, images)
3. Loads any learned conventions for the repository
4. Sends each file to Claude for structured analysis
5. Returns comments with severity, category, fix suggestions, and reproduction scenarios
6. Posts inline review comments back to the PR on GitHub
7. Learns new codebase patterns from convention violations it finds

### Key features

- **Learns your codebase's patterns** -- Flags when new code violates conventions specific to your repo. Patterns are discovered automatically from past reviews and stored per-repository. Each subsequent review gets smarter as the pattern library grows.

- **Tracks review drift** -- Aggregates recurring issue categories across PRs over time. Shows a breakdown by category/severity, a timeline of issues per PR, and the most-flagged files -- so teams can identify and fix root causes instead of patching symptoms.

- **Explains why something will break** -- Every critical and warning issue includes a `reproduction` field: a concrete scenario describing what input, state, or sequence of actions triggers the bug. Not just "this might be a bug" but "call POST /users with email=null and this will throw a 500."

- **Feedback loop** -- Thumbs up/down on every comment. Feedback is stored and can be used to tune review quality over time.

## Architecture

```
backend/                        # Python FastAPI
  main.py                       # App entrypoint, CORS, router registration
  models/
    review.py                   # Review + ReviewComment tables
    feedback.py                 # CommentFeedback (thumbs up/down)
    user.py                     # User + UserSettings
    pattern.py                  # CodebasePattern (learned conventions)
  routers/
    reviews.py                  # POST /trigger, GET /{id}, GET /history
    webhooks.py                 # POST /webhooks/github
    auth.py                     # GitHub OAuth flow
    feedback.py                 # POST feedback, GET stats
    settings.py                 # GET/PUT user settings
    patterns.py                 # GET/DELETE codebase patterns
    drift.py                    # GET review drift analytics
  services/
    review_agent.py             # Core pipeline orchestrator
    openai_service.py           # Claude API calls, structured output
    github_service.py           # GitHub API (diffs, post comments)
    diff_parser.py              # Unified diff parsing
    context_service.py          # Full file + test file context
    pattern_service.py          # Load/learn repo conventions
  tools/
    fetch_file.py               # fetch_file_content tool
    fetch_tests.py              # fetch_test_file tool
    search_code.py              # search_codebase tool
  db/
    database.py                 # Async SQLAlchemy engine + auto-migration

frontend/                       # Next.js 15 + React 19
  app/
    page.tsx                    # Dashboard (review list, trigger form)
    review/[pr_id]/page.tsx     # Review detail with inline comments
    drift/page.tsx              # Review drift analytics
    patterns/page.tsx           # Learned codebase patterns
    settings/page.tsx           # Model, rules, severity filters
  components/
    PRCard.tsx                  # Review summary card
    DiffViewer.tsx              # Comments grouped by file
    ReviewComment.tsx           # Single comment with reproduction + suggestion
    FeedbackButtons.tsx         # Thumbs up/down
    StatusBadge.tsx             # Status indicator
  lib/
    api.ts                      # Typed API client

prompts/
  system.md                     # System prompt for Claude
```

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- A GitHub personal access token with `repo` scope
- An OpenAI API key (for Claude via OpenAI-compatible API)

### 1. Clone and configure

```bash
git clone <repo-url>
cd code-review-agent
```

Create a `.env` file in the project root:

```
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
DATABASE_URL=sqlite+aiosqlite:///./reviews.db
```

Optional variables for webhook and OAuth support:

```
GITHUB_WEBHOOK_SECRET=your-webhook-secret
GITHUB_CLIENT_ID=your-oauth-client-id
GITHUB_CLIENT_SECRET=your-oauth-client-secret
FRONTEND_URL=http://localhost:3000
```

### 2. Install dependencies

```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### 3. Run

```bash
# Terminal 1 — backend
python -m uvicorn backend.main:app --reload

# Terminal 2 — frontend
cd frontend
npm run dev
```

The backend runs on `http://localhost:8000`, the frontend on `http://localhost:3000`.

## API reference

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/reviews/trigger` | Trigger a review for a PR URL. Body: `{"pr_url": "https://github.com/owner/repo/pull/123"}` |
| `GET` | `/reviews/history` | List all past reviews with comment counts |
| `GET` | `/reviews/{review_id}` | Get a single review with all comments |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/webhooks/github` | GitHub webhook receiver. Triggers review on `pull_request` events (`opened`, `synchronize`) |

### Feedback

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/feedback/reviews/{review_id}/comments/{comment_id}` | Submit feedback. Body: `{"helpful": true, "note": "optional"}` |
| `GET` | `/feedback/reviews/{review_id}/stats` | Get feedback stats for a review |

### Patterns

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/patterns/{owner}/{repo}` | List learned conventions for a repo |
| `DELETE` | `/patterns/{pattern_id}` | Remove a pattern |

### Drift

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/drift/{owner}/{repo}` | Get issue breakdown, timeline, and hot files for a repo |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/settings/` | Get current settings |
| `PUT` | `/settings/` | Update settings. Body: `{"model": "gpt-4o", "custom_rules": "...", "severity_filter": ["critical", "warning"]}` |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth/github` | Start GitHub OAuth flow |
| `GET` | `/auth/github/callback` | OAuth callback (exchanges code for token) |

## Review output format

Each review comment includes:

```json
{
  "file": "src/auth.py",
  "line": 42,
  "severity": "critical",
  "category": "security",
  "comment": "Password compared with == instead of constant-time comparison",
  "suggestion": "Use hmac.compare_digest() to prevent timing attacks",
  "reproduction": "An attacker can measure response times for /login to determine correct password characters one by one via timing side-channel"
}
```

**Severity levels**: `critical`, `warning`, `suggestion`, `nitpick`

**Categories**: `security`, `bug`, `performance`, `style`, `logic`, `convention`

The `reproduction` field is populated for `critical` and `warning` issues and describes a specific scenario that triggers the problem.

## GitHub webhook setup

To get automatic reviews on every PR:

1. In your GitHub repo, go to **Settings > Webhooks > Add webhook**
2. Set the payload URL to `https://your-domain/webhooks/github`
3. Set content type to `application/json`
4. Set the secret to match your `GITHUB_WEBHOOK_SECRET` env var
5. Select "Pull requests" as the event trigger

## Database

Uses SQLite by default via async SQLAlchemy. The database is created automatically on first startup. Schema migrations (new columns) are applied automatically on each startup -- no manual migration steps needed.

Tables: `reviews`, `comments`, `feedback`, `users`, `user_settings`, `codebase_patterns`

## Tech stack

**Backend**: Python, FastAPI, SQLAlchemy (async), SQLite, OpenAI SDK

**Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4

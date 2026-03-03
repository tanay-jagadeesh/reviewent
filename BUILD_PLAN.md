# AI Code Review Agent — Build Plan

## Why This Project

Demonstrate core agentic AI competencies: autonomous multi-step reasoning, tool use, structured output, event-driven architecture, and evaluation — the same patterns needed to build healthcare AI agents at Wedge.

---

## Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js + Tailwind CSS | Fast to build, good DX |
| Backend | FastAPI | Async-native, Pydantic validation, great for AI workloads |
| AI | Claude API (Sonnet for speed, Opus for complex reviews) | Tool use + structured output support |
| GitHub | PyGithub + GitHub REST API | PR diffs, inline comments, webhooks |
| Auth | GitHub OAuth | Users connect their repos |
| DB | PostgreSQL (SQLite for local dev) | Store reviews, comments, metrics |
| Queue | Redis + Celery (or arq) | Background review jobs — don't block the webhook |

---

## Architecture

```
GitHub PR Event
       │
       ▼
  Webhook Server (FastAPI)
       │
       ▼
  Task Queue (background job)
       │
       ▼
  ┌─── Review Agent Loop ───┐
  │                          │
  │  1. Fetch full diff      │  ← github_service
  │  2. Filter & chunk       │  ← skip lockfiles, chunk by file
  │  3. Gather context       │  ← fetch full file, find related files
  │  4. Review each chunk    │  ← claude_service (tool use)
  │  5. Aggregate & dedup    │  ← rank by severity, remove dupes
  │  6. Post to GitHub       │  ← inline review comments
  │  7. Store results        │  ← DB for dashboard + metrics
  │                          │
  └──────────────────────────┘
```

---

## What Makes This "Agentic" (Not Just an LLM Wrapper)

This is the part that matters. A wrapper just sends a diff to Claude and posts the response. An agent does this:

### 1. Multi-Step Reasoning Loop
The agent doesn't make one LLM call. It:
- Analyzes the PR description to understand intent
- Decides which files need deep review vs. a skim
- For complex files, fetches surrounding context (imports, tests, related modules)
- Reviews each chunk with file-specific instructions
- Cross-references findings across files (e.g., "you changed the API but didn't update the tests")

### 2. Tool Use
The agent has tools it can call during the review:
- `fetch_file_content(path, ref)` — get the full file (not just the diff)
- `search_codebase(query)` — find related code (e.g., other callers of a changed function)
- `fetch_test_file(source_path)` — find the corresponding test file
- `check_type_definitions(type_name)` — look up type/interface definitions
- `get_pr_description()` — understand what the PR is trying to do

Claude decides *when* to call these tools based on what it sees in the diff. This is real agentic tool use.

### 3. Structured, Reliable Output
Every review comment follows a strict schema:
```json
{
  "file": "src/auth/login.py",
  "line": 42,
  "severity": "critical" | "warning" | "suggestion" | "nitpick",
  "category": "security" | "bug" | "performance" | "style" | "logic",
  "comment": "SQL injection vulnerability — user input is interpolated directly into query",
  "suggestion": "Use parameterized queries: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))"
}
```

### 4. Context-Aware Intelligence
- Reads PR description to understand *intent*, not just *code*
- Skips auto-generated files (lockfiles, migrations, build output)
- Adjusts review depth based on file type (security-critical files get deeper review)
- Cross-file analysis: detects when a change in one file breaks assumptions in another

### 5. Feedback Loop (Agent Self-Improvement)
- Users can thumbs-up/down individual comments
- Feedback is stored and used to refine prompts over time
- Track precision (% of comments that were useful) as the core metric

---

## File Structure

```
/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard — repos + recent reviews
│   │   ├── review/[pr_id]/page.tsx     # PR review detail page
│   │   └── settings/page.tsx           # Model selection, custom rules, filters
│   ├── components/
│   │   ├── PRCard.tsx                  # PR summary card
│   │   ├── ReviewComment.tsx           # Inline comment with severity badge
│   │   ├── DiffViewer.tsx              # Side-by-side diff with overlaid comments
│   │   ├── StatusBadge.tsx             # Approved / Changes Requested / Pending
│   │   └── FeedbackButtons.tsx         # Thumbs up/down on each comment
│   └── lib/
│       └── api.ts                      # Typed API client for FastAPI backend
│
├── backend/
│   ├── main.py                         # FastAPI app + CORS + lifespan
│   ├── routers/
│   │   ├── auth.py                     # GitHub OAuth flow
│   │   ├── webhooks.py                 # GitHub webhook receiver
│   │   ├── reviews.py                  # Trigger/fetch/list reviews
│   │   ├── feedback.py                 # Accept thumbs up/down on comments
│   │   └── settings.py                 # User config CRUD
│   ├── services/
│   │   ├── github_service.py           # Fetch diffs, post comments, verify webhooks
│   │   ├── review_agent.py             # Core agentic loop — orchestrates everything
│   │   ├── claude_service.py           # Claude API + tool definitions + prompt caching
│   │   ├── context_service.py          # Smart context gathering (related files, tests)
│   │   └── diff_parser.py              # Parse unified diffs, chunk by file, filter noise
│   ├── models/
│   │   ├── review.py                   # Review + Comment Pydantic models
│   │   ├── feedback.py                 # Feedback model
│   │   └── user.py                     # User + settings models
│   ├── tools/                          # Agent tool definitions (for Claude tool_use)
│   │   ├── fetch_file.py
│   │   ├── search_code.py
│   │   └── fetch_tests.py
│   └── db/
│       ├── database.py                 # Async SQLAlchemy setup
│       └── migrations/                 # Alembic migrations
│
├── prompts/
│   ├── system.md                       # Core reviewer persona + output schema
│   ├── file_review.md                  # Per-file review prompt template
│   └── pr_summary.md                   # PR-level summary prompt
│
├── tests/
│   ├── test_review_agent.py            # Agent loop tests with mock diffs
│   ├── test_diff_parser.py             # Diff parsing edge cases
│   └── test_claude_service.py          # Structured output validation
│
├── .env.example                        # Template (never commit .env)
├── .gitignore
├── docker-compose.yml                  # Backend + DB + Redis
├── Makefile                            # dev, test, lint, docker shortcuts
└── README.md                           # Setup + demo + architecture diagram
```

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/auth/github` | Start GitHub OAuth flow |
| `GET` | `/auth/github/callback` | OAuth callback, store token |
| `POST` | `/webhooks/github` | Receive PR open/update/sync events |
| `POST` | `/reviews/trigger` | Manually trigger review for a PR URL |
| `GET` | `/reviews/{review_id}` | Fetch a stored review with all comments |
| `GET` | `/reviews/history` | List all past reviews (paginated) |
| `POST` | `/reviews/{review_id}/comments/{comment_id}/feedback` | Submit thumbs up/down |
| `GET` | `/settings` | Get user settings |
| `PUT` | `/settings` | Update model, rules, severity filters |
| `GET` | `/metrics` | Review accuracy, avg comments/PR, feedback stats |

---

## Claude Prompt Strategy

### System Prompt (cached across all file chunks in a review)
- Defines the reviewer persona: senior engineer, direct, actionable
- Specifies the JSON output schema
- Severity scale definitions with examples
- Custom rules from user settings (injected per-user)

### Per-File User Message
- The raw unified diff for that file
- Full file content (for context around changed lines)
- PR description summary (so the agent understands intent)
- List of available tools the agent can call

### Prompt Caching
The system prompt stays identical across all file chunks in a single PR review. Enable prompt caching to avoid re-processing it — cuts latency and cost significantly.

---

## Build Order

### Phase 1: Core Agent (Week 1)
1. `diff_parser.py` — parse GitHub diffs, chunk by file, filter lockfiles/generated
2. `claude_service.py` — send a single file diff, get structured JSON comments back
3. `review_agent.py` — loop across all files, aggregate results
4. `github_service.py` — fetch a PR diff by URL, post inline review comments
5. CLI entrypoint to test: `python -m backend.cli review <pr_url>`

### Phase 2: API + Webhooks (Week 2)
6. FastAPI endpoints — trigger review, fetch results, list history
7. GitHub OAuth — connect repos
8. Webhook receiver — auto-trigger on PR open/update
9. Background job queue — don't block the webhook response
10. Database — store reviews, comments, user settings

### Phase 3: Frontend Dashboard (Week 2-3)
11. Dashboard page — list repos, recent reviews, status
12. Review detail page — diff viewer with inline comments overlaid
13. Settings page — model selection, custom rules, severity filters
14. Feedback buttons — thumbs up/down on each comment

### Phase 4: Agent Intelligence (Week 3)
15. Tool use — let Claude call `fetch_file_content`, `search_codebase`, etc. during review
16. Cross-file analysis — detect inconsistencies across files in the same PR
17. PR summary — generate a high-level summary of the entire review
18. Smart filtering — adjust review depth by file type and risk level

### Phase 5: Polish + Metrics (Week 3-4)
19. Metrics dashboard — precision, comment volume, feedback trends
20. Feedback loop — use thumbs up/down data to refine prompts
21. README with architecture diagram, demo GIF, setup instructions
22. Deploy (Railway/Render for backend, Vercel for frontend)

---

## Gotchas & Edge Cases

- **Large diffs**: Chunk by file, skip auto-generated files (lockfiles, `.min.js`, build output). For very large files, summarize instead of sending the full content.
- **GitHub rate limits**: Batch comment posting into a single review submission (not one API call per comment). Use `create_pull_request_review` not individual comment POSTs.
- **Token limits**: Track token usage per chunk. If a file + context exceeds limits, truncate context firs*: Verify the `X-Hub-Signature-256` header on every webhook. Never trust unverified payloads.
- **Idempotency**: If a PR is updated (new push), don't duplicate reviews. Either update the existing review or dismiss the old one.
- **Cost control**: Use Sonnet for most files, only escalate to Opus for security-critical or complex logic files. Track per-review cost.

---

## What This Demonstrates to Wedge

| Competency | How This Project Shows It |
|------------|--------------------------|
| **Agentic loops** | Multi-step review pipeline with branching logic |
| **Tool use** | Claude calls tools to gather context autonomously |
| **Structured output** | Strict JSON schema, severity levels, line references |
| **Event-driven systems** | GitHub webhooks trigger autonomous review |
| **Reliability** | Error handling, retries, idempotent operations |
| **Evaluation** | Feedback loop, precision metrics, cost tracking |
| **Production readiness** | Auth, background jobs, database, deployment |

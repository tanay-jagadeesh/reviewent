Review this diff for `{filename}`:

**Change type:** {change_type}
**Changed lines:** {changed_lines}
{risk_note}

## PR Description
{pr_description}

## Diff
```
{diff_content}
```

{full_file_section}

{test_file_section}

## Instructions
- Only comment on lines that were changed (added or modified)
- Be specific — reference exact line numbers
- Be concise — no filler, no compliments, just actionable feedback
- If the code looks fine, return an empty array: []
- Always respond with valid JSON only, no markdown or extra text

You have access to these tools if you need more context:
- `fetch_file_content(path, ref)` — get full file content at a git ref
- `search_codebase(query)` — find related code (callers, imports, usages)
- `fetch_test_file(source_path)` — find the corresponding test file

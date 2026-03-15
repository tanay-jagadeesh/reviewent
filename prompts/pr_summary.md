You just reviewed a pull request with {file_count} changed files and found {comment_count} issues.

Here is a summary of all comments by file:

{comments_by_file}

Generate a high-level PR summary in this JSON format:

{{
  "summary": "One paragraph describing what this PR does and its overall quality",
  "risk_level": "low | medium | high | critical",
  "key_concerns": ["list of the most important issues found"],
  "recommendation": "approve | request_changes | comment"
}}

Guidelines:
- "approve" if no critical/warning issues
- "request_changes" if any critical issues or multiple warnings
- "comment" if only suggestions/nitpicks
- Be direct and actionable in the summary
- Always respond with valid JSON only

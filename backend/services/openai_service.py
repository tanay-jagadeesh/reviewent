# OpenAI API integration — structured code review output
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
from openai import OpenAI
from backend.services.diff_parser import FileDiff

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

with open("prompts/system.md", "r") as f:
    SYSTEM_PROMPT = f.read()

class ReviewComment(BaseModel):
    file: str
    line: int
    severity: str
    category: str
    comment: str
    suggestion: str

def review_file(file_diff: FileDiff) -> list[ReviewComment]:
 
    user_message = f"""Review this diff for {file_diff.filename}:

Changed lines: {file_diff.changed_lines}
Change type: {file_diff.change_type}

Diff:
{file_diff.diff_content}"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0,
    )

    raw = response.choices[0].message.content
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]
        raw = raw.rsplit("```", 1)[0]
    comments = json.loads(raw)

    return [ReviewComment(**c) for c in comments]

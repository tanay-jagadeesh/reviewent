# Parse unified diffs — chunk by file, extract line numbers, filter noise
from pydantic import BaseModel
import fnmatch
import re 

class FileDiff(BaseModel):
    filename: str
    change_type: str
    diff_content: str
    changed_lines: list[int]

    def parse_diff(raw_diff: str) -> list["FileDiff"]:
        not_reqs = ["package-lock.json", "poetry.lock", "yarn.lock", "*.min.js", "*.min.css", "*.png", "*.jpg", "*ico", "*.pb.go", "*.generated.*"]

        chunks = raw_diff.split('diff --git')
        chunks = [chunk for chunk in chunks if chunk.strip()]
        results = []

        for chunk in chunks:
            lines = chunk.split('\n')
            filename = ""
            change_type = "modified"
            changed_lines = []

            for line in lines:
                if line.startswith('+++ '):
                    if line == '+++ /dev/null':
                        change_type = "deleted"
                    else:
                        filename = line.removeprefix('+++ b/')
                elif line.startswith('--- '):
                    if line == '--- /dev/null':
                        change_type = "added"
                elif line.startswith('@@'):
                    changed_lines += parse_hunk(line)

            if any(fnmatch.fnmatch(filename, non_req) for non_req in not_reqs):
                continue

            results.append(FileDiff(
                filename=filename,
                change_type=change_type,
                diff_content=chunk,
                changed_lines=changed_lines,
            ))

        return results

def parse_hunk(line):
    pattern = r'\+(\d+),(\d+)'
    match = re.search(pattern, line)

    if match:
        start = int(match.group(1))
        count = int(match.group(2))

        changed = list(range(start, start + count))
        return changed

    return []

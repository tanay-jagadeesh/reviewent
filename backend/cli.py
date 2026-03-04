# CLI entrypoint — python -m backend.cli review <pr_url>

import sys
from backend.services.review_agent import run_review

def main():
    pr_url = sys.argv[2]  # python -m backend.cli review <pr_url>
    result = run_review(pr_url)
    print(result)

if __name__ == "__main__":
    main()
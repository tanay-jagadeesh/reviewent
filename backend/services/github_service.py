# GitHub API — fetch PR diffs, post inline review comments, verify webhook signatures
from dotenv import load_dotenv
import requests 
import os

load_dotenv()
url = "https://api.github.com"

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def parse_pr_url(pr_url):
    parse = pr_url.split("/")

    owner = parse[3]
    repo = parse[4]
    pr_num = parse[6]

    return owner, repo, pr_num

def fetch_diff(owner, repo, pr_num):
    api_url = url + f"/repos/{owner}/{repo}/pulls/{pr_num}"

    headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3.diff"
}

    response = requests.get(url = api_url, headers = headers)

    return response.text

def post_review(owner, repo, pr_num, comments):
    api_url = url + f"/repos/{owner}/{repo}/pulls/{pr_num}/reviews"

    body = {
        "event": "COMMENT", 
        "comments": []
    }

    for comment in comments: 
        formatted = {
            "path": comment.file, 
            "line": comment.line, 
            "body": f"[{comment.severity}] {comment.category}: {comment.comment}\n\nSuggestion: {comment.suggestion}"
        }
    
        body["comments"].append(formatted)

    response = requests.post(url = api_url, headers = headers, json = body)


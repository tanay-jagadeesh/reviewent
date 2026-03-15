# Pattern service — load repo conventions and learn new ones from reviews
from datetime import datetime, timezone
from sqlalchemy import select, create_engine
from sqlalchemy.orm import Session
from backend.models.pattern import CodebasePattern

# Sync engine for use in sync review pipeline
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./reviews.db")
# Strip async driver prefix for sync access
SYNC_URL = DATABASE_URL.replace("+aiosqlite", "")
sync_engine = create_engine(SYNC_URL)


def load_patterns(owner: str, repo: str) -> list[dict]:
    """Load learned conventions for a repo, sorted by frequency."""
    with Session(sync_engine) as session:
        result = session.execute(
            select(CodebasePattern)
            .where(CodebasePattern.owner == owner, CodebasePattern.repo == repo)
            .order_by(CodebasePattern.occurrences.desc())
            .limit(20)
        )
        patterns = result.scalars().all()
        return [
            {"category": p.category, "pattern": p.pattern, "source_file": p.source_file}
            for p in patterns
        ]


def learn_patterns(owner: str, repo: str, comments: list) -> None:
    """Extract convention-related comments and save/update as repo patterns."""
    convention_comments = [
        c for c in comments if getattr(c, "category", "") == "convention"
    ]

    if not convention_comments:
        return

    with Session(sync_engine) as session:
        for comment in convention_comments:
            # Check if a similar pattern already exists
            existing = session.execute(
                select(CodebasePattern).where(
                    CodebasePattern.owner == owner,
                    CodebasePattern.repo == repo,
                    CodebasePattern.pattern == comment.comment,
                )
            ).scalar_one_or_none()

            if existing:
                existing.occurrences += 1
                existing.last_seen_at = datetime.now(timezone.utc)
                existing.source_file = comment.file
            else:
                session.add(CodebasePattern(
                    owner=owner,
                    repo=repo,
                    pattern=comment.comment,
                    category="convention",
                    source_file=comment.file,
                ))

        session.commit()

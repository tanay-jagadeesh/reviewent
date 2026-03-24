# Pattern service — load repo conventions and learn new ones from reviews
# Gracefully degrades when no database is available (CLI-only mode)

from datetime import datetime, timezone


def _get_session():
    """Try to create a sync DB session. Returns None if DB isn't available."""
    try:
        from sqlalchemy import create_engine
        from sqlalchemy.orm import Session
        import os
        from dotenv import load_dotenv

        load_dotenv()
        db_url = os.getenv("DATABASE_URL", "sqlite:///./reviews.db")
        sync_url = db_url.replace("+aiosqlite", "")
        engine = create_engine(sync_url)
        return Session(engine)
    except Exception:
        return None


def load_patterns(owner: str, repo: str) -> list[dict]:
    """Load learned conventions for a repo. Returns [] if no DB."""
    session = _get_session()
    if not session:
        return []

    try:
        from sqlalchemy import select
        from backend.models.pattern import CodebasePattern

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
    except Exception:
        return []
    finally:
        session.close()


def learn_patterns(owner: str, repo: str, comments: list) -> None:
    """Extract convention comments and save as repo patterns. No-op without DB."""
    convention_comments = [
        c for c in comments if getattr(c, "category", "") == "convention"
    ]
    if not convention_comments:
        return

    session = _get_session()
    if not session:
        return

    try:
        from sqlalchemy import select
        from backend.models.pattern import CodebasePattern

        for comment in convention_comments:
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
    except Exception:
        pass
    finally:
        session.close()

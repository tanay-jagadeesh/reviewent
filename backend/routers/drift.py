# Review drift endpoints — track recurring issue types across PRs over time
from fastapi import APIRouter, Depends
from sqlalchemy import select, func, cast, String
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.database import get_db
from backend.models.review import Review, ReviewComment

router = APIRouter()


@router.get("/{owner}/{repo}")
async def get_drift(owner: str, repo: str, db: AsyncSession = Depends(get_db)):
    """Show which issue categories keep recurring across PRs for a repo."""
    # Get all reviews for this repo
    review_ids_q = select(Review.id).where(
        Review.owner == owner,
        Review.repo == repo,
        Review.status == "completed",
    )

    # Aggregate comments by category + severity
    result = await db.execute(
        select(
            ReviewComment.category,
            ReviewComment.severity,
            func.count(ReviewComment.id).label("count"),
        )
        .where(ReviewComment.review_id.in_(review_ids_q))
        .group_by(ReviewComment.category, ReviewComment.severity)
        .order_by(func.count(ReviewComment.id).desc())
    )
    breakdown = [
        {"category": row.category, "severity": row.severity, "count": row.count}
        for row in result.all()
    ]

    # Trend over time — count issues per review, ordered by date
    result = await db.execute(
        select(
            Review.id,
            Review.pr_number,
            Review.created_at,
            func.count(ReviewComment.id).label("issue_count"),
        )
        .join(ReviewComment)
        .where(Review.owner == owner, Review.repo == repo, Review.status == "completed")
        .group_by(Review.id)
        .order_by(Review.created_at.asc())
    )
    timeline = [
        {
            "review_id": row.id,
            "pr_number": row.pr_number,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "issue_count": row.issue_count,
        }
        for row in result.all()
    ]

    # Top recurring files
    result = await db.execute(
        select(
            ReviewComment.file,
            func.count(ReviewComment.id).label("count"),
        )
        .where(ReviewComment.review_id.in_(review_ids_q))
        .group_by(ReviewComment.file)
        .order_by(func.count(ReviewComment.id).desc())
        .limit(10)
    )
    hot_files = [
        {"file": row.file, "count": row.count}
        for row in result.all()
    ]

    return {
        "owner": owner,
        "repo": repo,
        "breakdown": breakdown,
        "timeline": timeline,
        "hot_files": hot_files,
    }

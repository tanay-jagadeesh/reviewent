# Review endpoints — trigger, fetch, list history
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.db.database import get_db
from backend.models.review import Review, ReviewComment
from backend.services.github_service import parse_pr_url
from backend.services.review_agent import run_review

router = APIRouter()


class TriggerRequest(BaseModel):
    pr_url: str


@router.post("/trigger")
async def trigger_review(body: TriggerRequest, db: AsyncSession = Depends(get_db)):
    owner, repo, pr_num = parse_pr_url(body.pr_url)

    # Create review record
    review = Review(
        pr_url=body.pr_url,
        owner=owner,
        repo=repo,
        pr_number=int(pr_num),
        status="pending",
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)

    # Run the review
    try:
        review.status = "in_progress"
        await db.commit()

        comments = run_review(body.pr_url)

        # Save comments to DB
        for c in comments:
            db_comment = ReviewComment(
                review_id=review.id,
                file=c.file if hasattr(c, "file") else c.get("file", ""),
                line=c.line if hasattr(c, "line") else c.get("line", 0),
                severity=c.severity if hasattr(c, "severity") else c.get("severity", ""),
                category=c.category if hasattr(c, "category") else c.get("category", ""),
                comment=c.comment if hasattr(c, "comment") else c.get("comment", ""),
                suggestion=c.suggestion if hasattr(c, "suggestion") else c.get("suggestion", ""),
            )
            db.add(db_comment)

        review.status = "completed"
        await db.commit()
    except Exception:
        review.status = "failed"
        await db.commit()
        raise HTTPException(status_code=500, detail="Review failed")

    return {"review_id": review.id, "status": review.status}


@router.get("/history")
async def list_reviews(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(
            Review.id,
            Review.pr_url,
            Review.status,
            Review.created_at,
            func.count(ReviewComment.id).label("comment_count"),
        )
        .outerjoin(ReviewComment)
        .group_by(Review.id)
        .order_by(Review.created_at.desc())
    )
    rows = result.all()
    return [
        {
            "id": r.id,
            "pr_url": r.pr_url,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "comment_count": r.comment_count,
        }
        for r in rows
    ]


@router.get("/{review_id}")
async def get_review(review_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review).where(Review.id == review_id).options(selectinload(Review.comments))
    )
    review = result.scalar_one_or_none()

    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    return {
        "id": review.id,
        "pr_url": review.pr_url,
        "owner": review.owner,
        "repo": review.repo,
        "pr_number": review.pr_number,
        "status": review.status,
        "created_at": review.created_at.isoformat() if review.created_at else None,
        "comments": [
            {
                "id": c.id,
                "file": c.file,
                "line": c.line,
                "severity": c.severity,
                "category": c.category,
                "comment": c.comment,
                "suggestion": c.suggestion,
            }
            for c in review.comments
        ],
    }
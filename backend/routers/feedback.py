# Feedback endpoints — thumbs up/down on review comments
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.database import get_db
from backend.models.feedback import CommentFeedback
from backend.models.review import ReviewComment

router = APIRouter()


class FeedbackRequest(BaseModel):
    helpful: bool
    note: str | None = None


@router.post("/reviews/{review_id}/comments/{comment_id}")
async def submit_feedback(
    review_id: int,
    comment_id: int,
    body: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
):
    # Verify the comment exists and belongs to this review
    result = await db.execute(
        select(ReviewComment).where(
            ReviewComment.id == comment_id,
            ReviewComment.review_id == review_id,
        )
    )
    comment = result.scalar_one_or_none()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    feedback = CommentFeedback(
        review_id=review_id,
        comment_id=comment_id,
        helpful=body.helpful,
        note=body.note,
    )
    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)

    return {"id": feedback.id, "helpful": feedback.helpful}


@router.get("/reviews/{review_id}/stats")
async def feedback_stats(review_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CommentFeedback).where(CommentFeedback.review_id == review_id)
    )
    all_feedback = result.scalars().all()

    total = len(all_feedback)
    helpful = sum(1 for f in all_feedback if f.helpful)

    return {
        "review_id": review_id,
        "total": total,
        "helpful": helpful,
        "not_helpful": total - helpful,
        "precision": round(helpful / total, 2) if total > 0 else None,
    }

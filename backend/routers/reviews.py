# Review endpoints — trigger, fetch, list history
from fastapi import APIRouter, Depends
from backend.services.review_agent import run_review
from backend.db.database import get_db
from backend.models.review import Review
from sqlalchemy import select

router = APIRouter()

@router.post("/trigger")
async def save_to_db(pr_url, db = Depends(get_db)):
    review = Review(pr_url = pr_url, status = "pending")
    run = run_review(pr_url)
    db.add(review)
    commit = await db.commit()

    return "Review Complete"

@router.get("/{review_id}")
async def get_review(review_id, db = Depends(get_db)):
    fetch =  await db.get(Review, review_id)

    return fetch

@router.get("/history")
async def list_all_revs(db = Depends(get_db)):
    result = await db.execute(select(Review))
    combined = result.scalars().all()

    return combined
# Codebase patterns endpoints — learn, list, and track repo conventions
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.database import get_db
from backend.models.pattern import CodebasePattern

router = APIRouter()


class PatternCreate(BaseModel):
    owner: str
    repo: str
    pattern: str
    category: str
    source_file: str | None = None


@router.get("/{owner}/{repo}")
async def get_patterns(owner: str, repo: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CodebasePattern)
        .where(CodebasePattern.owner == owner, CodebasePattern.repo == repo)
        .order_by(CodebasePattern.occurrences.desc())
    )
    patterns = result.scalars().all()
    return [
        {
            "id": p.id,
            "pattern": p.pattern,
            "category": p.category,
            "source_file": p.source_file,
            "occurrences": p.occurrences,
            "last_seen_at": p.last_seen_at.isoformat() if p.last_seen_at else None,
        }
        for p in patterns
    ]


@router.delete("/{pattern_id}")
async def delete_pattern(pattern_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CodebasePattern).where(CodebasePattern.id == pattern_id)
    )
    pattern = result.scalar_one_or_none()
    if pattern:
        await db.delete(pattern)
        await db.commit()
    return {"ok": True}

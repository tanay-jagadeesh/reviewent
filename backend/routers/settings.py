# User settings endpoints — model selection, custom rules, severity filters
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.database import get_db
from backend.models.user import UserSettings

router = APIRouter()


class SettingsUpdate(BaseModel):
    model: str | None = None
    custom_rules: str | None = None
    severity_filter: list[str] | None = None


# For now, use a hardcoded user_id=1 (will be replaced with auth)
DEFAULT_USER_ID = 1


@router.get("/")
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserSettings).where(UserSettings.user_id == DEFAULT_USER_ID)
    )
    settings = result.scalar_one_or_none()

    if not settings:
        # Create default settings
        settings = UserSettings(user_id=DEFAULT_USER_ID)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)

    return {
        "model": settings.model,
        "custom_rules": settings.custom_rules,
        "severity_filter": settings.severity_filter,
    }


@router.put("/")
async def update_settings(
    body: SettingsUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserSettings).where(UserSettings.user_id == DEFAULT_USER_ID)
    )
    settings = result.scalar_one_or_none()

    if not settings:
        settings = UserSettings(user_id=DEFAULT_USER_ID)
        db.add(settings)

    if body.model is not None:
        settings.model = body.model
    if body.custom_rules is not None:
        settings.custom_rules = body.custom_rules
    if body.severity_filter is not None:
        settings.severity_filter = body.severity_filter

    await db.commit()
    await db.refresh(settings)

    return {
        "model": settings.model,
        "custom_rules": settings.custom_rules,
        "severity_filter": settings.severity_filter,
    }

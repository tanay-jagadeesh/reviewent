# SQLAlchemy models — User, UserSettings
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from backend.models.review import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    github_username = Column(String, unique=True, nullable=False)
    github_token = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    model = Column(String, default="gpt-4o")  # model to use for reviews
    custom_rules = Column(Text, nullable=True)  # user-defined review rules
    severity_filter = Column(JSON, default=lambda: ["critical", "warning", "suggestion", "nitpick"])
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
